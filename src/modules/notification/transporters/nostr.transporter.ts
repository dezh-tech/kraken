import { Relay, nip17, finalizeEvent } from 'nostr-tools';
import { ITransporter } from '../transporter.interface';

global.WebSocket = require('isomorphic-ws');

export class NostrTransporter implements ITransporter {
  constructor(
    private readonly privateKey: Uint8Array,
    private readonly relays: string[],
  ) {}

  async sendNotification(message: string, recipient: string): Promise<void> {
    const event = nip17.wrapEvent(this.privateKey, { publicKey: recipient }, message, 'jellyfish(bot)');

    const signedEvent = finalizeEvent(event, this.privateKey);

    let successfulRelays = 0;
    for (const relayUrl of this.relays) {
      const relay = await Relay.connect(relayUrl);

      try {
        await relay.publish(signedEvent);
        successfulRelays++;
        console.info(`Publish event to ${relayUrl} successfully.`);
      } catch (error) {
        console.error(`Failed to publish event to ${relayUrl}:`, error);
      } finally {
        relay.close();
      }
    }

    // Report success or failure
    if (successfulRelays === 0) {
      throw Error('Failed to connect to any relays.');
    } else {
      console.info(`Publish event to ${successfulRelays} relays`);
    }
  }
}
