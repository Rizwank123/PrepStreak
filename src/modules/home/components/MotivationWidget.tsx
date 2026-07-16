import { StyleSheet, Text, View } from 'react-native';
import { Quote } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';

const MOTIVATIONS = [
  'Consistency beats intensity. Show up every day.',
  'Every expert was once a beginner who refused to give up.',
  'The only way to learn is to practice. Start today.',
  'Small steps every day lead to big results.',
  'Progress, not perfection.',
  'Success is the sum of small efforts repeated daily.',
  'You don\'t have to be great to start, but you have to start to be great.',
  'The best time to start was yesterday. The next best time is now.',
  'Don\'t count the days, make the days count.',
  'Your future self is built by what you do today.',
];

function getTodayMotivation(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length];
}

export function MotivationWidget() {
  const { theme } = useTheme();
  const motivation = getTodayMotivation();

  return (
    <Card
      elevated
      style={[styles.card, { backgroundColor: theme.colors.primary + '08' }] as any}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
        <Quote size={16} color={theme.colors.primary} />
      </View>
      <Text style={[styles.quote, { color: theme.colors.primaryText }]}>
        "{motivation}"
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quote: {
    fontSize: typography.fontSize.md,
    fontStyle: 'italic',
    lineHeight: typography.fontSize.md * 1.4,
  },
});
