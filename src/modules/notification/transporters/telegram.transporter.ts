import axios from 'axios';
import { ITransporter } from '../transporter.interface';

export class TelegramTransporter implements ITransporter {
  constructor(private readonly botToken: string) {}

  async sendNotification(message: string, recipient: string): Promise<void> {
    await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      chat_id: recipient,
      text: message,
      parse_mode: 'Markdown',
    });

    console.info('send new message to telegram');
  }
}
