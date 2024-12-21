import { ApiProperty } from '@nestjs/swagger';
import { NumberFieldOptional, StringFieldOptional } from '../../../../src/decorators';

export class SubscriptionDto {
  @ApiProperty({ required: false })
  @NumberFieldOptional()
  amount: number;

  @ApiProperty({ required: false })
  @StringFieldOptional()
  unit: string;

  @ApiProperty({ required: false })
  @NumberFieldOptional()
  period: number;
}

export class PublicationDto {
  @ApiProperty({ type: [Number], required: false })
  @NumberFieldOptional({ each: true, isArray: true })
  kinds: number[];

  @ApiProperty({ required: false })
  @NumberFieldOptional()
  amount: number;

  @ApiProperty({ required: false })
  @StringFieldOptional()
  unit: string;
}

export class AdmissionDto {
  @ApiProperty({ required: false })
  @NumberFieldOptional()
  amount: number;

  @ApiProperty({ required: false })
  @StringFieldOptional()
  unit: string;
}

export class FeesDto {
  @ApiProperty({ type: [SubscriptionDto], required: false })
  subscription?: SubscriptionDto[];

  @ApiProperty({ type: [PublicationDto], required: false })
  publication?: PublicationDto[];

  @ApiProperty({ type: [AdmissionDto], required: false })
  admission?: AdmissionDto[];
}
