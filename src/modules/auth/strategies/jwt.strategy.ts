import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { User } from 'src/modules/users/schemas/user.schema';

import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { IJwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.privateKey,
    });
  }

  validate(payload: User): IJwtStrategyValidate {
    return {
      id: payload._id,
      email: payload.email,
    };
  }
}
