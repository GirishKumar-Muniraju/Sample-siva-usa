export interface INeoUserNotification {
  userId: string;
  appName: string;
  notifType: string;
  notifStartDate: Date;
  notifEndDate: Date;
  updateTime: Date;
  updateUserId: string;
  createdDateTime: Date;
  createdUserId: string;
}