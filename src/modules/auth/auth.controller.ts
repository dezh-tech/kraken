import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { IAuthenticatedRequest } from './auth.request';
import AuthService from './auth.service';
import SigninDto from './dtos/signin.dto';
import LocalAuthGuard from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SigninDto })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Request() { user }: IAuthenticatedRequest) {
    return this.authService.login(user);
  }
}
