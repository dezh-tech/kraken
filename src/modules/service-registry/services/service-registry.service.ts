import EventEmitter from 'node:events';

import { Injectable } from '@nestjs/common';

import { ApiConfigService } from '../../../../src/shared/services/api-config.service';
import type RegisterServiceRegistryDto from '../dtos/service-registry-register.dto';
import { ServiceRegistryEntity } from '../entities/service-registry.entity';
import { ServiceRegistryRepository } from '../service-registry.repository';
import { WorkersGrpcClient } from 'src/modules/grpc/immortal-grpc.client';
import { ServerType } from 'typeorm';
import { ServiceType } from '../enums/service-types.enum';
import { ServiceStatus } from '../enums/service-status.enum';

@Injectable()
// eslint-disable-next-line unicorn/prefer-event-target
export default class ServiceRegistryService extends EventEmitter {
  constructor(private readonly serviceRegistryRepository: ServiceRegistryRepository) {
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

  async findOneByType(type: ServiceType) {
    return this.serviceRegistryRepository.findOne({ where: { type, status: ServiceStatus.ACTIVE } });
  }

  generateApiKey(serviceType: string, region: string): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e6).toString(36);

    return `${serviceType}:${region}-${timestamp}-${randomPart}`;
  }
}
