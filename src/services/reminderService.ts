import { Platform } from 'react-native';
import type { ReminderTime } from '../storage/settingsStorage';

export interface ReminderNotification {
  id: string;
  title: string;
  body: string;
}

const REMINDER_TITLE = 'PrepStreak';
const REMINDER_BODY = "Time to keep your streak alive! Solve a problem or review a topic today.";

function shouldFireToday(reminder: ReminderTime): boolean {
  const today = new Date().getDay();
  const dayMap = [0, 1, 2, 3, 4, 5, 6];
  return reminder.days.includes(dayMap[today]);
}

function getMinutesUntil(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

let webPollInterval: ReturnType<typeof setInterval> | null = null;
let webFiredKeys = new Set<string>();

function webNotificationKey(reminder: ReminderTime): string {
  const d = new Date();
  return `${reminder.id}-${d.toISOString().split('T')[0]}`;
}

async function scheduleWebReminder(reminder: ReminderTime): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  if (Notification.permission !== 'granted') return;

  const minutesUntil = getMinutesUntil(reminder.hour, reminder.minute);
  const key = webNotificationKey(reminder);

  setTimeout(() => {
    if (webFiredKeys.has(key)) return;
    if (!shouldFireToday(reminder)) return;
    webFiredKeys.add(key);
    new Notification(REMINDER_TITLE, { body: REMINDER_BODY });
  }, minutesUntil * 60 * 1000);
}

function startWebPolling(reminders: ReminderTime[]): void {
  if (webPollInterval) clearInterval(webPollInterval);
  webFiredKeys = new Set<string>();

  const check = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const r of reminders) {
      if (!r.enabled || !shouldFireToday(r)) continue;
      const reminderMinutes = r.hour * 60 + r.minute;
      if (reminderMinutes === currentMinutes) {
        const key = webNotificationKey(r);
        if (webFiredKeys.has(key)) continue;
        webFiredKeys.add(key);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(REMINDER_TITLE, { body: REMINDER_BODY });
        }
      }
    }
  };

  webPollInterval = setInterval(check, 60000);
  check();
}

async function scheduleNativeReminder(reminder: ReminderTime): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    const { schedulingOptions } = await import('./notificationConfig');
    const id = `reminder-${reminder.id}`;
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    if (!reminder.enabled) return;

    for (const day of reminder.days) {
      await Notifications.scheduleNotificationAsync({
        content: { title: REMINDER_TITLE, body: REMINDER_BODY, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: reminder.hour,
          minute: reminder.minute,
          weekday: day + 1,
          repeats: true,
          ...schedulingOptions,
        },
        identifier: `${id}-${day}`,
      });
    }
  } catch {
    // expo-notifications not available
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  try {
    const Notifications = await import('expo-notifications');
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      return req.status === 'granted';
    }
    return true;
  } catch {
    return false;
  }
}

export async function scheduleAllReminders(reminders: ReminderTime[]): Promise<void> {
  const enabled = reminders.filter((r) => r.enabled);

  if (Platform.OS === 'web') {
    if (webPollInterval) clearInterval(webPollInterval);
    if (enabled.length === 0) return;
    startWebPolling(enabled);
    for (const r of enabled) {
      await scheduleWebReminder(r);
    }
    return;
  }

  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
  for (const r of enabled) {
    await scheduleNativeReminder(r);
  }
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') {
    if (webPollInterval) {
      clearInterval(webPollInterval);
      webPollInterval = null;
    }
    webFiredKeys.clear();
    return;
  }
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}

export function stopWebReminders(): void {
  if (webPollInterval) {
    clearInterval(webPollInterval);
    webPollInterval = null;
  }
  webFiredKeys.clear();
}
