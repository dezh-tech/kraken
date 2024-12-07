import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { ConfigService } from '../config/config.service';
import { SubscriptionRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  private readonly apiUrl = 'https://api.tryspeed.com/checkout-sessions';

  constructor(
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

    await this.subscriptionRepository.save(sub);
  }
}
