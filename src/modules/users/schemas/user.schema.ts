import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongoose';

@Schema()
export class User {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ type: String })
  @Prop()
  password: string;
}

export type UserDocument = HydratedDocument<User>;

export const userSchema = SchemaFactory.createForClass(User);
