import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { UserDocument } from './schemas/user.schema';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(props: Partial<User>): Promise<User | null> {
    return this.userModel.findOne(props).exec();
  }
}
