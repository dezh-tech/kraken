import { Injectable, OnModuleDestroy } from '@nestjs/common';

import type RegisterServiceRegistry from './dtos/service-registry-register.dto';
import type { ServiceRegistryDocument } from './schemas/service-registry.schema';
import { ServiceRegistryRepository } from './service-registry.repository';
import { ServiceStatus } from './enums/service-status.enum';

@Injectable()
export default class ServiceRegistryService implements OnModuleDestroy {
  private serviceIntervals = new Map<string, NodeJS.Timeout>();

  constructor(private readonly serviceRegistryRepository: ServiceRegistryRepository) {}

  async onModuleInit() {
    await this.loadServices();
  }

  async onModuleDestroy() {
    this.clearAllIntervals();
  }

  async loadServices() {
    this.clearAllIntervals();

    const services = await this.serviceRegistryRepository.findAll();
    services.forEach((service) => this.scheduleHealthCheck(service));
  }

  private async scheduleHealthCheck(service: ServiceRegistryDocument) {
    if (service.heartbeat_duration_in_sec <= 0) return;

    const intervalId = setInterval(async () => {
      await this.checkServiceHealth(service);
    }, service.heartbeat_duration_in_sec * 1000);

    this.serviceIntervals.set(service._id.toString(), intervalId);
  }

  private async checkServiceHealth(service: ServiceRegistryDocument) {
    try {
      const isHealthy = false; // TODO: Replace with actual health check logic
      service.status = isHealthy ? ServiceStatus.ACTIVE : ServiceStatus.UN_HEALTHY;
      service.last_health_check = Date.now();
      await service.save();
    } catch (error) {
      service.status = ServiceStatus.INACTIVE;
      service.last_health_check = Date.now();
      await service.save();
    }
  }

  async register({ heartbeat_duration_in_sec, url, type }: RegisterServiceRegistry) {
    const service = await this.serviceRegistryRepository.create({
      heartbeat_duration_in_sec,
      url,
      type,
    });

    this.scheduleHealthCheck(service);

    return service;
  }

  async findAll() {
    return this.serviceRegistryRepository.findAll();
  }

  private clearAllIntervals() {
    this.serviceIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.serviceIntervals.clear();
  }
}
