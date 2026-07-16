import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

interface BarChartProps {
  data: { label: string; value: number; highlight?: boolean }[];
  maxValue?: number;
  height?: number;
  barColor?: string;
  highlightColor?: string;
}

export function BarChart({
  data,
  maxValue,
  height = 120,
  barColor,
  highlightColor,
}: BarChartProps) {
  const { theme } = useTheme();
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const fill = barColor ?? theme.colors.primary;
  const highlight = highlightColor ?? theme.colors.streak;

  return (
    <View style={styles.container}>
      <View style={[styles.bars, { height }]}>
        {data.map((item, i) => {
          const barHeight = max > 0 ? (item.value / max) * (height - 24) : 0;
          const color = item.highlight ? highlight : fill;
          return (
            <View key={i} style={styles.barWrap}>
              <View style={[styles.track, { height: height - 24 }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, item.value > 0 ? 4 : 0),
                      backgroundColor: item.value > 0 ? color : theme.colors.border + '30',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: item.highlight ? theme.colors.primaryText : theme.colors.tertiaryText },
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  track: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: radius.sm,
    minHeight: 2,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
});
