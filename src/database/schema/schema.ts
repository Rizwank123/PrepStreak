export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS roadmaps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phase INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  icon TEXT NOT NULL DEFAULT 'book',
  color TEXT NOT NULL DEFAULT '#1f5af0',
  total_lessons INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  roadmap_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  icon TEXT NOT NULL DEFAULT 'book',
  color TEXT NOT NULL DEFAULT '#1f5af0',
  total_topics INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (roadmap_id) REFERENCES roadmaps (id)
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  order_index INTEGER NOT NULL,
  theory TEXT NOT NULL DEFAULT '',
  visual_explanation TEXT NOT NULL DEFAULT '',
  examples TEXT NOT NULL DEFAULT '[]',
  complexity TEXT NOT NULL DEFAULT '',
  patterns TEXT NOT NULL DEFAULT '[]',
  interview_tips TEXT NOT NULL DEFAULT '[]',
  common_mistakes TEXT NOT NULL DEFAULT '[]',
  estimated_time_minutes INTEGER NOT NULL DEFAULT 30,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  resources TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (module_id) REFERENCES modules (id)
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL,
  estimated_time_minutes INTEGER NOT NULL DEFAULT 15,
  is_completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics (id)
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'LeetCode',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  pattern TEXT NOT NULL DEFAULT '',
  companies TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  problem_statement TEXT NOT NULL DEFAULT '',
  examples TEXT NOT NULL DEFAULT '[]',
  constraints TEXT NOT NULL DEFAULT '',
  hints TEXT NOT NULL DEFAULT '[]',
  brute_force TEXT NOT NULL DEFAULT '',
  optimized_solution TEXT NOT NULL DEFAULT '',
  time_complexity TEXT NOT NULL DEFAULT '',
  space_complexity TEXT NOT NULL DEFAULT '',
  related_problems TEXT NOT NULL DEFAULT '[]',
  video_url TEXT NOT NULL DEFAULT '',
  practice_urls TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'not_started',
  is_bookmarked INTEGER NOT NULL DEFAULT 0,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_solved INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  personal_notes TEXT NOT NULL DEFAULT '',
  estimated_time_minutes INTEGER NOT NULL DEFAULT 20,
  last_attempted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics (id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress_percent REAL NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  last_accessed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS revision_schedule (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  interval_days INTEGER NOT NULL,
  scheduled_date INTEGER NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS study_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(date)
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'award',
  threshold INTEGER NOT NULL,
  is_unlocked INTEGER NOT NULL DEFAULT 0,
  unlocked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS xp_history (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT '',
  entity_id TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_statistics (
  date TEXT PRIMARY KEY,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  goal_met INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  hour INTEGER NOT NULL,
  minute INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  days TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS calendar (
  date TEXT PRIMARY KEY,
  studied INTEGER NOT NULL DEFAULT 0,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  is_streak_day INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  target INTEGER NOT NULL,
  period TEXT NOT NULL DEFAULT 'daily',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  topic_id TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answers TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_modules_roadmap ON modules (roadmap_id);
CREATE INDEX IF NOT EXISTS idx_topics_module ON topics (module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons (topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions (topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_entity ON progress (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_revision_date ON revision_schedule (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_study_logs_date ON study_logs (date);
CREATE INDEX IF NOT EXISTS idx_xp_history_created ON xp_history (created_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_statistics (date);
CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar (date);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_entity ON bookmarks (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_favorites_entity ON favorites (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions (difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_pattern ON questions (pattern);
`;
