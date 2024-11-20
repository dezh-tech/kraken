import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../users/user.service';
import type { IAuthLoginInput } from './interfaces/auth-login-input.interface';
import type { IAuthLoginOutput } from './interfaces/auth-login-output.interface';
import type { IAuthValidateUserOutput } from './interfaces/auth-validate-user-output.interface';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<null | IAuthValidateUserOutput> {
    const user = await this.usersService.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (isPasswordOk) {
      return {
        id: user._id.toString(),
        email: user.email,
      };
    }

    return null;
  }

  login(data: IAuthLoginInput): IAuthLoginOutput {
    const payload = {
      id: data._id,
      email: data.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.apiConfigService.authConfig.jwtExpirationTime,
    });

    return {
      accessToken,
    };
  }
}
