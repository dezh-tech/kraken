import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ServiceRegistryEntity } from '../entities/service-registry.entity';
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

  @ApiProperty()
  @IsNumber()
  lastHealthCheck: number;

  @ApiProperty()
  @IsString()
  region: string;

  token: string;

  constructor(e: ServiceRegistryEntity) {
    super(e);

    this.type = e.type;
    this.status = e.status;
    this.url = e.url;
    this.heartbeatDurationInSec = e.heartbeatDurationInSec;
    this.lastHealthCheck = e.lastHealthCheck;
    this.token = e.token;
    this.region = e.region;
  }
}
