import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class LimitationDto {
  @ApiProperty()
  @IsInt()
  maxMessageLength?: number;

  @ApiProperty()
  @IsInt()
  maxSubscriptions?: number;

  @ApiProperty()
  @IsInt()
  maxFilters?: number;

  @ApiProperty()
  @IsInt()
  maxSubidLength?: number;

  @ApiProperty()
  @IsInt()
  minPowDifficulty?: number;

  @ApiProperty()
  @IsBoolean()
  authRequired?: boolean;

  @ApiProperty()
  @IsBoolean()
  paymentRequired?: boolean;

  @ApiProperty()
  @IsBoolean()
  restrictedWrites?: boolean;

  @ApiProperty()
  @IsInt()
  maxEventTags?: number;

  @ApiProperty()
  @IsInt()
  maxContentLength?: number;

  @ApiProperty()
  @IsInt()
  createdAtLowerLimit?: number;

  @ApiProperty()
  @IsInt()
  createdAtUpperLimit?: number;

  @ApiProperty()
  @IsInt()
  maxQueryLimit?: number;

  @ApiProperty()
  @IsInt()
  defaultQueryLimit?: number;
}
