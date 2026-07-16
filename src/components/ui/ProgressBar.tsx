import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius } from '../../theme/tokens';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  rounded?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  trackColor,
  rounded = true,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const fill = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? theme.colors.border,
          borderRadius: rounded ? height / 2 : radius.sm,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${fill * 100}%`,
            backgroundColor: color ?? theme.colors.primary,
            borderRadius: rounded ? height / 2 : radius.sm,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
