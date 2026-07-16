export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuestionStatus = 'not_started' | 'in_progress' | 'solved' | 'reviewing';
export type EntityType = 'roadmap' | 'module' | 'topic' | 'lesson' | 'question';

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  phase: number;
  order_index: number;
  icon: string;
  color: string;
  total_lessons: number;
  total_questions: number;
  created_at: number;
  updated_at: number;
}

export interface Module {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  order_index: number;
  icon: string;
  color: string;
  total_topics: number;
  total_lessons: number;
  total_questions: number;
  created_at: number;
  updated_at: number;
}

export interface Topic {
  id: string;
  module_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order_index: number;
  theory: string;
  visual_explanation: string;
  examples: string;
  complexity: string;
  patterns: string;
  interview_tips: string;
  common_mistakes: string;
  estimated_time_minutes: number;
  is_favorite: number;
  resources: string;
  created_at: number;
  updated_at: number;
}

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  order_index: number;
  estimated_time_minutes: number;
  is_completed: number;
  completed_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface Question {
  id: string;
  topic_id: string;
  title: string;
  platform: string;
  difficulty: Difficulty;
  pattern: string;
  companies: string;
  tags: string;
  problem_statement: string;
  examples: string;
  constraints: string;
  hints: string;
  brute_force: string;
  optimized_solution: string;
  time_complexity: string;
  space_complexity: string;
  related_problems: string;
  video_url: string;
  practice_urls: string;
  status: QuestionStatus;
  is_bookmarked: number;
  is_favorite: number;
  is_solved: number;
  attempts: number;
  personal_notes: string;
  estimated_time_minutes: number;
  last_attempted_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface Bookmark {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  title: string;
  subtitle: string;
  created_at: number;
}

export interface Note {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export interface Progress {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  status: QuestionStatus;
  progress_percent: number;
  time_spent_seconds: number;
  last_accessed_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface RevisionItem {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  title: string;
  interval_days: number;
  scheduled_date: number;
  is_completed: number;
  completed_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface StudyLog {
  id: string;
  date: string;
  minutes_studied: number;
  questions_solved: number;
  lessons_completed: number;
  xp_earned: number;
  created_at: number;
  updated_at: number;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  is_unlocked: number;
  unlocked_at: number | null;
  created_at: number;
}

export interface XpHistory {
  id: string;
  amount: number;
  reason: string;
  entity_type: string;
  entity_id: string;
  created_at: number;
}

export interface DailyStatistic {
  date: string;
  minutes_studied: number;
  questions_solved: number;
  lessons_completed: number;
  xp_earned: number;
  goal_met: number;
  created_at: number;
  updated_at: number;
}

export interface CalendarDay {
  date: string;
  studied: number;
  minutes_studied: number;
  questions_solved: number;
  lessons_completed: number;
  xp_earned: number;
  is_streak_day: number;
  created_at: number;
  updated_at: number;
}

export interface QuizResult {
  id: string;
  module_id: string;
  topic_id: string;
  score: number;
  total_questions: number;
  answers: string;
  created_at: number;
}
