import { NumberFieldOptional } from '../../../../src/decorators';

export class RetentionDto {
  @NumberFieldOptional()
  time?: number;

  @NumberFieldOptional()
  count?: number;

  @NumberFieldOptional({ isArray: true, each: true })
  kinds?: number[];
}
