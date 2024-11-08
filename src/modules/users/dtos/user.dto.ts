import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserDto {
  _id: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
