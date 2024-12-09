export interface INotificationStrategy {
  sendNotification(message: string): Promise<void>;
}
