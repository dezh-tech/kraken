import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ServiceRegistryModule from '../service-registry/service-registry.module';
import { LogController } from './controllers/log.controller';
import { LogGrpcController } from './controllers/log-grpc.controller';
import { LogEntity } from './entities/log.entity';
import { LogRepository } from './log.repository';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity]), ServiceRegistryModule],
  providers: [LogService, LogRepository],
  controllers: [LogController, LogGrpcController],
})
export class LogModule {}
