import { NumberFieldOptional, StringFieldOptional } from '../../../../src/decorators';

export class SubscriptionDto {
  @NumberFieldOptional()
  amount: number;

  @StringFieldOptional()
  unit: string;

  @NumberFieldOptional()
  period: number;
}

export class PublicationDto {
  @NumberFieldOptional({ each: true, isArray: true })
  kinds: number[];

  @NumberFieldOptional()
  amount: number;

  @StringFieldOptional()
  unit: string;
}

export class AdmissionDto {
  @NumberFieldOptional()
  amount: number;

  @StringFieldOptional()
  unit: string;
}

export class FeesDto {
  subscription?: SubscriptionDto[];

  publication?: PublicationDto[];

  admission?: AdmissionDto[];
}
