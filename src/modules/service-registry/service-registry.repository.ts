import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ServiceRegistryDocument } from './schemas/service-registry.schema';
import { ServiceRegistrySchema } from './schemas/service-registry.schema';

@Injectable()
export class ServiceRegistryRepository {
  constructor(@InjectModel(ServiceRegistrySchema.name) private serviceRegistryModel: Model<ServiceRegistryDocument>) {}

  async findAll(): Promise<ServiceRegistrySchema[]> {
    return this.serviceRegistryModel.find().exec();
  }

  async findOne(props: Partial<ServiceRegistrySchema>): Promise<ServiceRegistrySchema | null> {
    return this.serviceRegistryModel.findOne(props).exec();
  }

  async create(data: Partial<ServiceRegistrySchema>): Promise<ServiceRegistrySchema> {
    const newDocument = new this.serviceRegistryModel(data);

    return newDocument.save();
  }
}
