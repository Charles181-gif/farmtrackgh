import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  static async scheduleTaskNotification(task: {
    id: string;
    title: string;
    due_date: string;
    due_time?: string;
  }): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    if (!task.due_time) return null;

    try {
      const [hours, minutes] = task.due_time.split(':').map(Number);
      const dueDate = new Date(task.due_date);
      dueDate.setHours(hours, minutes, 0, 0);

      // Don't schedule if the time has already passed
      if (dueDate <= new Date()) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌱 Farm Task Reminder',
          body: `Time to: ${task.title}`,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: {
          date: dueDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelTaskNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async cancelAllTaskNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}