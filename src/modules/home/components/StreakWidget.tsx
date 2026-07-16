import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { useProgressStore } from '../../../store/progressStore';

export function StreakWidget() {
  const { theme } = useTheme();
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);

  return (
    <Card elevated style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.streak + '18' }]}>
          <Flame size={28} color={theme.colors.streak} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.streakNumber, { color: theme.colors.primaryText }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.colors.secondaryText }]}>
            {currentStreak === 1 ? 'Day Streak' : 'Day Streak'}
          </Text>
        </View>
        <View style={styles.best}>
          <Text style={[styles.bestLabel, { color: theme.colors.tertiaryText }]}>Best</Text>
          <Text style={[styles.bestValue, { color: theme.colors.secondaryText }]}>
            {longestStreak}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  streakNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  streakLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  best: {
    alignItems: 'flex-end',
  },
  bestLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  bestValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
