import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

import { AbstractDto } from '../../../../src/common/dto/abstract.dto';
import type { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  constructor(e: UserEntity) {
    super(e);

    this.email = e.email;
  }
}
