import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, fontSize: typography.fontSize.sm },
    md: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, fontSize: typography.fontSize.md },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: typography.fontSize.lg },
  }[size];

  const variantStyles = {
    primary: { backgroundColor: theme.colors.primary, color: '#ffffff' },
    secondary: { backgroundColor: theme.colors.border + '40', color: theme.colors.primaryText },
    ghost: { backgroundColor: 'transparent', color: theme.colors.primary },
    danger: { backgroundColor: theme.colors.error, color: '#ffffff' },
  }[variant];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: pressed ? 0.8 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ] as any}
      {...props}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: variantStyles.color, fontSize: sizeStyles.fontSize },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: typography.fontWeight.semibold,
  },
});
