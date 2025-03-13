import * as crypto from 'node:crypto';

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { SubscriptionGenerateCheckoutSessionDto } from './dto/subscription-generate-checkout-session.dto';
import { SubscriptionsService } from './subscriptions.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { Nip98AuthGuard } from '../auth/guards/nip98-auth.guard';
import { Request } from 'express';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  @Post('checkout-session')
  async generateCheckoutSession(@Body() args: SubscriptionGenerateCheckoutSessionDto) {

    if(!args.subscriber.startsWith('npub1')){
      throw new BadRequestException('invalid npub')
    }

    const data = await this.subscriptionService.generateCheckoutSession(
      args.subscriber as `npub1${string}`,
      args.planId,
    );
    return data;
  }

  @Post('webhook')
  async webhook(
    @Headers('webhook-signature') signature: string,
    @Headers('webhook-timestamp') timestamp: string,
    @Headers('webhook-id') webhookId: string,
    @Body() body: any,
  ) {
    const secret = this.apiConfig.trySpeedConfig.webhookSecret;

    const isValid = this.verifySignature(secret, signature, webhookId, timestamp, body);

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const bodyString = body.toString('utf-8');
    const parsedBody = JSON.parse(bodyString);

    if (parsedBody.event_type === 'checkout_session.paid') {
      await this.subscriptionService.CheckoutSessionCompleteHandler(
        parsedBody.data.object.id,
        parsedBody.data.object.metadata.pubkey,
        parsedBody.data.object.metadata.planId,
        parsedBody.data.object.amount,
        parsedBody.data.object.target_currency,
      );
    }

    return { success: true };
  }

  verifySignature(
    secret: string,
    signature: string,
    webhookId: string,
    timestamp: string,
    requestBody: string,
  ): boolean {
    try {
      signature = signature.slice(3);

      const cleanedSecret = secret.replace('wsec_', '');

      const tempSecret = Buffer.from(cleanedSecret, 'base64');

      const signedPayload = `${webhookId}.${timestamp}.${requestBody}`;

      const hmac = crypto.createHmac('sha256', tempSecret);
      hmac.update(signedPayload, 'utf8');
      const expectedSignature = hmac.digest('base64');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Error during signature verification:', error);

      throw new UnauthorizedException('Invalid signature');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('seedRedis')
  seedRedis() {
    return this.subscriptionService.seedRedis();
  }

  @Get('remaining')
  @UseGuards(Nip98AuthGuard)
  remaining(@Req() req: Request) {
    return this.subscriptionService.getRemainingOfSubscription((req.user as { pubkey: string })?.pubkey);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  updateSubscription(@Param('id') id: string, @Body() props: UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(id, props);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteSubscription(@Param('id') id: string) {
    return this.subscriptionService.deleteSubscription(id);
  }
}
