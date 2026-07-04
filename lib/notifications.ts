import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_PREF_KEY = '@psymap:notificationsEnabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface DailyReminder {
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
}

const DAILY_REMINDERS: DailyReminder[] = [
  {
    id: 'psymap-morning',
    hour: 9,
    minute: 0,
    title: 'Bom dia!',
    body: 'Como você está se sentindo agora? Registre seu humor no PsyMap.',
  },
  {
    id: 'psymap-afternoon',
    hour: 14,
    minute: 0,
    title: 'Oi!',
    body: 'Que tal uma pausa para registrar como você está?',
  },
  {
    id: 'psymap-evening',
    hour: 20,
    minute: 0,
    title: 'Hora do check-in',
    body: 'Como foi seu dia? Registre suas emoções antes de descansar.',
  },
];

export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes PsyMap',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of DAILY_REMINDERS) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
        channelId: 'default',
      },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(enabled));
}

export async function getNotificationsEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(NOTIF_PREF_KEY);
  if (raw === null) return false;
  return JSON.parse(raw);
}

export async function initNotifications(): Promise<void> {
  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') {
    await scheduleDailyReminders();
  }
}
