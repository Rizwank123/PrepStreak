import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../theme/ThemeContext';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import { seedDatabase } from '../database/seed/seedService';
import { lightTheme, darkTheme } from '../theme/themes';
import { useColorScheme } from 'react-native';
import { registerAllContent } from '../content';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const loadProgress = useProgressStore((s) => s.load);

  useEffect(() => {
    (async () => {
      registerAllContent();
      await seedDatabase();
      await loadProgress();
      setReady(true);
    })();
  }, [loadProgress]);

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
