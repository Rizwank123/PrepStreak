export const XP_REWARDS = {
  LESSON_COMPLETED: 10,
  QUESTION_SOLVED: 5,
  REVISION_COMPLETED: 3,
  STREAK_7: 100,
  STREAK_30: 300,
  STREAK_100: 500,
  STREAK_365: 2000,
} as const;

export const XP_PER_LEVEL = 100;

export function levelFromXp(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressInLevel: number;
  xpToNextLevel: number;
} {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = totalXp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const progressInLevel = currentLevelXp / nextLevelXp;
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  return { level, currentLevelXp, nextLevelXp, progressInLevel, xpToNextLevel };
}

export const STREAK_MILESTONES = [7, 30, 50, 100, 180, 365, 500, 1000];

export function getStreakMilestone(currentStreak: number): number | null {
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak === milestone) return milestone;
  }
  return null;
}

export function getStreakBadge(streak: number): { label: string; icon: string } | null {
  if (streak >= 1000) return { label: '1000 Days', icon: 'crown' };
  if (streak >= 500) return { label: '500 Days', icon: 'flame' };
  if (streak >= 365) return { label: '1 Year', icon: 'flame' };
  if (streak >= 180) return { label: '180 Days', icon: 'flame' };
  if (streak >= 100) return { label: '100 Days', icon: 'flame' };
  if (streak >= 50) return { label: '50 Days', icon: 'flame' };
  if (streak >= 30) return { label: '30 Days', icon: 'flame' };
  if (streak >= 7) return { label: '7 Days', icon: 'flame' };
  return null;
}
