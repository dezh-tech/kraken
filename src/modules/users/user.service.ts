import { Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';

import type { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(options: FindOneOptions<UserEntity>) {
    return this.userRepository.find({ ...options });
  }
}
