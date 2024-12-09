import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';

import { LogEntity } from './entities/log.entity';

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(LogEntity)
    private repository: Repository<LogEntity>,
  ) {}

  async findAll(options?: FindManyOptions<LogEntity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options: FindOneOptions<LogEntity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: LogEntity): Promise<LogEntity> {
    return this.repository.save(data);
  }

  create(entityLike: DeepPartial<LogEntity>) {
    return this.repository.create(entityLike);
  }
}
