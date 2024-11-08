import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConfigService } from './services/api-config.service';

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
