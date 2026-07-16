import { getDatabase } from '../database/db';
import {
  insertRow, selectAll, selectById, selectWhere,
  updateField, deleteById, countRows,
} from './baseRepository';
import type {
  Roadmap, Module, Topic, Lesson, Question,
  Bookmark, Note, Progress, RevisionItem, StudyLog,
  Achievement, XpHistory, DailyStatistic, CalendarDay,
  EntityType,
} from '../types';

const now = () => Date.now();
const today = () => new Date().toISOString().split('T')[0];
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const roadmapRepository = {
  async getAll(): Promise<Roadmap[]> {
    const db = await getDatabase();
    return selectAll<Roadmap>(db, 'roadmaps', 'order_index ASC');
  },
  async getById(id: string): Promise<Roadmap | null> {
    const db = await getDatabase();
    return selectById<Roadmap>(db, 'roadmaps', id);
  },
  async upsert(roadmap: Roadmap): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'roadmaps', roadmap as unknown as Record<string, unknown>);
  },
};

export const moduleRepository = {
  async getByRoadmap(roadmapId: string): Promise<Module[]> {
    const db = await getDatabase();
    return selectWhere<Module>(db, 'modules', 'roadmap_id = ?', [roadmapId], 'order_index ASC');
  },
  async getById(id: string): Promise<Module | null> {
    const db = await getDatabase();
    return selectById<Module>(db, 'modules', id);
  },
  async upsert(module: Module): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'modules', module as unknown as Record<string, unknown>);
  },
};

export const topicRepository = {
  async getByModule(moduleId: string): Promise<Topic[]> {
    const db = await getDatabase();
    return selectWhere<Topic>(db, 'topics', 'module_id = ?', [moduleId], 'order_index ASC');
  },
  async getById(id: string): Promise<Topic | null> {
    const db = await getDatabase();
    return selectById<Topic>(db, 'topics', id);
  },
  async upsert(topic: Topic): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'topics', topic as unknown as Record<string, unknown>);
  },
  async toggleFavorite(id: string, current: number): Promise<void> {
    const db = await getDatabase();
    await updateField(db, 'topics', id, 'is_favorite', current ? 0 : 1);
  },
};

export const lessonRepository = {
  async getByTopic(topicId: string): Promise<Lesson[]> {
    const db = await getDatabase();
    return selectWhere<Lesson>(db, 'lessons', 'topic_id = ?', [topicId], 'order_index ASC');
  },
  async getById(id: string): Promise<Lesson | null> {
    const db = await getDatabase();
    return selectById<Lesson>(db, 'lessons', id);
  },
  async upsert(lesson: Lesson): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'lessons', lesson as unknown as Record<string, unknown>);
  },
  async markCompleted(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE lessons SET is_completed = 1, completed_at = ?, updated_at = ? WHERE id = ?;',
      [now(), now(), id],
    );
  },
  async markIncomplete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE lessons SET is_completed = 0, completed_at = NULL, updated_at = ? WHERE id = ?;',
      [now(), id],
    );
  },
  async countCompleted(topicId?: string): Promise<number> {
    const db = await getDatabase();
    if (topicId) {
      return countRows(db, 'lessons', 'topic_id = ? AND is_completed = 1', [topicId]);
    }
    return countRows(db, 'lessons', 'is_completed = 1');
  },
};

export const questionRepository = {
  async getByTopic(topicId: string): Promise<Question[]> {
    const db = await getDatabase();
    return selectWhere<Question>(db, 'questions', 'topic_id = ?', [topicId], 'difficulty ASC');
  },
  async getById(id: string): Promise<Question | null> {
    const db = await getDatabase();
    return selectById<Question>(db, 'questions', id);
  },
  async upsert(question: Question): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'questions', question as unknown as Record<string, unknown>);
  },
  async updateStatus(id: string, status: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE questions SET status = ?, updated_at = ? WHERE id = ?;`,
      [status, now(), id],
    );
  },
  async markSolved(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE questions SET is_solved = 1, status = 'solved', attempts = attempts + 1,
       last_attempted_at = ?, updated_at = ? WHERE id = ?;`,
      [now(), now(), id],
    );
  },
  async toggleBookmark(id: string, current: number): Promise<void> {
    const db = await getDatabase();
    await updateField(db, 'questions', id, 'is_bookmarked', current ? 0 : 1);
  },
  async toggleFavorite(id: string, current: number): Promise<void> {
    const db = await getDatabase();
    await updateField(db, 'questions', id, 'is_favorite', current ? 0 : 1);
  },
  async updateNotes(id: string, notes: string): Promise<void> {
    const db = await getDatabase();
    await updateField(db, 'questions', id, 'personal_notes', notes);
  },
  async countSolved(): Promise<number> {
    const db = await getDatabase();
    return countRows(db, 'questions', 'is_solved = 1');
  },
  async countByDifficulty(difficulty: string): Promise<number> {
    const db = await getDatabase();
    return countRows(db, 'questions', 'difficulty = ?', [difficulty]);
  },
  async search(query: string): Promise<Question[]> {
    const db = await getDatabase();
    const like = `%${query}%`;
    return db.getAllAsync<Question>(
      `SELECT * FROM questions WHERE title LIKE ? OR pattern LIKE ? OR tags LIKE ? LIMIT 50;`,
      [like, like, like],
    );
  },
};

