import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOneOptions } from 'typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async find(options: FindOneOptions<UserEntity>) {
    return this.repository.findOne(options);
  }
}
