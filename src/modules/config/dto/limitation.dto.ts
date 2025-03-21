import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class LimitationDto {
  @ApiProperty()
  @IsInt()
  max_message_length?: number;

  @ApiProperty()
  @IsInt()
  max_subscriptions?: number;

  @ApiProperty()
  @IsInt()
  max_subid_length?: number;

  @ApiProperty()
  @IsInt()
  min_pow_difficulty?: number;

  @ApiProperty()
  @IsBoolean()
  auth_required?: boolean;

  @ApiProperty()
  @IsBoolean()
  payment_required?: boolean;

  @ApiProperty()
  @IsBoolean()
  restricted_writes?: boolean;

  @ApiProperty()
  @IsInt()
  max_event_tags?: number;

  @ApiProperty()
  @IsInt()
  max_content_length?: number;

  @ApiProperty()
  @IsInt()
  created_at_lower_limit?: number;

  @ApiProperty()
  @IsInt()
  created_at_upper_limit?: number;

  @ApiProperty()
  @IsInt()
  max_limit?: number;

  @ApiProperty()
  @IsInt()
  default_limit?: number;
}
