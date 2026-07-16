import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Layers } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { roadmapRepository, moduleRepository, topicRepository, lessonRepository, questionRepository } from '../../../repository';
import type { Roadmap } from '../../../types';

interface RoadmapWithProgress extends Roadmap {
  completedLessons: number;
  completedQuestions: number;
}

export function RoadmapScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<RoadmapWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const allRoadmaps = await roadmapRepository.getAll();
      const withProgress: RoadmapWithProgress[] = await Promise.all(
        allRoadmaps.map(async (rm) => {
          const modules = await moduleRepository.getByRoadmap(rm.id);
          let completedLessons = 0;
          let completedQuestions = 0;
          for (const mod of modules) {
            const topics = await topicRepository.getByModule(mod.id);
            for (const topic of topics) {
              const lessons = await lessonRepository.getByTopic(topic.id);
              completedLessons += lessons.filter((l) => l.is_completed === 1).length;
              const questions = await questionRepository.getByTopic(topic.id);
              completedQuestions += questions.filter((q) => q.is_solved === 1).length;
            }
          }
          return { ...rm, completedLessons, completedQuestions };
        }),
      );
      setRoadmaps(withProgress);
      setLoading(false);
    })();
  }, []);

  const ROADMAP_ROUTES: Record<string, string> = {
    'rm-dsa': '/dsa',
    'rm-sysdesign': '/system-design',
    'rm-golang': '/golang',
    'rm-interview': '/interview',
    'rm-cloud': '/aws',
  };

  const handlePressRoadmap = useCallback((rm: RoadmapWithProgress) => {
    const route = ROADMAP_ROUTES[rm.id];
    if (route) router.push(route as never);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: RoadmapWithProgress }) => {
    const lessonProgress = item.total_lessons > 0 ? item.completedLessons / item.total_lessons : 0;
    const questionProgress = item.total_questions > 0 ? item.completedQuestions / item.total_questions : 0;
    const overallProgress = (lessonProgress + questionProgress) / 2;
    const completionPercent = Math.round(overallProgress * 100);
    const remainingLessons = Math.max(0, item.total_lessons - item.completedLessons);

    return (
      <Pressable onPress={() => handlePressRoadmap(item)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <Card elevated style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
              <Layers size={22} color={item.color} />
            </View>
            <View style={styles.headerInfo}>
              <View style={styles.phaseRow}>
                <Text style={[styles.phaseText, { color: item.color }]}>
                  Phase {item.phase}
                </Text>
                <Text style={[styles.completion, { color: theme.colors.tertiaryText }]}>
                  {completionPercent}%
                </Text>
              </View>
              <Text style={[styles.title, { color: theme.colors.primaryText }]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </View>
          <Text style={[styles.description, { color: theme.colors.secondaryText }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.secondaryText }]}>
                {item.completedLessons}/{item.total_lessons} lessons
              </Text>
              <Text style={[styles.progressLabel, { color: theme.colors.secondaryText }]}>
                {item.completedQuestions}/{item.total_questions} questions
              </Text>
            </View>
            <ProgressBar progress={overallProgress} height={8} color={item.color} />
          </View>
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.tertiaryText }]}>
              {remainingLessons > 0 ? `${remainingLessons} lessons remaining` : 'Complete!'}
            </Text>
            <ChevronRight size={18} color={theme.colors.tertiaryText} />
          </View>
        </Card>
      </Pressable>
    );
  }, [handlePressRoadmap, theme]);

  if (loading) {
    return (
      <>
        <ScreenHeader title="Roadmap" subtitle="Your preparation journey" />
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
      <ScreenHeader title="Roadmap" subtitle="Your preparation journey" />
      <FlatList
        data={roadmaps}
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
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  phaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  completion: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  progressSection: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
  },
  loadingContainer: {
    flex: 1,
    padding: spacing.lg,
  },
});
