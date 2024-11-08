import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { IAuthValidateUserOutput } from './interfaces/IAuthValidateUserOutput.interface';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { IAuthLoginInput } from './interfaces/IAuthLoginInput.interface';
import { IAuthLoginOutput } from './interfaces/IAuthLoginOutput.interface';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<null | IAuthValidateUserOutput> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      return null;
    }

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (passwordCompared) {
      return {
        id: user._id,
        email: user.email,
      };
    }

    return null;
  }

  async login(data: IAuthLoginInput): Promise<IAuthLoginOutput> {
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
