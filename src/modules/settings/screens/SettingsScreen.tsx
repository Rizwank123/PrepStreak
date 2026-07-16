import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Sun, Moon, Monitor, Bell, Target, Palette, FileDown, FileUp, Trash2, ChevronRight, Type, Sparkles } from 'lucide-react-native';
import { cacheDirectory, writeAsStringAsync, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { useSettingsStore } from '../../../store/settingsStore';
import { useProgressStore } from '../../../store/progressStore';
import { resetDatabase, getDatabase } from '../../../database/db';
import type { ThemeMode } from '../../../theme/types';

export function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const settings = useSettingsStore();
  const progress = useProgressStore();

  const handleExport = useCallback(async () => {
    try {
      const db = await getDatabase();
      const tables = ['roadmaps', 'modules', 'topics', 'lessons', 'questions', 'bookmarks', 'notes', 'progress', 'revision_schedule', 'study_logs', 'achievements', 'xp_history', 'daily_statistics', 'calendar', 'goals', 'quiz_results'];
      const exportData: Record<string, unknown> = { _meta: { version: 1, exported_at: new Date().toISOString() } };
      for (const table of tables) {
        const rows = await db.getAllAsync(`SELECT * FROM ${table};`);
        exportData[table] = rows;
      }
      const json = JSON.stringify(exportData, null, 2);
      const fileUri = `${cacheDirectory}prepstreak-backup-${Date.now()}.json`;
      await writeAsStringAsync(fileUri, json, { encoding: EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Export PrepStreak Data' });
      } else {
        Alert.alert('Export', `Backup saved to ${fileUri}`);
      }
    } catch (e) {
      Alert.alert('Export Failed', String(e));
    }
  }, []);

  const handleImport = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.length) return;
      const fileUri = result.assets[0].uri;
      const content = await readAsStringAsync(fileUri, { encoding: EncodingType.UTF8 });
      const data = JSON.parse(content);
      const db = await getDatabase();
      const tables = ['roadmaps', 'modules', 'topics', 'lessons', 'questions', 'bookmarks', 'notes', 'progress', 'revision_schedule', 'study_logs', 'achievements', 'xp_history', 'daily_statistics', 'calendar', 'goals', 'quiz_results'];
      for (const table of tables) {
        if (!data[table]) continue;
        await db.runAsync(`DELETE FROM ${table};`);
        for (const row of data[table]) {
          const keys = Object.keys(row);
          const placeholders = keys.map(() => '?').join(', ');
          const values = keys.map((k) => row[k]);
          await db.runAsync(
            `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders});`,
            values,
          );
        }
      }
      await progress.load();
      Alert.alert('Import Complete', 'Your data has been restored successfully.');
    } catch (e) {
      Alert.alert('Import Failed', String(e));
    }
  }, [progress]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset All Progress',
      'This will permanently delete all your progress, XP, streaks, and study data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetDatabase();
            settings.reset();
            await progress.load();
            Alert.alert('Reset Complete', 'All progress has been cleared.');
          },
        },
      ],
    );
  }, [settings, progress]);

  return (
    <>
      <ScreenHeader title="Settings" subtitle="Customize your experience" />
      <ScreenContainer>
        <SettingsSection title="Appearance">
          <SettingsRow
            icon={<Palette size={18} color={theme.colors.primary} />}
            label="Theme"
            right={
              <View style={styles.themeToggle}>
                {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor: mode === m ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {m === 'light' && <Sun size={14} color={mode === m ? '#fff' : theme.colors.secondaryText} />}
                    {m === 'dark' && <Moon size={14} color={mode === m ? '#fff' : theme.colors.secondaryText} />}
                    {m === 'system' && <Monitor size={14} color={mode === m ? '#fff' : theme.colors.secondaryText} />}
                    <Text style={[styles.themeText, { color: mode === m ? '#fff' : theme.colors.secondaryText }]}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
          />
          <SettingsRow
            icon={<Type size={18} color={theme.colors.primary} />}
            label="Font Size"
            right={
              <View style={styles.themeToggle}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Pressable
                    key={size}
                    onPress={() => settings.setFontSize(size)}
                    style={[
                      styles.themeButton,
                      { backgroundColor: settings.fontSize === size ? theme.colors.primary : 'transparent' },
                    ]}
                  >
                    <Text style={[styles.themeText, { color: settings.fontSize === size ? '#fff' : theme.colors.secondaryText }]}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
          />
          <SettingsRow
            icon={<Sparkles size={18} color={theme.colors.primary} />}
            label="Animations"
            right={<ToggleSwitch value={settings.animationsEnabled} onToggle={() => settings.setAnimationsEnabled(!settings.animationsEnabled)} />}
          />
        </SettingsSection>

        <SettingsSection title="Goals">
          <SettingsRow
            icon={<Target size={18} color={theme.colors.primary} />}
            label="Daily Questions Goal"
            value={`${settings.dailyGoalQuestions} questions`}
            right={<Stepper value={settings.dailyGoalQuestions} onDecrement={() => settings.setDailyGoalQuestions(Math.max(1, settings.dailyGoalQuestions - 1))} onIncrement={() => settings.setDailyGoalQuestions(Math.min(50, settings.dailyGoalQuestions + 1))} />}
          />
          <SettingsRow
            icon={<Target size={18} color={theme.colors.primary} />}
            label="Daily Study Time"
            value={`${settings.dailyGoalMinutes} min`}
            right={<Stepper value={settings.dailyGoalMinutes} step={15} onDecrement={() => settings.setDailyGoalMinutes(Math.max(15, settings.dailyGoalMinutes - 15))} onIncrement={() => settings.setDailyGoalMinutes(Math.min(480, settings.dailyGoalMinutes + 15))} />}
          />
        </SettingsSection>

        <SettingsSection title="Reminders">
          <SettingsRow
            icon={<Bell size={18} color={theme.colors.primary} />}
            label="Study Reminders"
            right={<ToggleSwitch value={settings.reminderEnabled} onToggle={() => settings.setReminderEnabled(!settings.reminderEnabled)} />}
          />
        </SettingsSection>

        <SettingsSection title="Data">
          <PressableRow icon={<FileDown size={18} color={theme.colors.success} />} label="Export Data" subtitle="Backup all your progress" onPress={handleExport} />
          <PressableRow icon={<FileUp size={18} color={theme.colors.primary} />} label="Import Data" subtitle="Restore from a backup" onPress={handleImport} />
          <PressableRow icon={<Trash2 size={18} color={theme.colors.error} />} label="Reset Progress" subtitle="Delete all data" onPress={handleReset} danger />
        </SettingsSection>

        <Text style={[styles.version, { color: theme.colors.tertiaryText }]}>
          PrepStreak v1.0.0
        </Text>
      </ScreenContainer>
    </>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.tertiaryText }]}>
        {title.toUpperCase()}
      </Text>
      <Card style={styles.sectionCard}>
        {children}
      </Card>
    </View>
  );
}

