import { PickType } from '@nestjs/swagger';

import { StringField } from '../../../../src/decorators';
import { SubscriptionDto } from './subscription.dto';

export class SubscriptionGenerateCheckoutSessionDto extends PickType(SubscriptionDto, ['subscriber'] as const) {
  @StringField()
  planId: string;
}
