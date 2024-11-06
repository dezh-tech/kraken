import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const providers: Provider[] = [ConfigService, ApiConfigService];

@Global()
@Module({
  providers,
  imports: [
    MongooseModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => configService.mongoConfig,
    }),
  ],
  exports: [...providers],
})
export class SharedModule {}
