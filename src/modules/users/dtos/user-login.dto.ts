import { ApiProperty, PickType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UserLoginDto extends PickType(UserDto, ['email'] as const) {
  @ApiProperty()
  password: string;
}
