import './boilerplate.polyfill';

import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import AuthModule from './modules/auth/auth.module';
import { ServicesConfigModule } from './modules/config/config.module';
import HealthModule from './modules/health/health.module';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { LogModule } from './modules/log/log.module';
import { RelayActionModule } from './modules/relay-action/relay-action.module';
import ServiceRegistryModule from './modules/service-registry/service-registry.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UserModule } from './modules/users/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    SharedModule,
    UserModule,
    HealthModule,
    ServiceRegistryModule,
    ServicesConfigModule,
    SubscriptionsModule,
    LogModule,
    InvoiceModule,
    RelayActionModule,
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
