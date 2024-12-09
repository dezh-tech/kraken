import { Injectable } from '@nestjs/common';

import { TelegramNotificationStrategy } from '../notification/telegram.strategy';

@Injectable()
export class NotificationService {
  constructor(private readonly telegramTransporter: TelegramNotificationStrategy) {}

  async sendNotificationTelegram(message: string): Promise<void> {
    await this.telegramTransporter.sendNotification(message);
  }
}