export const bookmarkRepository = {
  async getAll(): Promise<Bookmark[]> {
    const db = await getDatabase();
    return selectAll<Bookmark>(db, 'bookmarks', 'created_at DESC');
  },
  async add(item: Omit<Bookmark, 'id' | 'created_at'>): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'bookmarks', { ...item, id: uid(), created_at: now() });
  },
  async remove(entityType: string, entityId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'DELETE FROM bookmarks WHERE entity_type = ? AND entity_id = ?;',
      [entityType, entityId],
    );
  },
};

export const noteRepository = {
  async getByEntity(entityType: string, entityId: string): Promise<Note[]> {
    const db = await getDatabase();
    return selectWhere<Note>(db, 'notes', 'entity_type = ? AND entity_id = ?', [entityType, entityId], 'updated_at DESC');
  },
  async upsert(note: Partial<Note> & { title: string; content: string }): Promise<string> {
    const db = await getDatabase();
    const id = note.id ?? uid();
    await insertRow(db, 'notes', {
      id,
      entity_type: (note.entity_type ?? '') as string,
      entity_id: (note.entity_id ?? '') as string,
      title: note.title,
      content: note.content,
      created_at: note.created_at ?? now(),
      updated_at: now(),
    });
    return id;
  },
  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await deleteById(db, 'notes', id);
  },
};

export const progressRepository = {
  async getByEntity(entityType: string, entityId: string): Promise<Progress | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Progress>(
      'SELECT * FROM progress WHERE entity_type = ? AND entity_id = ? LIMIT 1;',
      [entityType, entityId],
    );
    return result ?? null;
  },
  async upsert(entityType: string, entityId: string, percent: number, status: string, timeSpent: number): Promise<void> {
    const db = await getDatabase();
    const existing = await this.getByEntity(entityType, entityId);
    const id = existing?.id ?? uid();
    await insertRow(db, 'progress', {
      id,
      entity_type: entityType,
      entity_id: entityId,
      status,
      progress_percent: percent,
      time_spent_seconds: (existing?.time_spent_seconds ?? 0) + timeSpent,
      last_accessed_at: now(),
      created_at: existing?.created_at ?? now(),
      updated_at: now(),
    });
  },
};

export const revisionRepository = {
  async getPending(): Promise<RevisionItem[]> {
    const db = await getDatabase();
    return selectWhere<RevisionItem>(db, 'revision_schedule', 'is_completed = 0', [], 'scheduled_date ASC');
  },
  async getDueToday(): Promise<RevisionItem[]> {
    const db = await getDatabase();
    const todayMs = new Date(today()).getTime();
    return selectWhere<RevisionItem>(
      db, 'revision_schedule',
      'is_completed = 0 AND scheduled_date <= ?', [todayMs],
      'scheduled_date ASC',
    );
  },
  async upsert(item: Omit<RevisionItem, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'revision_schedule', {
      ...item,
      id: uid(),
      created_at: now(),
      updated_at: now(),
    });
  },
  async markCompleted(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE revision_schedule SET is_completed = 1, completed_at = ?, updated_at = ? WHERE id = ?;',
      [now(), now(), id],
    );
  },
  async createSchedule(entityType: string, entityId: string, title: string): Promise<void> {
    const intervals = [1, 3, 7, 15, 30, 60, 90, 180, 365];
    for (const days of intervals) {
      const scheduled = Date.now() + days * 24 * 60 * 60 * 1000;
      await this.upsert({
        entity_type: entityType as EntityType,
        entity_id: entityId,
        title,
        interval_days: days,
        scheduled_date: scheduled,
        is_completed: 0,
        completed_at: null,
      });
    }
  },
};

export const studyLogRepository = {
  async getToday(): Promise<StudyLog> {
    const db = await getDatabase();
    const date = today();
    let log = await db.getFirstAsync<StudyLog>(
      'SELECT * FROM study_logs WHERE date = ? LIMIT 1;', [date],
    );
    if (!log) {
      const id = uid();
      await insertRow(db, 'study_logs', {
        id, date, minutes_studied: 0, questions_solved: 0,
        lessons_completed: 0, xp_earned: 0, created_at: now(), updated_at: now(),
      });
      log = await db.getFirstAsync<StudyLog>(
        'SELECT * FROM study_logs WHERE date = ? LIMIT 1;', [date],
      );
    }
    return log!;
  },
  async addStudy(minutes: number, questions: number, lessons: number, xp: number): Promise<void> {
    const db = await getDatabase();
    const date = today();
    const existing = await db.getFirstAsync<StudyLog>(
      'SELECT * FROM study_logs WHERE date = ? LIMIT 1;', [date],
    );
    if (existing) {
      await db.runAsync(
        `UPDATE study_logs SET minutes_studied = minutes_studied + ?, questions_solved = questions_solved + ?,
         lessons_completed = lessons_completed + ?, xp_earned = xp_earned + ?, updated_at = ? WHERE date = ?;`,
        [minutes, questions, lessons, xp, now(), date],
      );
    } else {
      const id = uid();
      await insertRow(db, 'study_logs', {
        id, date, minutes_studied: minutes, questions_solved: questions,
        lessons_completed: lessons, xp_earned: xp, created_at: now(), updated_at: now(),
      });
    }
  },
  async getRange(startDate: string, endDate: string): Promise<StudyLog[]> {
    const db = await getDatabase();
    return selectWhere<StudyLog>(db, 'study_logs', 'date >= ? AND date <= ?', [startDate, endDate], 'date ASC');
  },
  async getAll(): Promise<StudyLog[]> {
    const db = await getDatabase();
    return selectAll<StudyLog>(db, 'study_logs', 'date ASC');
  },
};

