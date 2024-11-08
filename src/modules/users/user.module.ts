import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, userSchema } from './schemas/user.schema';
import UserController from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
