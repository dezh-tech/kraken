import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceRegistrySchema, serviceRegistrySchema } from './schemas/service-registry.schema';
import ServiceRegistryController from './controllers/service-registry.controller';
import { ServiceRegistryService } from './service-registry.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceRegistrySchema.name, schema: serviceRegistrySchema }])],
  controllers: [ServiceRegistryController],
  providers: [ServiceRegistryService],
})
export default class ServiceRegistryModule {}
