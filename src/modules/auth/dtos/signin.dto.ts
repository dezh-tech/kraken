import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class SigninDto {
  @ApiProperty({ type: String })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String })
  readonly password: string;
}
