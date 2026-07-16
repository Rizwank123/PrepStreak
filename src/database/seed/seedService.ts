import { getDatabase } from '../db';
import {
  roadmapRepository, moduleRepository, topicRepository,
  lessonRepository, questionRepository, achievementRepository,
} from '../../repository';
import {
  roadmaps, modules, allTopics, topicsToDb,
  makeLessons, makeQuestions, achievements,
} from '../seed/seedData';

let seeded = false;

export async function seedDatabase(): Promise<void> {
  if (seeded) return;
  const db = await getDatabase();

  const existingCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM roadmaps;',
  );
  if (existingCount && existingCount.count > 0) {
    seeded = true;
    return;
  }

  for (const roadmap of roadmaps) {
    await roadmapRepository.upsert(roadmap);
  }

  for (const module of modules) {
    await moduleRepository.upsert(module);
  }

  for (const topic of allTopics) {
    const dbTopic = topicsToDb(topic);
    await topicRepository.upsert(dbTopic);

    const lessons = makeLessons(topic);
    for (const lesson of lessons) {
      await lessonRepository.upsert(lesson);
    }

    const questions = makeQuestions(topic);
    for (const question of questions) {
      await questionRepository.upsert(question);
    }
  }

  const now = Date.now();
  for (const achievement of achievements) {
    await achievementRepository.upsert({
      ...achievement,
      is_unlocked: 0,
      unlocked_at: null,
      created_at: now,
    });
  }

  seeded = true;
}
