import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongoose';

@Schema({ collection: 'users' })
export class UserSchema {
  _id: ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;
}

export type UserDocument = HydratedDocument<UserSchema>;

export const userSchema = SchemaFactory.createForClass(UserSchema);
