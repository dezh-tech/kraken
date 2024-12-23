import { NumberFieldOptional } from '../../../../src/decorators';

export class RetentionDto {
  @NumberFieldOptional()
  time: number | null;

  @NumberFieldOptional()
  count: number | null;

  @NumberFieldOptional({ isArray: true, each: true })
  kinds: number[][] | null;
}
