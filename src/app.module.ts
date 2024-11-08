import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import AuthModule from './modules/auth/auth.module';
import HealthModule from './modules/health/health.module';
import { UserModule } from './modules/users/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SharedModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
