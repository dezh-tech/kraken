import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { UserEntity } from 'src/modules/users/entities/user.entity';

import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { IJwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.secret,
    });
  }

  validate(payload: UserEntity): IJwtStrategyValidate {
    console.log(payload)
    return {
      email: payload.email,
    };
  }
}
