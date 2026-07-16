import { StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { CircularProgress } from '../../../components/ui/CircularProgress';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { useProgressStore } from '../../../store/progressStore';

export function XpWidget() {
  const { theme } = useTheme();
  const { level, currentLevelXp, nextLevelXp, progressInLevel, xpToNextLevel } =
    useProgressStore();

  return (
    <Card elevated style={styles.card}>
      <View style={styles.row}>
        <CircularProgress
          progress={progressInLevel}
          size={80}
          strokeWidth={8}
          color={theme.colors.xp}
        >
          <View style={styles.levelInner}>
            <Zap size={16} color={theme.colors.xp} />
            <Text style={[styles.levelNumber, { color: theme.colors.primaryText }]}>
              {level}
            </Text>
          </View>
        </CircularProgress>
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.colors.primaryText }]}>
            Level {level}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            {currentLevelXp} / {nextLevelXp} XP
          </Text>
          <Text style={[styles.remaining, { color: theme.colors.xp }]}>
            {xpToNextLevel} XP to Level {level + 1}
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
    gap: spacing.lg,
  },
  levelInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  marginTop: -2,
  lineHeight: 20,
  textAlign: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 8,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
  },
  remaining: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 2,
  },
});
