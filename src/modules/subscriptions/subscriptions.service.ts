import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { hexToBytes } from '@noble/hashes/utils';
import axios from 'axios';
import Redis from 'ioredis';
import { Event, finalizeEvent, kinds, nip19, Relay, SimplePool } from 'nostr-tools';
import { lastValueFrom } from 'rxjs';
import { ObjectId } from 'typeorm';
import type { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';

import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { ConfigService } from '../config/config.service';
import { SeasnailGrpcClient } from '../grpc/seasnail-grpc.client';
import { InvoiceStatusEnum } from '../invoices/enums/invoice-status.enum';
import { InvoiceService } from '../invoices/invoice.service';
import type { ITransporter } from '../notification/transporter.interface';
import { TransporterService } from '../notification/transporter-factory.service';
import { ServiceType } from '../service-registry/enums/service-types.enum';
import ServiceRegistryService from '../service-registry/services/service-registry.service';
import type { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import type { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionStatusEnum } from './enums/subscription-status.enum';
import { SubscriptionTemplate } from './notify-template';
import { SubscriptionRepository } from './subscriptions.repository';
import { webcrypto } from 'node:crypto';

const semver = require('semver');

const nodeVersion = process.version;

if (semver.lt(nodeVersion, '20.0.0')) {
  // polyfills for node 18
  global.crypto = require('node:crypto');
  global.WebSocket = require('isomorphic-ws');
} else {
  // polyfills for node 20
  if (!globalThis.crypto) {
    globalThis.crypto = webcrypto as unknown as Crypto;
  }

  global.WebSocket = require('isomorphic-ws');
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  private readonly apiUrl = 'https://api.tryspeed.com/checkout-sessions';

  private readonly nostrNotification: ITransporter;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly apiConfig: ApiConfigService,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly configService: ConfigService,
    private readonly invoiceService: InvoiceService,
    private readonly seasnailClient: SeasnailGrpcClient,
    private readonly serviceRegistry: ServiceRegistryService,
  ) {
    this.nostrNotification = TransporterService.createNostrTransporter(
      hexToBytes(this.apiConfig.getNostrConfig.privateKey),
      this.apiConfig.getNostrConfig.relays,
    );

    void this.seedRedis();
  }

  private async getSubscriptionPlan(planId: string) {
    const config = await this.configService.getNip11();
    const plans = config.fees?.subscription ?? [];
    const plan = plans.find((p) => p.period === Number(planId));

    if (!plan) {
      throw new NotFoundException('subscription plan not found.');
    }

    return plan;
  }

  private async createInvoiceRecord(checkoutSessionId: string, totalAmount: number, unit: string) {
    await this.invoiceService.create({
      status: InvoiceStatusEnum.PAID,
      checkoutSessionId,
      totalAmount,
      unit,
    });
  }

  private async notifyUser(message: string, pubkey: string) {
    await this.nostrNotification.sendNotification(message, pubkey);
  }

  private async addToWhitelist(pubkey: string) {
    await this.redis.call('CF.ADD', 'IMMO_WHITE_LIST', pubkey);
  }

  private async removeFromWhitelist(pubkey: string) {
    await this.redis.call('CF.DEL', 'IMMO_WHITE_LIST', pubkey);
  }

  async generateCheckoutSession(npub: `npub1${string}`, planId: string) {
    let pubkey: string;

    try {
      pubkey = nip19.decode<'npub'>(npub).data;
    } catch {
      throw new BadRequestException('invalid npub');
    }

    const wotConf = this.apiConfig.webOfTrustConfig;
    const createdAt = Math.floor(Date.now() / 1000);

    const event = {
      kind: 5312,
      created_at: createdAt,
      tags: [
        ['param', 'target', pubkey],
        ['param', 'limit', '1'],
      ],
      content: '',
    };

    const signedEvent = finalizeEvent(event, hexToBytes(this.apiConfig.getNostrConfig.privateKey));

    const relay = await Relay.connect(wotConf.relay);
    await relay.publish(signedEvent);

    await new Promise<void>((resolve, reject) => {
      const pool = new SimplePool();
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          pool.close([wotConf.relay]);
          resolve();
        }
      }, 4000); // 4 seconds

      pool.subscribeMany(
        [wotConf.relay],
        [
          {
            '#p': [signedEvent.pubkey],
            '#e': [signedEvent.id],
          },
        ],
        {
          onevent(event: Event) {
            if (resolved) return;

            try {
              const { rank } = JSON.parse(event.content)[0] as { rank: string };

              pool.close([wotConf.relay]);
              clearTimeout(timeout);
              resolved = true;

              if (parseFloat(rank) < parseFloat(wotConf.relayMinRank)) {
                reject(new BadRequestException('pubkey rank is too low'));
              } else {
                resolve();
              }
            } catch (err) {
              pool.close([wotConf.relay]);
              clearTimeout(timeout);
              resolved = true;
              reject(new Error('Failed to parse rank event'));
            }
          },
        },
      );
    });

    const subscription = await this.getSubscriptionPlan(planId);

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'speed-version': '2022-04-15',
      authorization: `Basic ${Buffer.from(`${this.apiConfig.trySpeedConfig.apiKey}:`).toString('base64')}`,
    };

    const data = {
      currency: subscription.unit,
      amount: subscription.amount,
      payment_methods: ['lightning'],
      amount_paid_tolerance: 1,
      metadata: { pubkey, planId },
      success_url: this.apiConfig.trySpeedConfig.successfulPaymentUrl,
      cancel_url: this.apiConfig.trySpeedConfig.failedPaymentUrl,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      return response.data.url;
    } catch (error) {
      this.logger.error('Error generating checkout session:', error.response?.data || error.message);
      throw new Error('Could not generate checkout session');
    }
  }

  async handleRelayCheckout(
    checkoutSessionId: string,
    pubkey: string,
    planId: string,
    totalAmount: number,
    unit: string,
  ) {
    const plan = await this.getSubscriptionPlan(planId);
    const now = Math.floor(Date.now() / 1000);

    let subscription = await this.subscriptionRepository.findOne({
      where: { subscriber: pubkey, status: SubscriptionStatusEnum.ACTIVE },
    });

    if (subscription) {
      subscription.endDate += plan.period;
    } else {
      subscription = this.subscriptionRepository.create({
        subscriber: pubkey,
        startDate: now,
        endDate: now + plan.period,
        status: SubscriptionStatusEnum.ACTIVE,
      });
      await this.addToWhitelist(pubkey);
    }

    await this.subscriptionRepository.save(subscription);
    await this.createInvoiceRecord(checkoutSessionId, totalAmount, unit);
    await this.notifyUser(SubscriptionTemplate.welcomeRelay().content, pubkey);

    return true;
  }

  async handleNip05Checkout(
    checkoutSessionId: string,
    pubkey: string,
    name: string,
    domainId: string,
    totalAmount: number,
    unit: string,
  ) {
    const service = await this.serviceRegistry.findOneByType(ServiceType.NIP05);

    if (!service) {
      throw new InternalServerErrorException('NIP-05 service not available');
    }

    this.seasnailClient.setUrl(service.url);
    const res = await lastValueFrom(
      this.seasnailClient.identifierServiceClient.registerIdentifier({ domainId, name, user: pubkey, expireAt: 0 }),
    );

    await this.createInvoiceRecord(checkoutSessionId, totalAmount, unit);
    await this.notifyUser(SubscriptionTemplate.welcomeNip05(res.fullIdentifier).content, pubkey);

    return true;
  }

  async seedRedis() {
    try {
      const now = Math.floor(Date.now() / 1000); // sec
      const subscriptions = await this.subscriptionRepository.findAll({
        where: {
          endDate: { $gt: now },
        },
      });

      if (subscriptions.length === 0) {
        this.logger.warn('No subscriptions found with endDate > now.');

        return;
      }

      this.logger.log(`Found ${subscriptions.length} subscriptions to add to Redis.`);

      const pipeline = this.redis.pipeline();

      for (const subscription of subscriptions) {
        pipeline.call('CF.ADD', 'IMMO_WHITE_LIST', subscription.subscriber);
      }

      const results = await pipeline.exec();

      this.logger.log(`Pipeline executed with ${results?.length} commands.`);
    } catch (error) {
      this.logger.error('An error occurred during seedRedis execution.', (error as { stack: string }).stack);
    }
  }

  async updateSubscription(id: ObjectId, props: UpdateSubscriptionDto) {
    const s = await this.subscriptionRepository.findOne({ where: { _id: id } });

    if (!s) {
      throw new NotFoundException('subscription not found');
    }

    s.assign({
      ...props,
    });

    await this.subscriptionRepository.save(s);
  }

  async deleteSubscription(id: string) {
    const s = await this.subscriptionRepository.findOne({ where: { _id: new ObjectId(id) } });

    if (!s) {
      throw new NotFoundException('subscription not found');
    }

    await this.subscriptionRepository.delete(id);

    await this.redis.call('CF.DEL', 'IMMO_WHITE_LIST', s.subscriber);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredSubscriptions() {
    this.logger.log('Running daily cleanup of expired subscriptions...');

    try {
      const now = Math.floor(Date.now() / 1000); // sec

      const activeSubscriptions = await this.subscriptionRepository.findAll({
        where: {
          status: SubscriptionStatusEnum.ACTIVE,
        },
      });

      if (activeSubscriptions.length === 0) {
        this.logger.log('No active subscriptions.');

        return;
      }

      const pipeline = this.redis.pipeline();

      for await (const s of activeSubscriptions) {
        const daysBeforeExpiration = Math.ceil((s.endDate - now) / (24 * 60 * 60));

        if (s.endDate <= now) {
          // Subscription expired
          pipeline.call('CF.DEL', 'IMMO_WHITE_LIST', s.subscriber);

          await this.updateSubscription(s._id, {
            status: SubscriptionStatusEnum.EXPIRED,
          });

          await this.notifyUser(SubscriptionTemplate.expired().content, s.subscriber);
        } else if (daysBeforeExpiration === 5 || daysBeforeExpiration === 1) {
          await this.notifyUser(SubscriptionTemplate.reminder(daysBeforeExpiration).content, s.subscriber);
        }
      }

      await pipeline.exec();

      this.logger.log(`Successfully removed ${activeSubscriptions.length} expired subscriptions.`);

      await this.seedRedis();
    } catch (error) {
      this.logger.error('Error while removing expired subscriptions.', error.stack);
    }
  }

  async getRemainingOfSubscription(pubkey: string) {
    const now = Math.floor(Date.now() / 1000); // Convert to seconds

    const sub = await this.subscriptionRepository.findOne({
      where: {
        subscriber: pubkey,
        endDate: { $gt: now },
        status: SubscriptionStatusEnum.ACTIVE,
      },
    });

    if (!sub) {
      return 0;
    }

    return sub.endDate - now;
  }

  async findOne(opt: MongoFindOneOptions<SubscriptionEntity>) {
    const sub = await this.subscriptionRepository.findOne(opt);

    if (!sub) {
      throw new NotFoundException('subscription not found');
    }

    return sub;
  }
}
