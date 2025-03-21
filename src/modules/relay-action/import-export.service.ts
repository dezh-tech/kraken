import { Injectable, NotFoundException } from '@nestjs/common';
import { ITransporter } from '../notification/transporter.interface';
import Redis from 'ioredis';
import { hexToBytes } from '@noble/hashes/utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ApiConfigService } from '../../../src/shared/services/api-config.service';
import { TransporterService } from '../notification/transporter-factory.service';
import { SimplePool } from 'nostr-tools';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ImportExportRelayActionService {
  private readonly nostrNotification: ITransporter;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly apiConfig: ApiConfigService,
    private readonly subscriptionService: SubscriptionsService,
  ) {
    this.nostrNotification = TransporterService.createNostrTransporter(
      hexToBytes(this.apiConfig.getNostrConfig.privateKey),
      this.apiConfig.getNostrConfig.relays,
    );
  }

  async importEvents(pubkey: string, relays: string[]) {
    await this.subscriptionService.findOne({
      where: {
        subscriber: pubkey,
      },
    });

    this.nostrNotification.sendNotification(
      `⏳ Import in Progress: Your Events Are Being Synced!

Hey there,

We've started importing your events from the specified relays. This may take a few moments. You'll receive another notification once the process is completed.

Thank you for your patience!

Best,
Jellyfish Team🪼`,
      pubkey,
    );

    setImmediate(async () => {
      try {
        const pool = new SimplePool();
        const events = await pool.querySync(relays, {
          authors: [pubkey],
        });

        for await (const e of events) {
          try {
            await Promise.any(pool.publish([this.apiConfig.getNostrConfig.mainRelay], e));
          } catch (error) {}
        }

        const collectedFromRelays = relays.map((r) => `- ${r}`).join('\n');

        await this.nostrNotification.sendNotification(
          `✅ Import Completed: Your Events Are Now Synced!

Hey there,

Your events from the following relays have been successfully imported and relayed to ${this.apiConfig.getNostrConfig.mainRelay}.

🔄 Total Events Imported: ${events.length}
🚀 Relay: ${this.apiConfig.getNostrConfig.mainRelay}
📡 Collected From:
${collectedFromRelays}

If you encounter any issues or need support, feel free to reach out.

Best,
Jellyfish Team🪼`,
          pubkey,
        );
      } catch (error) {
        console.error('Import failed:', error);

        await this.nostrNotification.sendNotification(
          `⚠️ Import Failed: An Error Occurred

Hey there,

Unfortunately, we encountered an issue while importing your events. Please try again later or contact support if the issue persists.

📩 Contact Support: hi@dezh.tech

We apologize for the inconvenience.

Best,
Jellyfish Team🪼`,
          pubkey,
        );
      }
    });
  }
}
