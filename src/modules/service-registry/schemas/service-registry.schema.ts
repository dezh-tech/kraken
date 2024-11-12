import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongoose';

import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';
import { ServiceRegistryDto } from '../dtos/service-registry.dto';

@Schema({ collection: 'service_registry' })
export class ServiceRegistrySchema {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @Prop({ type: String, required: true, default: ServiceType.RELAY })
  type: ServiceType;

  @Prop({ type: String, required: true, default: ServiceStatus.ACTIVE })
  status: ServiceStatus;

  @Prop({ type: String })
  url: string;

  @Prop({ type: Number, default: 0 })
  heartbeat_duration_in_sec: number;

  @Prop({ type: Number, default: 0 })
  last_health_check: number;
}

export type ServiceRegistryDocument = HydratedDocument<ServiceRegistrySchema>;

export const serviceRegistrySchema = SchemaFactory.createForClass(ServiceRegistrySchema);
