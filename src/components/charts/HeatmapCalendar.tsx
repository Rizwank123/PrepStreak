import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export interface HeatmapDay {
  date: string;
  intensity: number;
  value: number;
}

interface HeatmapCalendarProps {
  days: HeatmapDay[];
  weeks?: number;
}

const intensityColors = (theme: { colors: { border: string; streak: string } }) => [
  theme.colors.border + '30',
  theme.colors.streak + '30',
  theme.colors.streak + '60',
  theme.colors.streak + '90',
  theme.colors.streak,
];

export function HeatmapCalendar({ days }: HeatmapCalendarProps) {
  const { theme } = useTheme();
  const colors = intensityColors(theme);
  const cellSize = 14;
  const gap = 3;

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.column}>
            {week.map((day, di) => (
              <View
                key={di}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: colors[day.intensity] ?? colors[0],
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.colors.tertiaryText }]}>Less</Text>
        {colors.map((c, i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: c, width: 12, height: 12 }]} />
        ))}
        <Text style={[styles.legendText, { color: theme.colors.tertiaryText }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
    flexWrap: 'wrap',
  },
  column: {
    gap: 3,
  },
  cell: {
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
    justifyContent: 'flex-end',
  },
  legendCell: {
    borderRadius: 3,
  },
  legendText: {
    fontSize: typography.fontSize.xs,
  },
});
