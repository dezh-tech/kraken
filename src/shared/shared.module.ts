import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from './services/api-config.service';

const providers: Provider[] = [ConfigService, ApiConfigService];

@Global()
@Module({
  providers,
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.mongoConfig,
      inject: [ApiConfigService],
    }),
  ],
  exports: [...providers],
})
export class SharedModule {}
