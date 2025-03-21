import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import axios from 'axios';
import Redis from 'ioredis';
import { hexToBytes } from '@noble/hashes/utils';

import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { ConfigService } from '../config/config.service';
import { SubscriptionRepository } from './subscriptions.repository';
import { ObjectId } from 'typeorm';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatusEnum } from './enums/subscription-status.enum';
import { InvoiceService } from '../invoices/invoice.service';
import { InvoiceStatusEnum } from '../invoices/enums/invoice-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { nip19 } from 'nostr-tools';
import { TransporterService } from '../notification/transporter-factory.service';
import { ITransporter } from '../notification/transporter.interface';
import { SubscriptionEntity } from './entities/subscription.entity';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';

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
    private readonly InvoiceService: InvoiceService,
  ) {
    this.nostrNotification = TransporterService.createNostrTransporter(
      hexToBytes(this.apiConfig.getNostrConfig.privateKey),
      this.apiConfig.getNostrConfig.relays,
    );
  }

  async generateCheckoutSession(npub: `npub1${string}`, planId: string) {
    let pubkey: string;
    try {
      pubkey = nip19.decode<'npub'>(npub).data;
    } catch (err) {
      throw new BadRequestException('invalid npub');
    }

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'speed-version': '2022-04-15',
      authorization: `Basic ${Buffer.from(`${this.apiConfig.trySpeedConfig.apiKey}:`).toString('base64')}`,
    };

    const config = await this.configService.getNip11();

    const isSubscriptionPlanExist = config && config.fees && (config.fees.subscription ?? []).length > 0;
    if (!isSubscriptionPlanExist) {
      throw new NotFoundException('subscription plan not found.');
    }

    const subscription = config.fees?.subscription?.find((s) => s.period === Number(planId));

    if (!subscription) {
      throw new NotFoundException('subscription plan not found.');
    }

    const data = {
      currency: subscription?.unit,
      amount: subscription?.amount,
      payment_methods: ['lightning'],
      amount_paid_tolerance: 1,
      metadata: { pubkey, planId },
      success_url: this.apiConfig.trySpeedConfig.successfulPaymentUrl,
      cancel_url: this.apiConfig.trySpeedConfig.failedPaymentUrl,
    };

    let checkoutSessionUrl: string;

    try {
      checkoutSessionUrl = (await axios.post(this.apiUrl, data, { headers })).data.url;
    } catch (error) {
      console.error('Error generating checkout session:', error.response?.data || error.message);

      throw new Error('Could not generate checkout session');
    }

    return checkoutSessionUrl;
  }

  async CheckoutSessionCompleteHandler(
    checkoutSessionId: string,
    pubkey: string,
    planId: string,
    totalAmount: number,
    unit: string,
  ) {
    const config = await this.configService.getNip11();

    const isSubscriptionPlanExist = config && config.fees && (config.fees.subscription ?? []).length > 0;
    if (!isSubscriptionPlanExist) {
      throw new NotFoundException('subscription plan not found.');
    }

    const subscription = config.fees?.subscription?.find((s) => s.period === Number(planId));

    if (!subscription) {
      throw new NotFoundException('subscription plan not found.');
    }

    const a = await this.subscriptionRepository.findOne({
      where: {
        subscriber: pubkey,
        status: SubscriptionStatusEnum.ACTIVE,
      },
    });

    if (a) {
      const period = subscription.period;
      a.endDate = a.endDate + period;

      await this.subscriptionRepository.save(a);
    } else {
      const startDate = Math.floor(Date.now() / 1000); // sec
      const period = subscription.period; // sec
      const endDate = startDate + period;

      const sub = this.subscriptionRepository.create({
        subscriber: pubkey,
        startDate,
        endDate,
        status: SubscriptionStatusEnum.ACTIVE,
      });

      await this.redis.call('CF.ADD', 'IMMO_WHITE_LIST', pubkey);

      await this.subscriptionRepository.save(sub);
    }

    await this.InvoiceService.create({
      status: InvoiceStatusEnum.PAID,
      checkoutSessionId,
      totalAmount,
      unit,
    });

    await this.nostrNotification.sendNotification(
      `Welcome to Jellyfish – Premium Access Activated!

      Thank you for subscribing to Jellyfish ecosystem! 🎉 Your premium access is now active, and you can start relaying messages with enhanced reliability, speed, and privacy.

      Here’s what you need to get started:
      ✅ Relay URL: wss://jellyfish.land
      ✅ Support & Updates: Follow us on Nostr: @nostr:npub1hu47u55pzjw8cdg0t5f2uvh4znrcvnl3pqz3st6p0pfcctzzzqrsplc46u
      ✅ Need help? Reach out at hi@dezh.tech.

      We appreciate your support in building a better decentralized future. Enjoy your experience! 🚀

      Best,
      Jellyfish Team🪼`,
      pubkey,
    );
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

      return;
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

  @Cron(CronExpression.EVERY_30_MINUTES)
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
        const daysBeforeExpiration = Math.ceil((s.endDate - now) / (24 * 60 * 60 * 1000));

        if (s.endDate <= now) {
          // Subscription expired
          pipeline.call('CF.DEL', 'IMMO_WHITE_LIST', s.subscriber);

          await this.updateSubscription(s._id, {
            status: SubscriptionStatusEnum.EXPIRED,
          });

          await this.nostrNotification.sendNotification(
            `Your Subscription to Jellyfish Has Expired

            Your subscription to Jellyfish ecosystem has expired. We'd love to keep you connected! To continue enjoying reliable and fast relaying, please renew your subscription.

            🔄 Renew Now: https://jellyfish.land/relay
            🚀 Relay URL: wss://jellyfish.land (Access will be restricted until renewal)
            💬 Need help? Contact us at hi@dezh.tech

            Thank you for being part of our relay network. We hope to see you back soon!

            Best,
            Jellyfish Team🪼`,
            s.subscriber,
          );
        } else if (daysBeforeExpiration === 5 || daysBeforeExpiration === 1) {
          await this.nostrNotification.sendNotification(
            `Reminder: Your Jellyfish Subscription Expires in ${daysBeforeExpiration} Day${daysBeforeExpiration > 1 ? 's' : ''}

            Your subscription to Jellyfish ecosystem will expire in **${daysBeforeExpiration} day${daysBeforeExpiration > 1 ? 's' : ''}**. To avoid any interruptions, renew your subscription today!

            🔄 Renew Now: https://jellyfish.land/relay
            🚀 Relay URL: wss://jellyfish.land
            💬 Need help? Contact us at hi@dezh.tech

            Stay Immortal!

            Best,
            Jellyfish Team🪼`,
            s.subscriber,
          );
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
