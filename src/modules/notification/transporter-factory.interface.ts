import { ITransporter } from "./transporter.interface";

export interface NotificationFactory {
  createNotificationService(): ITransporter;
}
