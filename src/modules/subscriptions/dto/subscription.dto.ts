import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { AbstractDto } from '../../../../src/common/dto/abstract.dto';
import { NumberField, StringField } from '../../../../src/decorators';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

export class SubscriptionDto extends AbstractDto {
  @StringField()
  subscriber: string;

  @StringField()
  checkoutSessionId: string;

  @NumberField()
  startDate: number;

  @NumberField()
  endDate: number;

  @ApiProperty()
  @IsEnum(() => SubscriptionStatusEnum)
  status: SubscriptionStatusEnum;

  @NumberField()
  totalAmount: number;

  @StringField()
  unit: string;
}
