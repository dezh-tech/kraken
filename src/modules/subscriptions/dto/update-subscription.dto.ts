import { PartialType, PickType } from '@nestjs/swagger';

import { SubscriptionDto } from './subscription.dto';

export class UpdateSubscriptionDto extends PartialType(
  PickType(SubscriptionDto, [
    'endDate',
    'startDate',
    'status',
    'subscriber',
  ] as const),
) {}
