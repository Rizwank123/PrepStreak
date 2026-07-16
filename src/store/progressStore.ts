import { create } from 'zustand';
import {
  xpRepository, studyLogRepository, dailyStatsRepository,
  lessonRepository, questionRepository, achievementRepository,
} from '../repository';
import { XP_REWARDS, levelFromXp, getStreakMilestone } from '../services/xpService';
import { computeStreak, recordStudyDay } from '../services/streakService';

interface ProgressState {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressInLevel: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  studiedToday: boolean;
  todayMinutes: number;
  todayQuestions: number;
  todayLessons: number;
  todayXp: number;
  totalQuestionsSolved: number;
  totalLessonsCompleted: number;
  load: () => Promise<void>;
  addXp: (amount: number, reason: string, entityType: string, entityId: string) => Promise<void>;
  recordLessonCompleted: (lessonId: string) => Promise<void>;
  recordQuestionSolved: (questionId: string) => Promise<void>;
  recordStudySession: (minutes: number) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  totalXp: 0,
  level: 1,
  currentLevelXp: 0,
  nextLevelXp: 100,
  progressInLevel: 0,
  xpToNextLevel: 100,
  currentStreak: 0,
  longestStreak: 0,
  studiedToday: false,
  todayMinutes: 0,
  todayQuestions: 0,
  todayLessons: 0,
  todayXp: 0,
  totalQuestionsSolved: 0,
  totalLessonsCompleted: 0,

  load: async () => {
    const [totalXp, streakInfo, todayLog, totalQuestionsSolved, totalLessonsCompleted] = await Promise.all([
      xpRepository.getTotal(),
      computeStreak(),
      studyLogRepository.getToday(),
      questionRepository.countSolved(),
      lessonRepository.countCompleted(),
    ]);
    const levelInfo = levelFromXp(totalXp);
    set({
      totalXp,
      ...levelInfo,
      currentStreak: streakInfo.currentStreak,
      longestStreak: streakInfo.longestStreak,
      studiedToday: streakInfo.studiedToday,
      todayMinutes: todayLog.minutes_studied,
      todayQuestions: todayLog.questions_solved,
      todayLessons: todayLog.lessons_completed,
      todayXp: todayLog.xp_earned,
      totalQuestionsSolved,
      totalLessonsCompleted,
    });
  },

  addXp: async (amount, reason, entityType, entityId) => {
    await xpRepository.add(amount, reason, entityType, entityId);
    const totalXp = await xpRepository.getTotal();
    const levelInfo = levelFromXp(totalXp);
    set({ totalXp, ...levelInfo, todayXp: get().todayXp + amount });

    const milestone = getStreakMilestone(get().currentStreak);
    if (milestone === 7) {
      await xpRepository.add(XP_REWARDS.STREAK_7, '7-day streak bonus', 'streak', String(milestone));
    } else if (milestone === 30) {
      await xpRepository.add(XP_REWARDS.STREAK_30, '30-day streak bonus', 'streak', String(milestone));
    } else if (milestone === 100) {
      await xpRepository.add(XP_REWARDS.STREAK_100, '100-day streak bonus', 'streak', String(milestone));
    } else if (milestone === 365) {
      await xpRepository.add(XP_REWARDS.STREAK_365, '365-day streak bonus', 'streak', String(milestone));
    }
  },

  recordLessonCompleted: async (lessonId) => {
    await lessonRepository.markCompleted(lessonId);
    await recordStudyDay();
    await studyLogRepository.addStudy(0, 0, 1, XP_REWARDS.LESSON_COMPLETED);
    await dailyStatsRepository.addStudy(0, 0, 1, XP_REWARDS.LESSON_COMPLETED, false);
    await get().addXp(XP_REWARDS.LESSON_COMPLETED, 'Lesson completed', 'lesson', lessonId);
    await get().load();
  },

  recordQuestionSolved: async (questionId) => {
    await questionRepository.markSolved(questionId);
    await recordStudyDay();
    await studyLogRepository.addStudy(0, 1, 0, XP_REWARDS.QUESTION_SOLVED);
    await dailyStatsRepository.addStudy(0, 1, 0, XP_REWARDS.QUESTION_SOLVED, false);
    await get().addXp(XP_REWARDS.QUESTION_SOLVED, 'Question solved', 'question', questionId);
    await get().load();
  },

  recordStudySession: async (minutes) => {
    await recordStudyDay();
    await studyLogRepository.addStudy(minutes, 0, 0, 0);
    await dailyStatsRepository.addStudy(minutes, 0, 0, 0, false);
    await get().load();
  },
}));
