import { create } from 'zustand';
import { loadSettings, saveSettings, resetSettings, type AppSettings } from '../storage/settingsStorage';

interface SettingsState extends AppSettings {
  setThemeMode: (mode: AppSettings['themeMode']) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  setDailyGoalQuestions: (questions: number) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTimes: (times: AppSettings['reminderTimes']) => void;
  setFontSize: (size: AppSettings['fontSize']) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setLastOpenScreen: (screen: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...loadSettings(),
  setThemeMode: (mode) => {
    saveSettings({ themeMode: mode });
    set({ themeMode: mode });
  },
  setDailyGoalMinutes: (minutes) => {
    saveSettings({ dailyGoalMinutes: minutes });
    set({ dailyGoalMinutes: minutes });
  },
  setDailyGoalQuestions: (questions) => {
    saveSettings({ dailyGoalQuestions: questions });
    set({ dailyGoalQuestions: questions });
  },
  setReminderEnabled: (enabled) => {
    saveSettings({ reminderEnabled: enabled });
    set({ reminderEnabled: enabled });
  },
  setReminderTimes: (times) => {
    saveSettings({ reminderTimes: times });
    set({ reminderTimes: times });
  },
  setFontSize: (size) => {
    saveSettings({ fontSize: size });
    set({ fontSize: size });
  },
  setAnimationsEnabled: (enabled) => {
    saveSettings({ animationsEnabled: enabled });
    set({ animationsEnabled: enabled });
  },
  setLastOpenScreen: (screen) => {
    saveSettings({ lastOpenScreen: screen });
    set({ lastOpenScreen: screen });
  },
  setOnboardingComplete: (complete) => {
    saveSettings({ onboardingComplete: complete });
    set({ onboardingComplete: complete });
  },
  reset: () => {
    resetSettings();
    set({ ...loadSettings() });
  },
}));
