import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema/schema';

const DB_NAME = 'prepstreak.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(SCHEMA_SQL);

  // Run additive migrations safely
  try {
    await db.execAsync(`ALTER TABLE topics ADD COLUMN content_path TEXT NOT NULL DEFAULT '';`);
  } catch {
    // Column already exists — safe to ignore
  }

  dbInstance = db;
  return db;
}

export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  const tables = [
    'quiz_results', 'goals', 'calendar', 'favorites', 'reminders',
    'daily_statistics', 'xp_history', 'achievements', 'study_logs',
    'revision_schedule', 'progress', 'notes', 'bookmarks', 'questions',
    'lessons', 'topics', 'modules', 'roadmaps',
  ];
  for (const table of tables) {
    await db.runAsync(`DELETE FROM ${table};`);
  }
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
