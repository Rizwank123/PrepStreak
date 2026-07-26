import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../theme/ThemeContext';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import { seedDatabase } from '../database/seed/seedService';
import { lightTheme, darkTheme } from '../theme/themes';
import { useColorScheme } from 'react-native';
import { registerAllContent } from '../content';
import { scheduleAllReminders, cancelAllReminders, requestNotificationPermissions } from '../services/reminderService';
import { configureNotifications } from '../services/notificationConfig';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const loadProgress = useProgressStore((s) => s.load);
  const reminderEnabled = useSettingsStore((s) => s.reminderEnabled);
  const reminderTimes = useSettingsStore((s) => s.reminderTimes);

  useEffect(() => {
    (async () => {
      registerAllContent();
      await configureNotifications();
      await seedDatabase();
      await loadProgress();

      if (reminderEnabled) {
        const granted = await requestNotificationPermissions();
        if (granted) {
          await scheduleAllReminders(reminderTimes);
        }
      }

      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadProgress]);

  useEffect(() => {
    if (!ready) return;
    if (reminderEnabled) {
      requestNotificationPermissions().then((granted) => {
        if (granted) {
          scheduleAllReminders(reminderTimes);
        }
      });
    } else {
      cancelAllReminders();
    }
  }, [reminderEnabled, reminderTimes, ready]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1f5af0" />
      </View>
    );
  }

  return (
    <ThemeProvider mode={themeMode} setMode={setThemeMode}>
      {children}
    </ThemeProvider>
  );
}
