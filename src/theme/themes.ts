import type { Theme } from './types';

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#f7f8fa',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    primary: '#1f5af0',
    primaryText: '#0f172a',
    secondaryText: '#475569',
    tertiaryText: '#94a3b8',
    accent: '#3479fb',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    border: '#e2e8f0',
    overlay: 'rgba(15, 23, 42, 0.4)',
    streak: '#ff7a1a',
    xp: '#8b5cf6',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#0b1020',
    surface: '#141b2e',
    surfaceElevated: '#1c2540',
    primary: '#599dff',
    primaryText: '#f1f5f9',
    secondaryText: '#94a3b8',
    tertiaryText: '#64748b',
    accent: '#8ec1ff',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    border: '#243056',
    overlay: 'rgba(0, 0, 0, 0.6)',
    streak: '#ff9d4d',
    xp: '#a78bfa',
  },
};
