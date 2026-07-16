import type { QuizQuestion } from '../../content/types';

const store = new Map<string, QuizQuestion[]>();

export function registerQuiz(slug: string, quiz: QuizQuestion[]): void {
  store.set(slug, quiz);
}

export function loadQuiz(slug: string): QuizQuestion[] {
  return store.get(slug) ?? [];
}
