import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicesConfigModule } from '../config/config.module';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRepository } from './subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';
import { InvoiceModule } from '../invoices/invoice.module';

@Module({
  imports: [ServicesConfigModule, InvoiceModule, TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionsService, SubscriptionRepository],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
