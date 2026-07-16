import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.border + '40' },
          ]}
        >
          {icon}
        </View>
      )}
      <Text style={[styles.title, { color: theme.colors.primaryText }]}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[styles.subtitle, { color: theme.colors.secondaryText }]}
        >
          {subtitle}
        </Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  paddingHorizontal: spacing.xl,
  maxWidth: 300,
  flexWrap: 'wrap',
  flexShrink: 1,
  width: '100%',
  },
  action: {
    marginTop: spacing.md,
  },
});
