import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: (accentColor ?? theme.colors.primary) + '18' },
          ]}
        >
          {icon}
        </View>
      )}
      <Text
        style={[
          styles.value,
          { color: theme.colors.primaryText },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          { color: theme.colors.secondaryText },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
