import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';
import type { Difficulty } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const difficultyConfig: Record<Difficulty, { bg: string; text: string }> = {
  beginner: { bg: '#16a34a20', text: '#16a34a' },
  intermediate: { bg: '#f59e0b20', text: '#f59e0b' },
  advanced: { bg: '#dc262620', text: '#dc2626' },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { theme } = useTheme();
  const config = difficultyConfig[difficulty];

  return (
    <Text
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          color: config.text,
        },
      ]}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Text>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const { theme } = useTheme();
  const config: Record<string, { bg: string; text: string; label: string }> = {
    not_started: { bg: theme.colors.border + '40', text: theme.colors.secondaryText, label: 'Not Started' },
    in_progress: { bg: '#f59e0b20', text: '#f59e0b', label: 'In Progress' },
    solved: { bg: '#16a34a20', text: '#16a34a', label: 'Solved' },
    reviewing: { bg: '#8b5cf620', text: '#8b5cf6', label: 'Reviewing' },
  };
  const c = config[status] ?? config.not_started;

  return (
    <Text style={[styles.badge, { backgroundColor: c.bg, color: c.text }]}>
      {c.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
