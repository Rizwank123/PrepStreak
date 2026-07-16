import { getStored, setStored, removeStored } from './mmkv';
import { StorageKeys } from './keys';
import type { ThemeMode } from '../theme/types';

export interface ReminderTime {
  id: string;
  label: string;
  hour: number;
  minute: number;
  enabled: boolean;
  days: number[];
}

export interface AppSettings {
  themeMode: ThemeMode;
  dailyGoalMinutes: number;
  dailyGoalQuestions: number;
  reminderEnabled: boolean;
  reminderTimes: ReminderTime[];
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  lastOpenScreen: string;
  onboardingComplete: boolean;
}

const defaultSettings: AppSettings = {
  themeMode: 'system',
  dailyGoalMinutes: 60,
  dailyGoalQuestions: 5,
  reminderEnabled: false,
  reminderTimes: [
    { id: 'morning', label: 'Morning', hour: 8, minute: 0, enabled: true, days: [1, 2, 3, 4, 5] },
    { id: 'evening', label: 'Evening', hour: 19, minute: 0, enabled: true, days: [1, 2, 3, 4, 5] },
  ],
  fontSize: 'medium',
  animationsEnabled: true,
  lastOpenScreen: 'home',
  onboardingComplete: false,
};

export function loadSettings(): AppSettings {
  return {
    ...defaultSettings,
    themeMode: getStored<ThemeMode>(StorageKeys.THEME_MODE, 'system'),
    dailyGoalMinutes: getStored(StorageKeys.DAILY_GOAL_MINUTES, 60),
    dailyGoalQuestions: getStored(StorageKeys.DAILY_GOAL_QUESTIONS, 5),
    reminderEnabled: getStored(StorageKeys.REMINDER_ENABLED, false),
    reminderTimes: getStored<ReminderTime[]>(StorageKeys.REMINDER_TIMES, defaultSettings.reminderTimes),
    fontSize: getStored<'small' | 'medium' | 'large'>(StorageKeys.FONT_SIZE, 'medium'),
    animationsEnabled: getStored(StorageKeys.ANIMATIONS_ENABLED, true),
    lastOpenScreen: getStored(StorageKeys.LAST_OPEN_SCREEN, 'home'),
    onboardingComplete: getStored(StorageKeys.ONBOARDING_COMPLETE, false),
  };
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (settings.themeMode !== undefined) setStored(StorageKeys.THEME_MODE, settings.themeMode);
  if (settings.dailyGoalMinutes !== undefined) setStored(StorageKeys.DAILY_GOAL_MINUTES, settings.dailyGoalMinutes);
  if (settings.dailyGoalQuestions !== undefined) setStored(StorageKeys.DAILY_GOAL_QUESTIONS, settings.dailyGoalQuestions);
  if (settings.reminderEnabled !== undefined) setStored(StorageKeys.REMINDER_ENABLED, settings.reminderEnabled);
  if (settings.reminderTimes !== undefined) setStored(StorageKeys.REMINDER_TIMES, settings.reminderTimes);
  if (settings.fontSize !== undefined) setStored(StorageKeys.FONT_SIZE, settings.fontSize);
  if (settings.animationsEnabled !== undefined) setStored(StorageKeys.ANIMATIONS_ENABLED, settings.animationsEnabled);
  if (settings.lastOpenScreen !== undefined) setStored(StorageKeys.LAST_OPEN_SCREEN, settings.lastOpenScreen);
  if (settings.onboardingComplete !== undefined) setStored(StorageKeys.ONBOARDING_COMPLETE, settings.onboardingComplete);
}

export function resetSettings(): void {
  Object.values(StorageKeys).forEach((key) => removeStored(key));
}
