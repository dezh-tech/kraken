import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';

export class ServiceRegistryDto extends AbstractDto {
  _id: string;

  @ApiProperty()
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty()
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  heartbeatDurationInSec: number;
}
