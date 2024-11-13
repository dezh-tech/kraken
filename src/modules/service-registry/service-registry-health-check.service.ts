import type { OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { ServiceRegistryEntity } from './entities/service-registry.entity';
import { ServiceStatus } from './enums/service-status.enum';
import { ServiceRegistryRepository } from './service-registry.repository';
import ServiceRegistryService from './service-registry.service';

@Injectable()
export default class ServiceRegistryHealthCheckService implements OnModuleDestroy {
  private serviceIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly serviceRegistryService: ServiceRegistryService,
    private readonly serviceRegistryRepository: ServiceRegistryRepository,
  ) {
    this.serviceRegistryService.on('SERVICE_REGISTERED', (s: ServiceRegistryEntity) => {
      this.scheduleHealthCheck(s);
    });
  }

  async onModuleInit() {
    await this.loadServices();
  }

  onModuleDestroy() {
    this.clearAllIntervals();
  }

  async loadServices() {
    this.clearAllIntervals();

    const services = await this.serviceRegistryRepository.findAll();

    for (const service of services) {
      this.scheduleHealthCheck(service);
    }
  }

  private scheduleHealthCheck(service: ServiceRegistryEntity) {
    if (service.heartbeatDurationInSec <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      void this.checkServiceHealth(service);
    }, service.heartbeatDurationInSec * 1000);

    this.serviceIntervals.set(String(service.id), intervalId);
  }

  private async checkServiceHealth(service: ServiceRegistryEntity) {
    try {
      const isHealthy = false; // TODO: Replace with actual health check logic
      const status = isHealthy ? ServiceStatus.ACTIVE : ServiceStatus.UN_HEALTHY;
      service.assign({ lastHealthCheck: Date.now(), status });
      await this.serviceRegistryRepository.save(service);
    } catch (error) {
      service.assign({ lastHealthCheck: Date.now(), status: ServiceStatus.INACTIVE });
      await this.serviceRegistryRepository.save(service);
    }
  }

  private clearAllIntervals() {
    for (const [, interval] of this.serviceIntervals) {
      clearInterval(interval);
    }

    this.serviceIntervals.clear();
  }
}
