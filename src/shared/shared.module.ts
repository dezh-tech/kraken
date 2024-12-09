import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

import { TelegramNotificationStrategy } from './notification/telegram.strategy';
import { ApiConfigService } from './services/api-config.service';
import { NotificationService } from './services/notification.service';

const providers: Provider[] = [ConfigService, ApiConfigService, NotificationService, TelegramNotificationStrategy];

@Global()
@Module({
  providers,
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.mongoConfig,
      inject: [ApiConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.redisConfig,
      inject: [ApiConfigService],
    }),
  ],
  exports: [...providers],
})
export class SharedModule {}
