import { AbstractDto } from '../../../../src/common/dto/abstract.dto';
import { StringField } from '../../../../src/decorators';
import type { SubscriptionStatus } from '../enums/subscription-status.enum';

export class SubscriptionDto extends AbstractDto {
  @StringField()
  subscriber: string;

  checkoutSessionId: string;

  startDate: Date;

  endDate: Date;

  status: SubscriptionStatus;

  totalAmount: number;

  unit: string;
}
