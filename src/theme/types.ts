export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorToken =
  | 'background'
  | 'surface'
  | 'surfaceElevated'
  | 'primary'
  | 'primaryText'
  | 'secondaryText'
  | 'tertiaryText'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'border'
  | 'overlay'
  | 'streak'
  | 'xp';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  overlay: string;
  streak: string;
  xp: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}
