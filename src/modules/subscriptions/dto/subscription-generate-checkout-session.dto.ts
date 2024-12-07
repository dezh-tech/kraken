import { PickType } from '@nestjs/swagger';

import { SubscriptionDto } from './subscription.dto';

export class SubscriptionGenerateCheckoutSessionDto extends PickType(SubscriptionDto, ['subscriber'] as const) {}
