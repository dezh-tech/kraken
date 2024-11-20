import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigRepository } from './config.repository';
import { ConfigService } from './config.service';
import { ServiceConfigController } from './controllers/config.controller';
import { ConfigGrpcController } from './controllers/config-grpc.controller';
import { ConfigEntity } from './entities/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  providers: [ConfigService, ConfigRepository],
  controllers: [ServiceConfigController, ConfigGrpcController],
  exports: [ConfigService],
})
export class ServicesConfigModule {}
