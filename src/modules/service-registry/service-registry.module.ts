import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ServiceRegistryController from './controllers/service-registry.controller';
import { ServiceRegistryGrpcController } from './controllers/service-registry-grpc.controller';
import { ServiceRegistryEntity } from './entities/service-registry.entity';
import { ServiceRegistryRepository } from './service-registry.repository';
import ServiceRegistryService from './services/service-registry.service';
import ServiceRegistryHealthCheckService from './services/service-registry-health-check.service';
import { WorkersGrpcClient } from '../grpc/immortal-grpc.client';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRegistryEntity])],
  controllers: [ServiceRegistryController, ServiceRegistryGrpcController],
  providers: [ServiceRegistryService, ServiceRegistryRepository, ServiceRegistryHealthCheckService, WorkersGrpcClient],
  exports: [ServiceRegistryService],
})
export default class ServiceRegistryModule {}
