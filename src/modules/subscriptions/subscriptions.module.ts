import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionRepository } from './subscriptions.repository';
import { ServicesConfigModule } from '../config/config.module';

@Module({
  imports: [ServicesConfigModule, TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionsService, SubscriptionRepository],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
