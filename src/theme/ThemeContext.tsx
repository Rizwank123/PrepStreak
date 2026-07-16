import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './themes';
import type { Theme, ThemeMode } from './types';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  mode,
  setMode,
}: {
  children: ReactNode;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}) {
  const systemScheme = useColorScheme();

  const theme = useMemo<Theme>(() => {
    if (mode === 'dark') return darkTheme;
    if (mode === 'light') return lightTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setMode,
      toggle: () =>
        setMode(theme.dark ? 'light' : 'dark'),
    }),
    [theme, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
