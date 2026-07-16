import { calendarRepository } from '../repository';

const today = () => new Date().toISOString().split('T')[0];
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
}

export async function computeStreak(): Promise<StreakInfo> {
  const allDays = await calendarRepository.getRange('2020-01-01', '2099-12-31');
  const streakDays = allDays.filter((d) => d.is_streak_day === 1).sort((a, b) => b.date.localeCompare(a.date));

  if (streakDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastStudyDate: null, studiedToday: false };
  }

  const lastStudyDate = streakDays[0].date;
  const studiedToday = lastStudyDate === today();

  let currentStreak = 0;
  if (studiedToday || lastStudyDate === yesterday()) {
    const dateSet = new Set(streakDays.map((d) => d.date));
    let cursor = new Date(studiedToday ? today() : yesterday());
    while (dateSet.has(cursor.toISOString().split('T')[0])) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: string | null = null;
  for (const day of [...streakDays].reverse()) {
    if (prevDate) {
      const prev = new Date(prevDate);
      const curr = new Date(day.date);
      const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    prevDate = day.date;
  }

  return { currentStreak, longestStreak, lastStudyDate, studiedToday };
}

export async function recordStudyDay(): Promise<void> {
  const date = today();
  const existing = await calendarRepository.getDay(date);
  await calendarRepository.upsert({
    date,
    studied: 1,
    minutes_studied: existing?.minutes_studied ?? 0,
    questions_solved: existing?.questions_solved ?? 0,
    lessons_completed: existing?.lessons_completed ?? 0,
    xp_earned: existing?.xp_earned ?? 0,
    is_streak_day: 1,
  });
}

export async function breakStreak(): Promise<void> {
  const date = today();
  const existing = await calendarRepository.getDay(date);
  if (existing) {
    await calendarRepository.upsert({
      ...existing,
      is_streak_day: 0,
    });
  }
}
