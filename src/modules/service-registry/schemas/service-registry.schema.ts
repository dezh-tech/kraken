import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongoose';

import { ServiceStatus } from '../enums/service-status.enum';
import { ServiceType } from '../enums/service-types.enum';

@Schema()
export class ServiceRegistrySchema {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @ApiProperty({ type: String, enum: ServiceType, default: ServiceType.RELAY })
  @Prop({ required: true })
  type: ServiceType;

  @ApiProperty({ type: String, enum: ServiceStatus, default: ServiceStatus.ACTIVE })
  @Prop({ required: true })
  status: ServiceStatus;

  @ApiProperty({ type: String })
  @Prop()
  url: string;

  @ApiProperty({ type: Number })
  @Prop()
  heartbeat_duration_in_sec: number;
}

export type ServiceRegistryDocument = HydratedDocument<ServiceRegistrySchema>;

export const serviceRegistrySchema = SchemaFactory.createForClass(ServiceRegistrySchema);
