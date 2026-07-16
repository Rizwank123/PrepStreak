import { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { StreakWidget } from '../components/StreakWidget';
import { XpWidget } from '../components/XpWidget';
import { DailyGoalWidget } from '../components/DailyGoalWidget';
import { WeeklyGraphWidget } from '../components/WeeklyGraphWidget';
import { QuickResumeWidget } from '../components/QuickResumeWidget';
import { MotivationWidget } from '../components/MotivationWidget';
import { useProgressStore } from '../../../store/progressStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { topicRepository, moduleRepository } from '../../../repository';
import type { Topic, Module } from '../../../types';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';

export function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { totalQuestionsSolved, totalLessonsCompleted, currentStreak, level } = useProgressStore();
  const reminderEnabled = useSettingsStore((s) => s.reminderEnabled);
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);

  useEffect(() => {
    (async () => {
      const modules = await moduleRepository.getByRoadmap('rm-dsa');
      if (modules.length === 0) return;
      const topics = await topicRepository.getByModule(modules[0].id);
      setRecentTopics(topics.slice(0, 5));
    })();
  }, []);

  const handlePressTopic = useCallback((topic: Topic) => {
    router.push(`/dsa/${topic.id}`);
  }, [router]);

  return (
    <>
      <ScreenHeader
        title="PrepStreak"
        subtitle="Prepare Daily. Build Consistency. Crack Interviews."
        right={
          <Pressable onPress={() => router.push('/settings')}>
            <View style={[styles.bellWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Bell size={18} color={theme.colors.secondaryText} />
              {reminderEnabled && <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />}
            </View>
          </Pressable>
        }
      />
      <ScreenContainer>
        <View style={styles.statsRow}>
          <StatCard
            label="Streak"
            value={currentStreak}
            accentColor={theme.colors.streak}
          />
          <StatCard
            label="Level"
            value={level}
            accentColor={theme.colors.xp}
          />
          <StatCard
            label="Solved"
            value={totalQuestionsSolved}
            accentColor={theme.colors.success}
          />
        </View>

        <StreakWidget />
        <XpWidget />
        <DailyGoalWidget />
        <WeeklyGraphWidget />

        <QuickResumeWidget recentTopics={recentTopics} onPressTopic={handlePressTopic} />

        <MotivationWidget />

        <Pressable onPress={() => router.push('/progress')}>
          <Card style={styles.calendarCard}>
            <View style={styles.calendarRow}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
                <Calendar size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.calendarInfo}>
                <Text style={[styles.calendarTitle, { color: theme.colors.primaryText }]}>
                  Study Calendar
                </Text>
                <Text style={[styles.calendarSub, { color: theme.colors.secondaryText }]}>
                  View your activity heatmap and stats
                </Text>
              </View>
            </View>
          </Card>
        </Pressable>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calendarCard: {
    padding: spacing.md,
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarInfo: {
    flex: 1,
    gap: 2,
  },
  calendarTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  calendarSub: {
    fontSize: typography.fontSize.sm,
  },
});
