import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { Status } from '../../../../src/modules/grpc/gen/ts/immortal-health-service';
import { ImmortalGrpcClient } from '../../../../src/modules/grpc/immortal-grpc.client';
import type { ServiceRegistryEntity } from '../entities/service-registry.entity';
import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';
import { ServiceRegistryRepository } from '../service-registry.repository';
import ServiceRegistryService from './service-registry.service';

@Injectable()
export default class ServiceRegistryHealthCheckService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ServiceRegistryHealthCheckService.name);

  private serviceIntervals = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly serviceRegistryService: ServiceRegistryService,
    private readonly serviceRegistryRepository: ServiceRegistryRepository,
    private readonly immortalGrpcClient: ImmortalGrpcClient,
  ) {
    this.serviceRegistryService.on('SERVICE_REGISTERED', (service: ServiceRegistryEntity) => {
      this.logger.log(`New service registered: ${service.type} (ID: ${service._id})`);
      this.scheduleHealthCheck(service);
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing health checks for all registered services...');
    await this.initializeHealthChecks();
    this.logger.log('Health checks initialized successfully.');
  }

  onModuleDestroy() {
    this.logger.log('Cleaning up all health check intervals...');
    this.clearAllIntervals();
    this.logger.log('All intervals cleared.');
  }

  private async initializeHealthChecks() {
    this.clearAllIntervals();
    const services = await this.serviceRegistryRepository.findAll();
    this.logger.log(`Found ${services.length} services to initialize health checks.`);

    for (const service of services) {
      this.logger.log(`Scheduling health check for service: ${service.type} (ID: ${service._id})`);
      this.scheduleHealthCheck(service);
    }
  }

  private scheduleHealthCheck(service: ServiceRegistryEntity) {
    if (service.heartbeatDurationInSec <= 0) {
      this.logger.warn(
        `Skipping health check scheduling for service: ${service.type} (ID: ${service._id}) due to invalid heartbeat duration.`,
      );

      return;
    }

    if (this.serviceIntervals.has(String(service._id))) {
      this.logger.warn(
        `Health check for service: ${service.type} (ID: ${service._id}) is already scheduled. Skipping duplicate scheduling.`,
      );

      return;
    }

    const intervalId = setInterval(() => void this.performHealthCheck(service), service.heartbeatDurationInSec * 1000);
    this.serviceIntervals.set(String(service._id), intervalId);
    this.logger.log(
      `Health check scheduled for service: ${service.type} with a heartbeat duration of ${service.heartbeatDurationInSec} seconds.`,
    );
  }

  private async performHealthCheck(service: ServiceRegistryEntity): Promise<void> {
    try {
      this.logger.debug(`Performing health check for service: ${service.type} (ID: ${service._id})...`);

      let isHealthy = false;

      if (service.type === ServiceType.RELAY) {
        this.immortalGrpcClient.setUrl(service.url)

        const res = await lastValueFrom(this.immortalGrpcClient.serviceClient.status({}));

        isHealthy = res.services.every((s) => s.status === Status.CONNECTED);
      }

      service.assign({
        lastHealthCheck: Date.now(),
        status: isHealthy ? ServiceStatus.ACTIVE : ServiceStatus.UN_HEALTHY,
      });
      this.logger.log(
        `Health check result for service: ${service.type} (ID: ${service._id}): ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to perform health check for service: ${service.type} (ID: ${service._id}). Marking as INACTIVE.`,
        (error as { stack: string }).stack,
      );
      service.assign({
        lastHealthCheck: Date.now(),
        status: ServiceStatus.INACTIVE,
      });
    } finally {
      await this.serviceRegistryRepository.save(service);
      this.logger.debug(`Service status updated for service: ${service.type} (ID: ${service._id}).`);
    }
  }

  private clearAllIntervals() {
    for (const [serviceId, interval] of this.serviceIntervals) {
      clearInterval(interval);
      this.logger.log(`Cleared health check interval for service ID: ${serviceId}.`);
    }

    this.serviceIntervals.clear();
  }
}
