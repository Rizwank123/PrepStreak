import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { BarChart } from '../../../components/charts/BarChart';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { studyLogRepository } from '../../../repository';
import type { StudyLog } from '../../../types';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function WeeklyGraphWidget() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<StudyLog[]>([]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      const startDate = start.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      const range = await studyLogRepository.getRange(startDate, endDate);

      const dayMap = new Map(range.map((l) => [l.date, l]));
      const data: { label: string; value: number; highlight?: boolean }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = dayMap.get(dateStr);
        const isToday = i === 0;
        data.push({
          label: DAY_LABELS[d.getDay()],
          value: log?.minutes_studied ?? 0,
          highlight: isToday,
        });
      }
      setLogs(data as unknown as StudyLog[]);
    })();
  }, []);

  const chartData = (logs as unknown as { label: string; value: number; highlight?: boolean }[]).length > 0
    ? (logs as unknown as { label: string; value: number; highlight?: boolean }[])
    : Array.from({ length: 7 }, (_, i) => ({ label: DAY_LABELS[(new Date().getDay() - 6 + i + 7) % 7], value: 0 }));

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          This Week
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
          Minutes studied
        </Text>
      </View>
      <BarChart data={chartData} height={100} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
});
