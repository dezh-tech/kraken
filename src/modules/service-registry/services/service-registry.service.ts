import { randomBytes } from 'node:crypto';
import EventEmitter from 'node:events';

import { Injectable } from '@nestjs/common';

import { ApiConfigService } from '../../../../src/shared/services/api-config.service';
import type RegisterServiceRegistryDto from '../dtos/service-registry-register.dto';
import { ServiceRegistryEntity } from '../entities/service-registry.entity';
import { ServiceRegistryRepository } from '../service-registry.repository';

@Injectable()
// eslint-disable-next-line unicorn/prefer-event-target
export default class ServiceRegistryService extends EventEmitter {
  constructor(
    private readonly serviceRegistryRepository: ServiceRegistryRepository,
    private readonly apiConfig: ApiConfigService,
  ) {
    super();
  }

  async register(props: RegisterServiceRegistryDto) {
    const ns = new ServiceRegistryEntity();
    const token = this.generateApiKey();
    ns.assign({ ...props, token });
    const service = await this.serviceRegistryRepository.save(ns);

    this.emit('SERVICE_REGISTERED', service);

    return service;
  }

  async findAll() {
    return this.serviceRegistryRepository.findAll();
  }

  isValidServiceAuthToken(token: string) {
    return token === this.apiConfig.serviceAuthToken;
  }

  generateApiKey(length = 32): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}
