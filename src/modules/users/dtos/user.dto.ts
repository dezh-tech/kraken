import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

import { AbstractDto } from '../../../../src/common/dto/abstract.dto';

export class UserDto extends AbstractDto {
  _id: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
