import { Relay, nip17, finalizeEvent, nip59, nip04, kinds } from 'nostr-tools';
import { ITransporter } from '../transporter.interface';
import { hexToBytes } from '@noble/hashes/utils';
import { webcrypto } from 'node:crypto';

const semver = require('semver');
const nodeVersion = process.version;
if (semver.lt(nodeVersion, '20.0.0')) {
  // polyfills for node 18
  global.crypto = require('crypto');
  global.WebSocket = require('isomorphic-ws');
} else {
  // polyfills for node 20
  // @ts-ignore
  if (!globalThis.crypto) globalThis.crypto = webcrypto;

  global.WebSocket = require('isomorphic-ws');
}

export class NostrTransporter implements ITransporter {
  constructor(
    private readonly privateKey: Uint8Array,
    private readonly relays: string[],
  ) {}

  async sendNotification(message: string, recipient: string): Promise<void> {
    const createdAt = Math.floor(Date.now() / 1000);
    const cipherText = await nip04.encrypt(this.privateKey, recipient, message);

    let event = {
      kind: kinds.EncryptedDirectMessage,
      created_at: createdAt,
      tags: [[ "p", recipient ]],
      content: cipherText,
  };

    const signedEvent = finalizeEvent(event, this.privateKey);

    let successfulRelays = 0;
    for (const relayUrl of this.relays) {
      let relay: Relay
      try {
      relay = await Relay.connect(relayUrl);

        await relay.publish(signedEvent);
        successfulRelays++;
        console.info(`Publish event to ${relayUrl} successfully.`);
      } catch (error) {
        console.error(`Failed to publish event to ${relayUrl}:`);

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
