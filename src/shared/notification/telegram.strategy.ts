import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { ApiConfigService } from '../services/api-config.service';
import type { INotificationStrategy } from './notification-strategy.interface';

@Injectable()
export class TelegramNotificationStrategy implements INotificationStrategy {
  constructor(private apiConfig: ApiConfigService) {}

  async sendNotification(message: string): Promise<void> {
    const conf = this.apiConfig.getTelegramConfig;

    if (!conf.botToken || !conf.chatId) {
      console.warn('Telegram bot token or chat ID is not configured');
    }

    const url = `https://api.telegram.org/bot${conf.botToken}/sendMessage`;

    try {
      await axios.post(url, {
        chat_id: conf.chatId,
        text: message,
      });
    } catch (error) {
      console.error('Failed to send message to Telegram:', (error as { message: string }).message);
    }
  }
}
