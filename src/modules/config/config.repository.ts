import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { MongoRepository } from 'typeorm';

import { ConfigEntity } from './entities/config.entity';

@Injectable()
export class ConfigRepository {
  constructor(
    @InjectRepository(ConfigEntity)
    private repository: MongoRepository<ConfigEntity>,
  ) {}

  async findAll(options?: FindManyOptions<ConfigEntity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options?: FindOneOptions<ConfigEntity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: ConfigEntity) {
    return this.repository.save(data);
  }

  create(entityLike: DeepPartial<ConfigEntity>) {
    return this.repository.create(entityLike);
  }
}
