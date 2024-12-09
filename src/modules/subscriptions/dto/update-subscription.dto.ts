import { PartialType, PickType } from '@nestjs/swagger';

import { SubscriptionDto } from './subscription.dto';

export class UpdateSubscriptionDto extends PartialType(
  PickType(SubscriptionDto, [
    'checkoutSessionId',
    'endDate',
    'startDate',
    'status',
    'subscriber',
    'totalAmount',
    'unit',
  ] as const),
) {}
