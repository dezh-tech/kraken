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
    const token = this.generateApiKey(props.type, props.region);
    ns.assign({ ...props, token });
    const service = await this.serviceRegistryRepository.save(ns);

    this.emit('SERVICE_REGISTERED', service);

    return service;
  }

  async findAll() {
    return this.serviceRegistryRepository.findAll();
  }

  async findByToken(token: string) {
    return this.serviceRegistryRepository.findOne({ where: { token } });
  }

  isValidServiceAuthToken(token: string) {
    return token === this.apiConfig.serviceAuthToken;
  }

  generateApiKey(serviceType: string, region: string): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e6).toString(36);

    return `${serviceType}:${region}-${timestamp}-${randomPart}`;
  }
}