export const achievementRepository = {
  async getAll(): Promise<Achievement[]> {
    const db = await getDatabase();
    return selectAll<Achievement>(db, 'achievements', 'threshold ASC');
  },
  async upsert(achievement: Achievement): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'achievements', achievement as unknown as Record<string, unknown>);
  },
  async unlock(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE achievements SET is_unlocked = 1, unlocked_at = ? WHERE id = ?;',
      [now(), id],
    );
  },
};

export const xpRepository = {
  async add(amount: number, reason: string, entityType: string, entityId: string): Promise<void> {
    const db = await getDatabase();
    await insertRow(db, 'xp_history', {
      id: uid(), amount, reason, entity_type: entityType, entity_id: entityId, created_at: now(),
    });
  },
  async getTotal(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(amount), 0) as total FROM xp_history;',
    );
    return result?.total ?? 0;
  },
  async getRecent(limit: number): Promise<XpHistory[]> {
    const db = await getDatabase();
    return db.getAllAsync<XpHistory>(
      'SELECT * FROM xp_history ORDER BY created_at DESC LIMIT ?;',
      [limit],
    );
  },
};

export const dailyStatsRepository = {
  async getToday(): Promise<DailyStatistic> {
    const db = await getDatabase();
    const date = today();
    let stat = await db.getFirstAsync<DailyStatistic>(
      'SELECT * FROM daily_statistics WHERE date = ? LIMIT 1;', [date],
    );
    if (!stat) {
      await insertRow(db, 'daily_statistics', {
        date, minutes_studied: 0, questions_solved: 0, lessons_completed: 0,
        xp_earned: 0, goal_met: 0, created_at: now(), updated_at: now(),
      });
      stat = await db.getFirstAsync<DailyStatistic>(
        'SELECT * FROM daily_statistics WHERE date = ? LIMIT 1;', [date],
      );
    }
    return stat!;
  },
  async addStudy(minutes: number, questions: number, lessons: number, xp: number, goalMet: boolean): Promise<void> {
    const db = await getDatabase();
    const date = today();
    const existing = await db.getFirstAsync<DailyStatistic>(
      'SELECT * FROM daily_statistics WHERE date = ? LIMIT 1;', [date],
    );
    if (existing) {
      await db.runAsync(
        `UPDATE daily_statistics SET minutes_studied = minutes_studied + ?, questions_solved = questions_solved + ?,
         lessons_completed = lessons_completed + ?, xp_earned = xp_earned + ?, goal_met = ?,
         updated_at = ? WHERE date = ?;`,
        [minutes, questions, lessons, xp, goalMet ? 1 : existing.goal_met, now(), date],
      );
    } else {
      await insertRow(db, 'daily_statistics', {
        date, minutes_studied: minutes, questions_solved: questions,
        lessons_completed: lessons, xp_earned: xp, goal_met: goalMet ? 1 : 0,
        created_at: now(), updated_at: now(),
      });
    }
  },
  async getRange(startDate: string, endDate: string): Promise<DailyStatistic[]> {
    const db = await getDatabase();
    return selectWhere<DailyStatistic>(db, 'daily_statistics', 'date >= ? AND date <= ?', [startDate, endDate], 'date ASC');
  },
};

export const calendarRepository = {
  async getDay(date: string): Promise<CalendarDay | null> {
    const db = await getDatabase();
    return selectById<CalendarDay>(db, 'calendar', date);
  },
  async upsert(day: Omit<CalendarDay, 'created_at' | 'updated_at'>): Promise<void> {
    const db = await getDatabase();
    const existing = await this.getDay(day.date);
    await insertRow(db, 'calendar', {
      ...day,
      created_at: existing?.created_at ?? now(),
      updated_at: now(),
    });
  },
  async getRange(startDate: string, endDate: string): Promise<CalendarDay[]> {
    const db = await getDatabase();
    return selectWhere<CalendarDay>(db, 'calendar', 'date >= ? AND date <= ?', [startDate, endDate], 'date ASC');
  },
  async getStreakDays(): Promise<CalendarDay[]> {
    const db = await getDatabase();
    return selectWhere<CalendarDay>(db, 'calendar', 'is_streak_day = 1', [], 'date DESC');
  },
};
