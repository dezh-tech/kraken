import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { MongoRepository } from 'typeorm';
import type { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import type { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';

import { SubscriptionEntity } from './entities/subscription.entity';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private repository: MongoRepository<SubscriptionEntity>,
  ) {}

  async findAll(options?: MongoFindManyOptions<SubscriptionEntity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options?: MongoFindOneOptions<SubscriptionEntity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: SubscriptionEntity) {
    await this.repository.save(data);
  }

  create(entityLike: DeepPartial<SubscriptionEntity>) {
    return this.repository.create(entityLike);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
