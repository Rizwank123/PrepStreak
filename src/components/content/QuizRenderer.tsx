import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';
import type { QuizQuestion } from '../../content/types';

interface Props {
  quiz: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

interface State {
  idx: number;
  chosen: number | null;
  score: number;
  answers: (number | null)[];
  done: boolean;
}

export function QuizRenderer({ quiz, onComplete }: Props) {
  const { theme } = useTheme();
  const [s, setS] = useState<State>({ idx: 0, chosen: null, score: 0, answers: new Array(quiz.length).fill(null), done: false });

  if (quiz.length === 0) return (
    <View style={styles.empty}>
      <Text style={{ color: theme.colors.tertiaryText }}>No quiz questions yet.</Text>
    </View>
  );

  if (s.done) {
    const pct = Math.round((s.score / quiz.length) * 100);
    const colour = pct >= 80 ? theme.colors.success : pct >= 50 ? theme.colors.warning : theme.colors.error;
    return (
      <View style={styles.result}>
        <Text style={[styles.resultTitle, { color: theme.colors.primaryText }]}>Quiz Complete!</Text>
        <Text style={[styles.resultScore, { color: colour }]}>{s.score}/{quiz.length} — {pct}%</Text>
        <Text style={[styles.resultMsg, { color: theme.colors.secondaryText }]}>
          {pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good effort — review missed questions.' : 'Keep practising!'}
        </Text>
        {quiz.map((q, i) => (
          <View key={q.id} style={[styles.reviewRow, { borderLeftColor: s.answers[i] === q.correctIndex ? theme.colors.success : theme.colors.error }]}>
            <Text style={[styles.reviewQ, { color: theme.colors.primaryText }]}>{i + 1}. {q.question}</Text>
            <Text style={[styles.reviewA, { color: theme.colors.tertiaryText }]}>✓ {q.options[q.correctIndex]}</Text>
          </View>
        ))}
        <Pressable style={[styles.btn, { backgroundColor: theme.colors.primary }]} onPress={() => setS({ idx: 0, chosen: null, score: 0, answers: new Array(quiz.length).fill(null), done: false })}>
          <Text style={styles.btnText}>Retry Quiz</Text>
        </Pressable>
      </View>
    );
  }

  const current = quiz[s.idx];
  const answered = s.chosen !== null;

  const pick = (i: number) => {
    if (answered) return;
    const correct = i === current.correctIndex;
    const newAnswers = [...s.answers];
    newAnswers[s.idx] = i;
    setS((prev) => ({ ...prev, chosen: i, score: correct ? prev.score + 1 : prev.score, answers: newAnswers }));
  };

  const next = () => {
    if (s.idx === quiz.length - 1) {
      onComplete?.(s.score, quiz.length);
      setS((prev) => ({ ...prev, done: true }));
    } else {
      setS((prev) => ({ ...prev, idx: prev.idx + 1, chosen: null }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Text style={[styles.progressText, { color: theme.colors.tertiaryText }]}>{s.idx + 1}/{quiz.length}</Text>
        <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.fill, { backgroundColor: theme.colors.primary, width: `${((s.idx + 1) / quiz.length) * 100}%` }]} />
        </View>
      </View>
      <Text style={[styles.question, { color: theme.colors.primaryText }]}>{current.question}</Text>
      <View style={styles.options}>
        {current.options.map((opt, i) => {
          let bg = theme.colors.surface, border = theme.colors.border, textCol = theme.colors.primaryText;
          if (answered) {
            if (i === current.correctIndex) { bg = theme.colors.success + '18'; border = theme.colors.success; textCol = theme.colors.success; }
            else if (i === s.chosen) { bg = theme.colors.error + '18'; border = theme.colors.error; textCol = theme.colors.error; }
          }
          return (
            <Pressable key={i} onPress={() => pick(i)} style={({ pressed }) => [styles.option, { backgroundColor: bg, borderColor: border, opacity: pressed && !answered ? 0.7 : 1 }]}>
              <View style={[styles.letter, { backgroundColor: border + '20' }]}>
                <Text style={[styles.letterText, { color: border }]}>{String.fromCharCode(65 + i)}</Text>
              </View>
              <Text style={[styles.optText, { color: textCol }]}>{opt}</Text>
              {answered && i === current.correctIndex && <CheckCircle size={16} color={theme.colors.success} />}
              {answered && i === s.chosen && i !== current.correctIndex && <XCircle size={16} color={theme.colors.error} />}
            </Pressable>
          );
        })}
      </View>
      {answered && (
        <View style={[styles.explanation, { backgroundColor: theme.colors.primary + '08', borderColor: theme.colors.primary + '30' }]}>
          <Text style={[styles.explTitle, { color: theme.colors.primary }]}>Explanation</Text>
          <Text style={[styles.explText, { color: theme.colors.secondaryText }]}>{current.explanation}</Text>
        </View>
      )}
      {answered && (
        <Pressable style={[styles.btn, { backgroundColor: theme.colors.primary }]} onPress={next}>
          <Text style={styles.btnText}>{s.idx === quiz.length - 1 ? 'See Results' : 'Next Question'}</Text>
          <ChevronRight size={16} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  empty: { padding: spacing.xl, alignItems: 'center' },
  progress: { gap: spacing.xs },
  progressText: { fontSize: typography.fontSize.xs, fontWeight: '600', textAlign: 'right' },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  question: { fontSize: typography.fontSize.lg, fontWeight: '600', lineHeight: typography.fontSize.lg * 1.4 },
  options: { gap: spacing.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: 12, borderWidth: 1.5 },
  letter: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  letterText: { fontSize: typography.fontSize.sm, fontWeight: '700' },
  optText: { flex: 1, fontSize: typography.fontSize.md },
  explanation: { padding: spacing.md, borderRadius: 12, borderWidth: 1, gap: spacing.xs },
  explTitle: { fontSize: typography.fontSize.sm, fontWeight: '700' },
  explText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },
  btn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: 12 },
  btnText: { color: '#fff', fontSize: typography.fontSize.md, fontWeight: '600' },
  result: { gap: spacing.md, alignItems: 'center' },
  resultTitle: { fontSize: typography.fontSize.xl, fontWeight: '700' },
  resultScore: { fontSize: typography.fontSize.display, fontWeight: '700' },
  resultMsg: { fontSize: typography.fontSize.md, textAlign: 'center' },
  reviewRow: { width: '100%', borderLeftWidth: 3, paddingLeft: spacing.md, paddingVertical: spacing.xs, gap: 2 },
  reviewQ: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  reviewA: { fontSize: typography.fontSize.xs },
});
