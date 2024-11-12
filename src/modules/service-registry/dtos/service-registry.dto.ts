import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';

export class ServiceRegistryDto {
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
  heartbeat_duration_in_sec: number;
}
