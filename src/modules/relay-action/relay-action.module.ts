import { Module } from '@nestjs/common';
import { ImportExportRelayActionService } from './import-export.service';
import { RelayActionController } from './relay-action.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  providers: [ImportExportRelayActionService],
  controllers: [RelayActionController],
})
export class RelayActionModule {}
