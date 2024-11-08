import { Injectable } from '@nestjs/common';

import type { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(props: Partial<User>) {
    return this.userRepository.findOne(props);
  }
}
