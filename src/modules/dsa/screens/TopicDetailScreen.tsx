import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Lightbulb, AlertTriangle, Clock, Star, ChevronRight } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { DifficultyBadge } from '../../../components/ui/Badges';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { topicRepository, lessonRepository, questionRepository } from '../../../repository';
import { useProgressStore } from '../../../store/progressStore';
import type { Topic, Lesson, Question } from '../../../types';

export function TopicDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const recordLesson = useProgressStore((s) => s.recordLessonCompleted);
  const recordQuestion = useProgressStore((s) => s.recordQuestionSolved);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const t = await topicRepository.getById(id);
      setTopic(t);
      const l = await lessonRepository.getByTopic(id);
      setLessons(l);
      const q = await questionRepository.getByTopic(id);
      setQuestions(q);
    })();
  }, [id]);

  const handleToggleLesson = useCallback(async (lesson: Lesson) => {
    if (lesson.is_completed) {
      await lessonRepository.markIncomplete(lesson.id);
    } else {
      await recordLesson(lesson.id);
    }
    if (id) {
      const l = await lessonRepository.getByTopic(id);
      setLessons(l);
    }
  }, [id, recordLesson]);

  const handlePressQuestion = useCallback((q: Question) => {
    router.push(`/dsa/question/${q.id}`);
  }, [router]);

  const handleToggleFavorite = useCallback(async () => {
    if (!topic) return;
    await topicRepository.toggleFavorite(topic.id, topic.is_favorite);
    const updated = await topicRepository.getById(topic.id);
    setTopic(updated);
  }, [topic]);

  if (!topic) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.secondaryText }}>Loading...</Text>
      </View>
    );
  }

  const tips: string[] = JSON.parse(topic.interview_tips || '[]');
  const mistakes: string[] = JSON.parse(topic.common_mistakes || '[]');
  const completedLessons = lessons.filter((l) => l.is_completed === 1).length;
  const progress = lessons.length > 0 ? completedLessons / lessons.length : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.colors.primaryText} />
        </Pressable>
        <Pressable onPress={handleToggleFavorite} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Star
            size={24}
            color={theme.colors.streak}
            fill={topic.is_favorite ? theme.colors.streak : 'none'}
          />
        </Pressable>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            {topic.title}
          </Text>
          <DifficultyBadge difficulty={topic.difficulty} />
        </View>
        <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
          {topic.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={theme.colors.tertiaryText} />
            <Text style={[styles.metaText, { color: theme.colors.tertiaryText }]}>
              {topic.estimated_time_minutes} min
            </Text>
          </View>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { color: theme.colors.secondaryText }]}>
              Progress
            </Text>
            <Text style={[styles.progressValue, { color: theme.colors.primaryText }]}>
              {completedLessons}/{lessons.length} lessons
            </Text>
          </View>
          <ProgressBar progress={progress} height={8} />
        </View>
      </View>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <BookOpen size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
            Theory
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: theme.colors.secondaryText }]}>
          {topic.theory}
        </Text>
      </Card>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
          Lessons
        </Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {lessons.map((lesson) => (
            <Pressable key={lesson.id} onPress={() => handleToggleLesson(lesson)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Card style={styles.lessonCard}>
                <View style={styles.lessonRow}>
                  {lesson.is_completed ? (
                    <CheckCircle2 size={20} color={theme.colors.success} />
                  ) : (
                    <Circle size={20} color={theme.colors.tertiaryText} />
                  )}
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, { color: theme.colors.primaryText }]} numberOfLines={2}>
                      {lesson.title}
                    </Text>
                    <Text style={[styles.lessonMeta, { color: theme.colors.tertiaryText }]}>
                      {lesson.estimated_time_minutes} min
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>

      {tips.length > 0 && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={18} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
              Interview Tips
            </Text>
          </View>
          {tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={[styles.tipBullet, { color: theme.colors.warning }]}>{'\u2022'}</Text>
              <Text style={[styles.tipText, { color: theme.colors.secondaryText }]}>{tip}</Text>
            </View>
          ))}
        </Card>
      )}

      {mistakes.length > 0 && (
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={18} color={theme.colors.error} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
              Common Mistakes
            </Text>
          </View>
          {mistakes.map((mistake, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={[styles.tipBullet, { color: theme.colors.error }]}>{'\u2022'}</Text>
              <Text style={[styles.tipText, { color: theme.colors.secondaryText }]}>{mistake}</Text>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
          Practice Questions
        </Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {questions.length === 0 ? (
            <EmptyState
              title="No questions yet"
              subtitle="Questions for this topic will appear here."
            />
          ) : (
            questions.map((q) => (
              <Pressable key={q.id} onPress={() => handlePressQuestion(q)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <Card style={styles.questionCard}>
                  <View style={styles.questionRow}>
                    <View style={styles.questionInfo}>
                      <Text style={[styles.questionTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
                        {q.title}
                      </Text>
                      <View style={styles.questionMeta}>
                        <DifficultyBadge difficulty={q.difficulty} />
                        <Text style={[styles.questionPlatform, { color: theme.colors.tertiaryText }]}>
                          {q.platform}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color={theme.colors.tertiaryText} />
                  </View>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  description: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
  },
  progressSection: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  progressValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  sectionContent: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.5,
  },
  lessonCard: {
    padding: spacing.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  lessonInfo: {
    flex: 1,
    gap: 2,
  },
  lessonTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  lessonMeta: {
    fontSize: typography.fontSize.xs,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.5,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
    flex: 1,
  },
  questionCard: {
    padding: spacing.md,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  questionInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  questionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  questionPlatform: {
    fontSize: typography.fontSize.xs,
  },
});
