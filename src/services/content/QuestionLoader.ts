import type { ContentQuestion } from '../../content/types';

const store = new Map<string, ContentQuestion[]>();

export function registerQuestions(slug: string, questions: ContentQuestion[]): void {
  store.set(slug, questions);
}

export function loadQuestions(slug: string): ContentQuestion[] {
  return store.get(slug) ?? [];
}

export function loadQuestionById(slug: string, id: string): ContentQuestion | null {
  return store.get(slug)?.find((q) => q.id === id) ?? null;
}
