import EventEmitter from 'node:events';

import { Injectable } from '@nestjs/common';

import type RegisterServiceRegistry from '../dtos/service-registry-register.dto';
import { ServiceRegistryEntity } from '../entities/service-registry.entity';
import { ServiceRegistryRepository } from '../service-registry.repository';

@Injectable()
// eslint-disable-next-line unicorn/prefer-event-target
export default class ServiceRegistryService extends EventEmitter {
  constructor(private readonly serviceRegistryRepository: ServiceRegistryRepository) {
    super();
  }

  async register(props: RegisterServiceRegistry) {
    const ns = new ServiceRegistryEntity();
    ns.assign(props);
    const service = await this.serviceRegistryRepository.save(ns);

    this.emit('SERVICE_REGISTERED', service);

    return service;
  }

  async findAll() {
    return this.serviceRegistryRepository.findAll();
  }
}
