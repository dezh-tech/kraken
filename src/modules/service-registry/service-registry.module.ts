import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceRegistrySchema, serviceRegistrySchema } from './schemas/service-registry.schema';
import ServiceRegistryController from './controllers/service-registry.controller';
import ServiceRegistryService from './service-registry.service';
import { ServiceRegistryRepository } from './service-registry.repository';
import ServiceRegistryGrpcController from './controllers/service-regsitry-grpc.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceRegistrySchema.name, schema: serviceRegistrySchema }]),ScheduleModule.forRoot()],
  controllers: [ServiceRegistryController, ServiceRegistryGrpcController],
  providers: [ServiceRegistryService, ServiceRegistryRepository],
})
export default class ServiceRegistryModule {}
