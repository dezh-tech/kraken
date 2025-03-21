export interface ITransporter {
  sendNotification(message: string, recipient: string): Promise<void>;
}
