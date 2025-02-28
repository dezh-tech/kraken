import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { AbstractDto } from '../../../../src/common/dto/abstract.dto';
import { NumberField, StringField, StringFieldOptional } from '../../../../src/decorators';
import { InvoiceStatusEnum } from '../enums/invoice-status.enum';

export class InvoiceDto extends AbstractDto {
  @StringFieldOptional()
  subscriptionId?: string;

  @StringField()
  checkoutSessionId: string;

  @ApiProperty()
  @IsEnum(() => InvoiceStatusEnum)
  status: InvoiceStatusEnum;

  @NumberField()
  totalAmount: number;

  @StringField()
  unit: string;
}
