export const StorageKeys = {
  THEME_MODE: 'theme_mode',
  DAILY_GOAL_MINUTES: 'daily_goal_minutes',
  DAILY_GOAL_QUESTIONS: 'daily_goal_questions',
  REMINDER_ENABLED: 'reminder_enabled',
  REMINDER_TIMES: 'reminder_times',
  FONT_SIZE: 'font_size',
  ANIMATIONS_ENABLED: 'animations_enabled',
  LAST_OPEN_SCREEN: 'last_open_screen',
  ACTIVE_FILTERS: 'active_filters',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;

export type StorageKey = keyof typeof StorageKeys;
