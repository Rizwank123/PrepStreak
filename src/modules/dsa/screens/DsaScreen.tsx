import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { Card } from '../../../components/ui/Card';
import { DifficultyBadge } from '../../../components/ui/Badges';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { topicRepository, lessonRepository, questionRepository } from '../../../repository';
import type { Topic } from '../../../types';

interface TopicWithProgress extends Topic {
  completedLessons: number;
  totalLessons: number;
  totalQuestions: number;
  solvedQuestions: number;
}

export function DsaScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const topics = await topicRepository.getByModule('mod-dsa');
      const withProgress: TopicWithProgress[] = await Promise.all(
        topics.map(async (t) => {
          const lessons = await lessonRepository.getByTopic(t.id);
          const questions = await questionRepository.getByTopic(t.id);
          const completedLessons = lessons.filter((l) => l.is_completed === 1).length;
          const solvedQuestions = questions.filter((q) => q.is_solved === 1).length;
          return {
            ...t,
            completedLessons,
            totalLessons: lessons.length,
            totalQuestions: questions.length,
            solvedQuestions,
          };
        }),
      );
      setTopics(withProgress);
      setLoading(false);
    })();
  }, []);

  const handlePressTopic = useCallback((topic: TopicWithProgress) => {
    router.push(`/dsa/${topic.id}`);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: TopicWithProgress }) => {
    const progress = item.totalLessons > 0 ? item.completedLessons / item.totalLessons : 0;
    return (
      <Pressable onPress={() => handlePressTopic(item)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <Card style={styles.topicCard}>
          <View style={styles.topicHeader}>
            <View style={styles.topicTitleRow}>
              <Text style={[styles.topicTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
                {item.title}
              </Text>
              <DifficultyBadge difficulty={item.difficulty} />
            </View>
            <Text style={[styles.topicDesc, { color: theme.colors.secondaryText }]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={styles.topicStats}>
            <View style={styles.statRow}>
              <Text style={[styles.statText, { color: theme.colors.tertiaryText }]}>
                {item.completedLessons}/{item.totalLessons} lessons
              </Text>
              <Text style={[styles.statText, { color: theme.colors.tertiaryText }]}>
                {item.solvedQuestions}/{item.totalQuestions} questions
              </Text>
            </View>
            <ProgressBar progress={progress} height={5} />
          </View>
        </Card>
      </Pressable>
    );
  }, [handlePressTopic, theme]);

  if (loading) {
    return (
      <>
        <ScreenHeader title="DSA" subtitle="Data Structures & Algorithms" />
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <SkeletonCard />
          <View style={{ height: spacing.md }} />
          <SkeletonCard />
          <View style={{ height: spacing.md }} />
          <SkeletonCard />
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="DSA"
        subtitle="Data Structures & Algorithms"
        right={
          <Pressable onPress={() => router.push('/search')}>
            <View style={[styles.searchWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Search size={18} color={theme.colors.secondaryText} />
            </View>
          </Pressable>
        }
      />
      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  topicCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  topicHeader: {
    gap: spacing.xs,
  },
  topicTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topicTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  topicDesc: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  topicStats: {
    gap: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  searchWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    padding: spacing.lg,
  },
});
