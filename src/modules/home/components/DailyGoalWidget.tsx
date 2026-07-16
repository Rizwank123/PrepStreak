import { StyleSheet, Text, View } from 'react-native';
import { Target, CheckCircle } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { useProgressStore } from '../../../store/progressStore';
import { useSettingsStore } from '../../../store/settingsStore';

export function DailyGoalWidget() {
  const { theme } = useTheme();
  const { todayQuestions, todayLessons, todayMinutes } = useProgressStore();
  const dailyGoalQuestions = useSettingsStore((s) => s.dailyGoalQuestions);
  const dailyGoalMinutes = useSettingsStore((s) => s.dailyGoalMinutes);

  const questionProgress = dailyGoalQuestions > 0 ? todayQuestions / dailyGoalQuestions : 0;
  const timeProgress = dailyGoalMinutes > 0 ? todayMinutes / dailyGoalMinutes : 0;
  const overallProgress = (questionProgress + timeProgress) / 2;
  const remaining = Math.max(0, dailyGoalQuestions - todayQuestions);

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
          <Target size={20} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          Today's Goal
        </Text>
      </View>
      <View style={styles.progressRow}>
        <View style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              Questions
            </Text>
            <Text style={[styles.value, { color: theme.colors.primaryText }]}>
              {todayQuestions} / {dailyGoalQuestions}
            </Text>
          </View>
          <ProgressBar progress={questionProgress} height={6} />
        </View>
        <View style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              Study Time
            </Text>
            <Text style={[styles.value, { color: theme.colors.primaryText }]}>
              {todayMinutes} / {dailyGoalMinutes}m
            </Text>
          </View>
          <ProgressBar progress={timeProgress} height={6} color={theme.colors.success} />
        </View>
      </View>
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <View style={styles.footerItem}>
          <CheckCircle size={14} color={theme.colors.success} />
          <Text style={[styles.footerText, { color: theme.colors.secondaryText }]}>
            {todayLessons} lessons done
          </Text>
        </View>
        <Text style={[styles.footerText, { color: theme.colors.tertiaryText }]}>
          {remaining > 0 ? `${remaining} remaining` : 'Goal complete!'}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  progressRow: {
    gap: spacing.md,
  },
  progressItem: {
    gap: spacing.xs,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  value: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
