import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import axios from 'axios';
import Redis from 'ioredis';

import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { ConfigService } from '../config/config.service';
import { SubscriptionRepository } from './subscriptions.repository';
import { MoreThan, ObjectId } from 'typeorm';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  private readonly apiUrl = 'https://api.tryspeed.com/checkout-sessions';

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly apiConfig: ApiConfigService,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly configService: ConfigService,
  ) {}

  async generateCheckoutSession(npub: string) {
    // if (!/^npub1([A-HJ-NP-Z0-9]{32})$/.test(npub)) {
    //   throw new BadRequestException('invalid npub provided.');
    // }

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'speed-version': '2022-04-15',
      authorization: `Basic ${Buffer.from(`${this.apiConfig.trySpeedConfig.apiKey}:`).toString('base64')}`,
    };

    const config = await this.configService.getConfig();

    if (!config?.fees) {
      throw new NotFoundException('subscription plan not found.');
    }

    const data = {
      currency: config.fees.subscription ? config.fees.subscription[0]?.unit : 'SATS',
      amount: config.fees.subscription ? config.fees.subscription[0]?.amount : 0,
      payment_methods: ['lightning'],
      amount_paid_tolerance: 1,
      metadata: { npub },
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });

      return response.data;
    } catch (error) {
      console.error('Error generating checkout session:', error.response?.data || error.message);

      throw new Error('Could not generate checkout session');
    }
  }

  async CheckoutSessionCompleteHandler(
    checkoutSessionId: string,
    subscriber: string,
    totalAmount: number,
    unit: string,
  ) {
    const config = await this.configService.getConfig();

    if (!config?.fees) {
      throw new NotFoundException('Subscription plan not found.');
    }

    const startDate = Date.now();
    const period = config.fees.subscription ? config.fees.subscription[0]?.period : null;
    const endDate = startDate + (period ?? 86_400) * 1000;

    const sub = this.subscriptionRepository.create({
      checkoutSessionId,
      subscriber,
      totalAmount,
      unit,
      startDate,
      endDate,
    });

    await this.redis.call('CF.ADD', 'SUBSCRIPTIONS', subscriber);

    await this.subscriptionRepository.save(sub);
  }

  async seedRedis() {
    try {
      const now = Date.now();
      const subscriptions = await this.subscriptionRepository.findAll({
        where: {
          endDate: MoreThan(now),
        },
      });

      if (subscriptions.length === 0) {
        this.logger.warn('No subscriptions found with endDate > now.');

        return;
      }

      this.logger.log(`Found ${subscriptions.length} subscriptions to add to Redis.`);

      const pipeline = this.redis.pipeline();

      for (const subscription of subscriptions) {
        pipeline.call('CF.ADD', 'SUBSCRIPTIONS', subscription.subscriber);
      }

      const results = await pipeline.exec();

      this.logger.log(`Pipeline executed with ${results?.length} commands.`);
    } catch (error) {
      this.logger.error('An error occurred during seedRedis execution.', (error as { stack: string }).stack);
    }
  }

  async updateSubscription(id: string, props: UpdateSubscriptionDto) {
    const s = await this.subscriptionRepository.findOne({ where: { _id: new ObjectId(id) } });

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

    await this.redis.call('CF.DEL', 'SUBSCRIPTIONS', s.subscriber);
  }
}
