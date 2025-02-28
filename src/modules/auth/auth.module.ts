import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../users/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import JwtStrategy from './strategies/jwt.strategy';
import LocalStrategy from './strategies/local.strategy';
import { Nip98Strategy } from './strategies/nip-98.strategy';
import { Nip98AuthGuard } from './guards/nip98-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.secret,
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, Nip98Strategy, Nip98AuthGuard],
  controllers: [AuthController],
  exports: [Nip98AuthGuard,Nip98Strategy],
})
export default class AuthModule {}
