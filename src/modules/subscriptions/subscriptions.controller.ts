import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import * as crypto from 'crypto';
import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { SubscriptionGenerateCheckoutSessionDto } from './dto/subscription-generate-checkout-session.dto';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    private readonly apiConfig: ApiConfigService,
  ) {}

  @Post('checkout-session')
  async generateCheckoutSession(@Body() args: SubscriptionGenerateCheckoutSessionDto) {
    const data =  await this.subscriptionService.generateCheckoutSession(args.subscriber);
    return data.url
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
        parsedBody.data.object.metadata.npub,
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

      const isSignatureValid = signature === expectedSignature;

      return isSignatureValid;
    } catch (error) {
      console.error('Error during signature verification:', error);
      throw new UnauthorizedException('Invalid signature');
    }
  }
}
