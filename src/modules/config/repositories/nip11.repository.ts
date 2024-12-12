import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { MongoRepository } from 'typeorm';

import { Nip11Entity } from '../entities/nip11.entity';

@Injectable()
export class Nip11Repository {
  constructor(
    @InjectRepository(Nip11Entity)
    private repository: MongoRepository<Nip11Entity>,
  ) {}

  async findAll(options?: FindManyOptions<Nip11Entity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options?: FindOneOptions<Nip11Entity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: Nip11Entity) {
    await this.repository.save(data);
  }

  create(entityLike: DeepPartial<Nip11Entity>) {
    return this.repository.create(entityLike);
  }
}