function SettingsRow({ icon, label, value, right }: { icon: React.ReactNode; label: string; value?: string; right?: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, { color: theme.colors.primaryText }]}>{label}</Text>
      </View>
      {value && <Text style={[styles.rowValue, { color: theme.colors.secondaryText }]}>{value}</Text>}
      {right}
    </View>
  );
}

function PressableRow({ icon, label, subtitle, onPress, danger }: { icon: React.ReactNode; label: string; subtitle: string; onPress: () => void; danger?: boolean }) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          {icon}
          <View>
            <Text style={[styles.rowLabel, { color: danger ? theme.colors.error : theme.colors.primaryText }]}>{label}</Text>
            <Text style={[styles.rowSubtitle, { color: theme.colors.tertiaryText }]}>{subtitle}</Text>
          </View>
        </View>
        <ChevronRight size={18} color={theme.colors.tertiaryText} />
      </View>
    </Pressable>
  );
}

function ToggleSwitch({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onToggle} style={[styles.toggle, { backgroundColor: value ? theme.colors.primary : theme.colors.border }]}>
      <View style={[styles.toggleKnob, { backgroundColor: '#fff', transform: [{ translateX: value ? 20 : 0 }] }]} />
    </Pressable>
  );
}

function Stepper({ value, onDecrement, onIncrement, step = 1 }: { value: number; onDecrement: () => void; onIncrement: () => void; step?: number }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.stepper, { backgroundColor: theme.colors.border + '30' }]}>
      <Pressable onPress={onDecrement} style={styles.stepperBtn}>
        <Text style={[styles.stepperText, { color: theme.colors.primaryText }]}>-</Text>
      </Pressable>
      <Text style={[styles.stepperValue, { color: theme.colors.primaryText }]}>{value}</Text>
      <Pressable onPress={onIncrement} style={styles.stepperBtn}>
        <Text style={[styles.stepperText, { color: theme.colors.primaryText }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  sectionCard: {
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  rowValue: {
    fontSize: typography.fontSize.sm,
  },
  rowSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  themeToggle: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  themeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    gap: 0,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  stepperValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    minWidth: 30,
    textAlign: 'center',
  },
  version: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
