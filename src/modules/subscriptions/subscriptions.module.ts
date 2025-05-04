import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicesConfigModule } from '../config/config.module';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRepository } from './subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';
import { InvoiceModule } from '../invoices/invoice.module';
import ServiceRegistryModule from '../service-registry/service-registry.module';
import { SeasnailGrpcClient } from '../grpc/seasnail-grpc.client';

@Module({
  imports: [ServiceRegistryModule, ServicesConfigModule, InvoiceModule, TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionsService, SubscriptionRepository,SeasnailGrpcClient],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
