import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { User } from 'src/modules/users/schemas/user.schema';
import { IJwtStrategyValidate } from '../interfaces/IJwtStrategyValidate.interface';
import { ApiConfigService } from '../../../shared/services/api-config.service';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly apiConfigService:ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.authConfig.privateKey,
    });
  }

  async validate(payload: User): Promise<IJwtStrategyValidate> {
    return {
      id: payload._id,
      email: payload.email,
    };
  }
}
