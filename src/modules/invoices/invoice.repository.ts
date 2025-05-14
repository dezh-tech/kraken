import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { MongoRepository } from 'typeorm';

import { InvoiceEntity } from './entities/invoice.entity';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private repository: MongoRepository<InvoiceEntity>,
  ) {}

  async findAll(options?: FindManyOptions<InvoiceEntity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options?: FindOneOptions<InvoiceEntity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: InvoiceEntity) {
    await this.repository.save(data);
  }

  create(entityLike: DeepPartial<InvoiceEntity>) {
    return this.repository.create(entityLike);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
