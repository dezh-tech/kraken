import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../src/common/abstract.entity';
import { ServiceRegistryDto } from '../dtos/service-registry.dto';
import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';

@Entity('service_registry')
export class ServiceRegistryEntity extends AbstractEntity<ServiceRegistryDto> {
  dtoClass = ServiceRegistryDto;

  @Column({
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.RELAY,
  })
  type: ServiceType;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'int', default: 10 })
  heartbeatDurationInSec: number;

  @Column({ type: 'int', default: 0 })
  lastHealthCheck: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'varchar' })
  region: string;

  constructor(item?: Partial<ServiceRegistryEntity>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<ServiceRegistryEntity>): void {
    super.assign(item);

    this.type = item.type ?? this.type;
    this.status = item.status ?? this.status;
    this.url = item.url ?? this.url;
    this.heartbeatDurationInSec = item.heartbeatDurationInSec ?? this.heartbeatDurationInSec;
    this.lastHealthCheck = item.lastHealthCheck ?? this.lastHealthCheck;
    this.token = item.token ?? this.token;
    this.region = item.region ?? this.region;
  }
}
