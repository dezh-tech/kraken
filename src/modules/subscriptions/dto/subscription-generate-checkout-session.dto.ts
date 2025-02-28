import { PickType } from '@nestjs/swagger';

import { SubscriptionDto } from './subscription.dto';
import { StringField } from '../../../../src/decorators';

export class SubscriptionGenerateCheckoutSessionDto extends PickType(SubscriptionDto, ['subscriber'] as const) {
  @StringField()
  planId: string;
}
