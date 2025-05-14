import { Module } from '@nestjs/common';

import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ImportExportRelayActionService } from './import-export.service';
import { RelayActionController } from './relay-action.controller';

@Module({
  imports: [SubscriptionsModule],
  providers: [ImportExportRelayActionService],
  controllers: [RelayActionController],
})
export class RelayActionModule {}
