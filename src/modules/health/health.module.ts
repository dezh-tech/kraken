import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import HealthController from './health.controller';
import { WorkersGrpcClient } from '../grpc/immortal-grpc.client';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export default class HealthModule {}
