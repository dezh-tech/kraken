import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ServiceRegistryController from './controllers/service-registry.controller';
import ServiceRegistryGrpcController from './controllers/service-regsitry-grpc.controller';
import { ServiceRegistryEntity } from './entities/service-registry.entity';
import { ServiceRegistryRepository } from './service-registry.repository';
import ServiceRegistryService from './service-registry.service';
import ServiceRegistryHealthCheckService from './service-registry-health-check.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRegistryEntity])],
  controllers: [ServiceRegistryController, ServiceRegistryGrpcController],
  providers: [ServiceRegistryService, ServiceRegistryRepository, ServiceRegistryHealthCheckService],
})
export default class ServiceRegistryModule {}
