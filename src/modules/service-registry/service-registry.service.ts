import { Injectable } from '@nestjs/common';

import type RegisterServiceRegistry from './dtos/service-registry-register.dto';
import type { ServiceRegistryDocument } from './schemas/service-registry.schema';
import { ServiceRegistryRepository } from './service-registry.repository';

@Injectable()
export default class ServiceRegistryService {
  private services: ServiceRegistryDocument[] = [];
  constructor(private readonly serviceRegistryRepository: ServiceRegistryRepository) {}

  async register({ heartbeat_duration_in_sec, url, type }: RegisterServiceRegistry) {
    await this.serviceRegistryRepository.create({
      heartbeat_duration_in_sec,
      url,
      type,
    });
  }
}
