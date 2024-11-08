import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dtos/user-login.dto';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}
}
