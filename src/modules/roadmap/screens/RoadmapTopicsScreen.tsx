import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { Card } from '../../../components/ui/Card';
import { DifficultyBadge } from '../../../components/ui/Badges';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { moduleRepository, topicRepository, lessonRepository } from '../../../repository';
import type { Topic, Module } from '../../../types';

interface TopicWithProgress extends Topic {
  completedLessons: number;
  totalLessons: number;
}

interface Props {
  moduleId: string;
  roadmapRoute: string;
}

export function RoadmapTopicsScreen({ moduleId, roadmapRoute }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const [mod, setMod] = useState<Module | null>(null);
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const m = await moduleRepository.getById(moduleId);
      setMod(m);
      const ts = await topicRepository.getByModule(moduleId);
      const withProgress = await Promise.all(
        ts.map(async (t) => {
          const lessons = await lessonRepository.getByTopic(t.id);
          return { ...t, completedLessons: lessons.filter((l) => l.is_completed === 1).length, totalLessons: lessons.length };
        }),
      );
      setTopics(withProgress);
      setLoading(false);
    })();
  }, [moduleId]);

  const handlePressTopic = useCallback((topic: TopicWithProgress) => {
    router.push(`/${roadmapRoute}/${topic.id}` as never);
  }, [router, roadmapRoute]);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color={theme.colors.primaryText} />
          </Pressable>
          <Text style={[styles.topBarTitle, { color: theme.colors.primaryText }]}>Loading…</Text>
        </View>
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.colors.primaryText} />
        </Pressable>
        <View style={styles.topBarInfo}>
          <Text style={[styles.topBarTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
            {mod?.title ?? 'Topics'}
          </Text>
          <Text style={[styles.topBarSub, { color: theme.colors.tertiaryText }]}>
            {topics.length} topics
          </Text>
        </View>
      </View>

      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const progress = item.totalLessons > 0 ? item.completedLessons / item.totalLessons : 0;
          return (
            <Pressable onPress={() => handlePressTopic(item)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <DifficultyBadge difficulty={item.difficulty} />
                </View>
                <Text style={[styles.cardDesc, { color: theme.colors.secondaryText }]} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.cardFooter}>
                  <ProgressBar progress={progress} height={4} />
                  <View style={styles.cardStats}>
                    <Text style={[styles.statText, { color: theme.colors.tertiaryText }]}>
                      {item.completedLessons}/{item.totalLessons} lessons
                    </Text>
                    <ChevronRight size={16} color={theme.colors.tertiaryText} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBarInfo: { flex: 1 },
  topBarTitle: { fontSize: typography.fontSize.lg, fontWeight: '700' },
  topBarSub: { fontSize: typography.fontSize.sm },
  card: { padding: spacing.md, gap: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  cardTitle: { flex: 1, fontSize: typography.fontSize.lg, fontWeight: '600' },
  cardDesc: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.4 },
  cardFooter: { gap: spacing.xs },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statText: { fontSize: typography.fontSize.xs },
});
