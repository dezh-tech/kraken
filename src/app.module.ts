import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import AuthModule from './modules/auth/auth.module';
import { ServicesConfigModule } from './modules/config/config.module';
import HealthModule from './modules/health/health.module';
import ServiceRegistryModule from './modules/service-registry/service-registry.module';
import { UserModule } from './modules/users/user.module';
import { SharedModule } from './shared/shared.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SharedModule,
    UserModule,
    HealthModule,
    ServiceRegistryModule,
    ServicesConfigModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
      consumer
          .apply(RawBodyMiddleware)
          .forRoutes({
              path: '/subscriptions/webhook',
              method: RequestMethod.POST,
          })
          .apply(JsonBodyMiddleware)
          .forRoutes('*');
  }
}
