import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';

import { ServiceRegistryEntity } from './entities/service-registry.entity';

@Injectable()
export class ServiceRegistryRepository {
  constructor(
    @InjectRepository(ServiceRegistryEntity)
    private repository: Repository<ServiceRegistryEntity>,
  ) {}

  async findAll(options?: FindManyOptions<ServiceRegistryEntity> | undefined) {
    return this.repository.find({ ...options });
  }

  async findOne(options: FindOneOptions<ServiceRegistryEntity>) {
    return this.repository.findOne({ ...options });
  }

  async save(data: ServiceRegistryEntity): Promise<ServiceRegistryEntity> {
    return this.repository.save(data);
  }
}
