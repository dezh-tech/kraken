import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { UserDocument } from './schemas/user.schema';
import { UserSchema } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserSchema.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserSchema[]> {
    return this.userModel.find().exec();
  }

  async findOne(props: Partial<UserSchema>): Promise<UserSchema | null> {
    return this.userModel.findOne(props).exec();
  }
}
