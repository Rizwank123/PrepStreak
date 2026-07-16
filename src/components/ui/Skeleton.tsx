import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing } from '../../theme/tokens';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  rounded?: keyof typeof radius;
}

export function Skeleton({ width = '100%', height = 20, rounded = 'md' }: SkeletonProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          backgroundColor: theme.colors.border,
          borderRadius: radius[rounded],
        },
      ]}
    />
  );
}

export function SkeletonCard() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Skeleton width="60%" height={16} />
      <View style={styles.gap} />
      <Skeleton width="100%" height={12} />
      <View style={styles.smallGap} />
      <Skeleton width="80%" height={12} />
      <View style={styles.gap} />
      <Skeleton width="40%" height={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    opacity: 0.4,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  gap: {
    height: spacing.md,
  },
  smallGap: {
    height: spacing.xs,
  },
});
