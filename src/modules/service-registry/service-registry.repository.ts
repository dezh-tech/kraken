import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ServiceRegistryDocument } from './schemas/service-registry.schema';
import { ServiceRegistrySchema } from './schemas/service-registry.schema';

@Injectable()
export class ServiceRegistryRepository {
  constructor(@InjectModel(ServiceRegistrySchema.name) private serviceRegistryModel: Model<ServiceRegistryDocument>) {}

  async findAll(): Promise<ServiceRegistryDocument[]> {
    return this.serviceRegistryModel.find<ServiceRegistryDocument>().exec();
  }

  async findOne(props: Partial<ServiceRegistrySchema>): Promise<ServiceRegistryDocument | null> {
    return this.serviceRegistryModel.findOne<ServiceRegistryDocument>(props).exec();
  }

  async create(data: Partial<ServiceRegistrySchema>): Promise<ServiceRegistryDocument> {
    const newDocument = new this.serviceRegistryModel(data);

    return newDocument.save();
  }
}
