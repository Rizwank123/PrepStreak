import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award, Flame, Target, BookOpen, CheckCircle, TrendingUp } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { Card } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { HeatmapCalendar, type HeatmapDay } from '../../../components/charts/HeatmapCalendar';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { useProgressStore } from '../../../store/progressStore';
import { calendarRepository, achievementRepository } from '../../../repository';
import type { Achievement, CalendarDay } from '../../../types';

export function ProgressScreen() {
  const { theme } = useTheme();
  const {
    totalXp, level, currentStreak, longestStreak,
    totalQuestionsSolved, totalLessonsCompleted,
  } = useProgressStore();
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      const startDate = start.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      const calendarDays = await calendarRepository.getRange(startDate, endDate);

      const days: HeatmapDay[] = [];
      const dayMap = new Map(calendarDays.map((d: CalendarDay) => [d.date, d]));
      const cursor = new Date(start);
      while (cursor <= now) {
        const dateStr = cursor.toISOString().split('T')[0];
        const day = dayMap.get(dateStr);
        const value = day?.minutes_studied ?? 0;
        const intensity = value === 0 ? 0 : value < 15 ? 1 : value < 30 ? 2 : value < 60 ? 3 : 4;
        days.push({ date: dateStr, intensity, value });
        cursor.setDate(cursor.getDate() + 1);
      }
      setHeatmapDays(days);

      const achs = await achievementRepository.getAll();
      setAchievements(achs);
    })();
  }, []);

  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.is_unlocked === 1),
    [achievements],
  );

  return (
    <>
      <ScreenHeader title="Progress" subtitle="Your preparation journey" />
      <ScreenContainer>
        <View style={styles.statsRow}>
          <StatCard
            label="Total XP"
            value={totalXp}
            icon={<TrendingUp size={18} color={theme.colors.xp} />}
            accentColor={theme.colors.xp}
          />
          <StatCard
            label="Level"
            value={level}
            icon={<Award size={18} color={theme.colors.primary} />}
            accentColor={theme.colors.primary}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="Current Streak"
            value={currentStreak}
            icon={<Flame size={18} color={theme.colors.streak} />}
            accentColor={theme.colors.streak}
          />
          <StatCard
            label="Best Streak"
            value={longestStreak}
            icon={<Flame size={18} color={theme.colors.streak} />}
            accentColor={theme.colors.streak}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="Solved"
            value={totalQuestionsSolved}
            icon={<CheckCircle size={18} color={theme.colors.success} />}
            accentColor={theme.colors.success}
          />
          <StatCard
            label="Lessons"
            value={totalLessonsCompleted}
            icon={<BookOpen size={18} color={theme.colors.primary} />}
            accentColor={theme.colors.primary}
          />
        </View>

        <Card elevated style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={18} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
              Activity Heatmap (90 days)
            </Text>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <HeatmapCalendar days={heatmapDays} />
          </View>
        </Card>

        <Card elevated style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={18} color={theme.colors.xp} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={[
                  styles.achievementCard,
                  {
                    backgroundColor: ach.is_unlocked ? theme.colors.xp + '12' : theme.colors.border + '20',
                    borderColor: ach.is_unlocked ? theme.colors.xp + '30' : 'transparent',
                  },
                ]}
              >
                <Award
                  size={20}
                  color={ach.is_unlocked ? theme.colors.xp : theme.colors.tertiaryText}
                />
                <Text
                  style={[
                    styles.achievementTitle,
                    { color: ach.is_unlocked ? theme.colors.primaryText : theme.colors.tertiaryText },
                  ]}
                  numberOfLines={1}
                >
                  {ach.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDesc,
                    { color: theme.colors.tertiaryText },
                  ]}
                  numberOfLines={2}
                >
                  {ach.description}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  section: {
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  achievementCard: {
    width: '48%',
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
  },
  achievementTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  achievementDesc: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.fontSize.xs * 1.4,
  },
});
