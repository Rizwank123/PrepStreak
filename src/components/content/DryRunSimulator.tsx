import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, FastForward } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';
import type { DryRun } from '../../content/types';

interface Props {
  dryRun: DryRun;
}

export function DryRunSimulator({ dryRun }: Props) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const totalSteps = dryRun.steps.length;
  const current = dryRun.steps[step];

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(next, 1500);
    return () => clearTimeout(timer);
  }, [playing, step, totalSteps, next]);

  const isLast = step === totalSteps - 1;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          Dry Run Simulation
        </Text>
        <View style={[styles.inputBadge, { backgroundColor: theme.colors.primary + '15' }]}>
          <Text style={[styles.inputText, { color: theme.colors.primary }]}>
            Input: {dryRun.input}
          </Text>
        </View>
      </View>

      <View style={[styles.dataBox, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        <Text style={[styles.dataLabel, { color: theme.colors.tertiaryText }]}>Data Structure State</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dataScroll}>
          <Text style={[styles.dataState, { color: theme.colors.primaryText }]}>
            {current?.dataState ?? ''}
          </Text>
        </ScrollView>
      </View>

      {current && (
        <View style={[styles.stepBox, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.lineBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.lineBadgeText}>Line {current.line}</Text>
            </View>
            <Text style={[styles.stepCount, { color: theme.colors.tertiaryText }]}>
              Step {step + 1} / {totalSteps}
            </Text>
          </View>
          <Text style={[styles.stepDesc, { color: theme.colors.secondaryText }]}>
            {current.description}
          </Text>

          {current.variables.length > 0 && (
            <View style={styles.varGrid}>
              {current.variables.map((v, i) => (
                <View key={i} style={[styles.varChip, { backgroundColor: theme.colors.border + '40' }]}>
                  <Text style={[styles.varName, { color: theme.colors.tertiaryText }]}>{v.name}</Text>
                  <Text style={[styles.varValue, { color: theme.colors.primaryText }]}>{v.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={[styles.controls, { borderTopColor: theme.colors.border }]}>
        <Pressable onPress={prev} disabled={step === 0} style={({ pressed }) => [{ opacity: step === 0 ? 0.3 : pressed ? 0.5 : 1 }]}>
          <ChevronLeft size={22} color={theme.colors.primary} />
        </Pressable>

        <Pressable
          onPress={() => (isLast ? reset() : setPlaying(!playing))}
          style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
        >
          {isLast ? (
            <>
              <RotateCcw size={18} color="#fff" />
              <Text style={styles.playText}>Replay</Text>
            </>
          ) : playing ? (
            <>
              <Pause size={18} color="#fff" />
              <Text style={styles.playText}>Pause</Text>
            </>
          ) : (
            <>
              <Play size={18} color="#fff" fill="#fff" />
              <Text style={styles.playText}>Play</Text>
            </>
          )}
        </Pressable>

        <Pressable onPress={next} disabled={isLast} style={({ pressed }) => [{ opacity: isLast ? 0.3 : pressed ? 0.5 : 1 }]}>
          <ChevronRight size={22} color={theme.colors.primary} />
        </Pressable>
      </View>

      <Pressable
        onPress={next}
        disabled={isLast}
        style={({ pressed }) => [{ opacity: isLast ? 0.3 : pressed ? 0.5 : 1 }]}
      >
        <View style={[styles.skipBtn, { borderColor: theme.colors.border }]}>
          <FastForward size={14} color={theme.colors.tertiaryText} />
          <Text style={[styles.skipText, { color: theme.colors.tertiaryText }]}>Skip to end</Text>
        </View>
      </Pressable>

      {isLast && (
        <View style={[styles.resultBox, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}>
          <Text style={[styles.resultLabel, { color: theme.colors.success }]}>Result</Text>
          <Text style={[styles.resultText, { color: theme.colors.primaryText }]}>
            {dryRun.result}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: typography.fontSize.lg, fontWeight: '700' },
  inputBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6 },
  inputText: { fontSize: typography.fontSize.xs, fontWeight: '600', fontFamily: 'monospace' },
  dataBox: { borderRadius: 10, borderWidth: 1, padding: spacing.md, gap: spacing.xs },
  dataLabel: { fontSize: typography.fontSize.xs, fontWeight: '600', textTransform: 'uppercase' },
  dataScroll: { maxHeight: 60 },
  dataState: { fontFamily: 'monospace', fontSize: 13, lineHeight: 20 },
  stepBox: { borderRadius: 10, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4 },
  lineBadgeText: { fontSize: typography.fontSize.xs, fontWeight: '700', color: '#fff' },
  stepCount: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  stepDesc: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },
  varGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  varChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6, gap: 2 },
  varName: { fontSize: 11, fontWeight: '600', fontFamily: 'monospace' },
  varValue: { fontSize: typography.fontSize.sm, fontWeight: '700', fontFamily: 'monospace' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 20 },
  playText: { color: '#fff', fontSize: typography.fontSize.sm, fontWeight: '700' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.xs, borderWidth: 1, borderRadius: 6, alignSelf: 'center', paddingHorizontal: spacing.md },
  skipText: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  resultBox: { borderRadius: 10, borderWidth: 1.5, padding: spacing.md, gap: spacing.xs },
  resultLabel: { fontSize: typography.fontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  resultText: { fontSize: typography.fontSize.md, fontFamily: 'monospace', fontWeight: '600' },
});
