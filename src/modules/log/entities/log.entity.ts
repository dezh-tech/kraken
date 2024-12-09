import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LogDto } from '../dtos/log.dto';

@Entity('logs')
export class LogEntity extends AbstractEntity<LogDto> {
  dtoClass = LogDto;

  @Column({ type: 'text' })
  stack: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar' })
  serviceId: string;

  constructor(item?: Partial<LogEntity>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<LogEntity>): void {
    super.assign(item);

    this.stack = item.stack ?? this.stack;
    this.message = item.message ?? this.message;
    this.serviceId = item.serviceId ?? this.serviceId;
  }
}
