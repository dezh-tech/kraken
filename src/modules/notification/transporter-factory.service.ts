import { ITransporter } from './transporter.interface';
import { NostrTransporter } from './transporters/nostr.transporter';
import { TelegramTransporter } from './transporters/telegram.transporter';

export class TransporterService {
  static createTelegramTransporter(botToken: string): ITransporter {
    return new TelegramTransporter(botToken);
  }

  static createNostrTransporter(privateKey: Uint8Array, relays: string[]): ITransporter {
    return new NostrTransporter(privateKey, relays);
  }
}
