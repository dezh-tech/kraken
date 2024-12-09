import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { LogEntity } from '../entities/log.entity';

export class LogDto extends AbstractDto {
  _id: string;

  stack: string;

  message: string;

  serviceId: string;

  constructor(e: LogEntity) {
    super(e);

    this.stack = e.stack;
    this.message = e.message;
    this.serviceId = e.serviceId;
  }
}
