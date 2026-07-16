import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, BookOpen, List, ChevronRight, ExternalLink, Code2, Lightbulb, FileText, Play, CheckCircle2, Circle } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { topicRepository } from '../../../repository';
import { loadTopicContent } from '../../../services/content/ContentLoader';
import { getContentSlug } from '../../../services/content/topicContentMap';
import { TopicViewer } from '../../../components/content/TopicViewer';
import { DryRunSimulator } from '../../../components/content/DryRunSimulator';
import { CodeBlock } from '../../../components/content/CodeBlock';
import { DifficultyBadge } from '../../../components/ui/Badges';
import { Card } from '../../../components/ui/Card';
import { useProgressStore } from '../../../store/progressStore';
import { getStored, setStored } from '../../../storage/mmkv';
import type { Topic } from '../../../types';
import type { TopicContent, ContentQuestion } from '../../../content/types';

type Mode = 'content' | 'practice';

function toAppDifficulty(d: ContentQuestion['difficulty']): 'beginner' | 'intermediate' | 'advanced' {
  if (d === 'easy') return 'beginner';
  if (d === 'medium') return 'intermediate';
  return 'advanced';
}

export function ContentTopicScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('content');
  const [selectedQuestion, setSelectedQuestion] = useState<ContentQuestion | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const t = await topicRepository.getById(id);
      setTopic(t);
      if (t) {
        const slug = getContentSlug(t.title);
        if (slug) {
          const c = await loadTopicContent(slug);
          setContent(c);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const handleFavorite = async () => {
    if (!topic) return;
    await topicRepository.toggleFavorite(topic.id, topic.is_favorite);
    setTopic(await topicRepository.getById(topic.id));
  };

  const handleSelectQuestion = useCallback((q: ContentQuestion) => {
    setSelectedQuestion(q);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedQuestion(null);
  }, []);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <ArrowLeft size={24} color={theme.colors.primaryText} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
            {topic?.title ?? '…'}
          </Text>
          {topic && <DifficultyBadge difficulty={topic.difficulty} />}
        </View>
        {topic && (
          <Pressable onPress={handleFavorite} hitSlop={10} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Star size={22} color={theme.colors.streak} fill={topic.is_favorite ? theme.colors.streak : 'none'} />
          </Pressable>
        )}
      </View>

      {content && (
        <View style={[styles.modeSwitcher, { borderBottomColor: theme.colors.border }]}>
          {(['content', 'practice'] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <Pressable key={m} onPress={() => { setMode(m); setSelectedQuestion(null); }} style={[styles.modeBtn, { borderBottomColor: active ? theme.colors.primary : 'transparent' }]}>
                {m === 'content' ? <BookOpen size={14} color={active ? theme.colors.primary : theme.colors.tertiaryText} /> : <List size={14} color={active ? theme.colors.primary : theme.colors.tertiaryText} />}
                <Text style={[styles.modeBtnText, { color: active ? theme.colors.primary : theme.colors.tertiaryText }]}>
                  {m === 'content' ? 'Learn' : 'Practice'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {content && mode === 'content' ? (
        <TopicViewer content={content} />
      ) : content && mode === 'practice' ? (
        selectedQuestion ? (
          <QuestionDetailView question={selectedQuestion} onBack={handleBackToList} />
        ) : (
          <PracticeList questions={content.questions ?? []} onSelect={handleSelectQuestion} />
        )
      ) : (
        <View style={styles.noContent}>
          <Text style={[styles.noContentText, { color: theme.colors.secondaryText }]}>
            {content ? 'Practice questions coming soon.' : `Content for "${topic?.title}" is coming soon.`}
          </Text>
        </View>
      )}
    </View>
  );
}

function PracticeList({ questions, onSelect }: { questions: ContentQuestion[]; onSelect: (q: ContentQuestion) => void }) {
  const { theme } = useTheme();
  const solvedIds = getStored<string[]>('solved_content_questions', []);

  if (questions.length === 0) {
    return (
      <View style={styles.noContent}>
        <Text style={[styles.noContentText, { color: theme.colors.secondaryText }]}>
          No practice questions yet for this topic.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionHeading, { color: theme.colors.primaryText }]}>
        Practice Questions ({questions.length})
      </Text>
      <Text style={[styles.sectionSub, { color: theme.colors.tertiaryText }]}>
        Tap a question to view problem, code, and interactive dry-run simulation.
      </Text>
      <View style={{ gap: spacing.md, marginTop: spacing.md }}>
        {questions.map((q) => {
          const isSolved = solvedIds.includes(q.id);
          return (
          <Pressable key={q.id} onPress={() => onSelect(q)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Card style={styles.questionCard}>
              <View style={styles.questionRow}>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {isSolved && <CheckCircle2 size={16} color={theme.colors.success} />}
                    <Text style={[styles.questionTitle, { color: theme.colors.primaryText }]} numberOfLines={2}>
                      {q.title}
                    </Text>
                  </View>
                  <View style={styles.questionMeta}>
                    <DifficultyBadge difficulty={toAppDifficulty(q.difficulty)} />
                    <Text style={[styles.questionPattern, { color: theme.colors.tertiaryText }]}>{q.pattern}</Text>
                  </View>
                  <View style={styles.questionMetaRow}>
                    {q.dryRun && (
                      <View style={[styles.dryRunBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Play size={10} color={theme.colors.primary} fill={theme.colors.primary} />
                        <Text style={[styles.dryRunText, { color: theme.colors.primary }]}>Dry Run</Text>
                      </View>
                    )}
                    {q.codeExamples.length > 0 && (
                      <View style={[styles.codeBadge, { backgroundColor: theme.colors.border + '40' }]}>
                        <Code2 size={10} color={theme.colors.tertiaryText} />
                        <Text style={[styles.codeBadgeText, { color: theme.colors.tertiaryText }]}>{q.codeExamples.length} lang</Text>
                      </View>
                    )}
                    <Text style={[styles.companyCount, { color: theme.colors.tertiaryText }]}>
                      {q.companies.length} companies
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={theme.colors.tertiaryText} />
              </View>
            </Card>
          </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function QuestionDetailView({ question, onBack }: { question: ContentQuestion; onBack: () => void }) {
  const { theme } = useTheme();
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const recordQuestionSolved = useProgressStore((s) => s.recordQuestionSolved);

  const solvedKey = 'solved_content_questions';
  const getSolvedIds = (): string[] => getStored<string[]>(solvedKey, []);
  const [solved, setSolved] = useState(() => getSolvedIds().includes(question.id));

  const handleMarkSolved = async () => {
    if (solved) return;
    const ids = new Set(getSolvedIds());
    ids.add(question.id);
    setStored(solvedKey, [...ids]);
    setSolved(true);
    await recordQuestionSolved(question.id);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }, styles.backBtn]}>
        <ArrowLeft size={18} color={theme.colors.primary} />
        <Text style={[styles.backText, { color: theme.colors.primary }]}>Back to questions</Text>
      </Pressable>

      <Pressable
        onPress={handleMarkSolved}
        disabled={solved}
        style={[
          styles.solvedBtn,
          { backgroundColor: solved ? theme.colors.success + '20' : theme.colors.primary },
        ]}
      >
        {solved ? (
          <>
            <CheckCircle2 size={18} color={theme.colors.success} />
            <Text style={[styles.solvedBtnText, { color: theme.colors.success }]}>Solved</Text>
          </>
        ) : (
          <>
            <Circle size={18} color="#fff" />
            <Text style={styles.solvedBtnText}>Mark as Solved</Text>
          </>
        )}
      </Pressable>

      <View style={styles.titleSection}>
        <Text style={[styles.qTitle, { color: theme.colors.primaryText }]}>
          {question.title}
        </Text>
        <View style={styles.badgeRow}>
          <DifficultyBadge difficulty={toAppDifficulty(question.difficulty)} />
          <Text style={[styles.qPattern, { color: theme.colors.tertiaryText }]}>{question.pattern}</Text>
        </View>
      </View>

      {question.companies.length > 0 && (
        <View style={styles.companiesRow}>
          {question.companies.map((c, i) => (
            <View key={i} style={[styles.companyChip, { backgroundColor: theme.colors.border + '30' }]}>
              <Text style={[styles.companyText, { color: theme.colors.secondaryText }]}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>Problem</Text>
        <Text style={[styles.sectionContent, { color: theme.colors.secondaryText }]}>
          {question.problemStatement}
        </Text>
      </Card>

      {question.examples.length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>Examples</Text>
          {question.examples.map((ex, i) => (
            <View key={i} style={{ gap: spacing.xs, marginTop: i > 0 ? spacing.sm : 0 }}>
              <Text style={[styles.exampleLabel, { color: theme.colors.tertiaryText }]}>Example {i + 1}:</Text>
              <Text style={[styles.exampleText, { color: theme.colors.secondaryText }]}>Input: {ex.input}</Text>
              <Text style={[styles.exampleText, { color: theme.colors.secondaryText }]}>Output: {ex.output}</Text>
              {ex.explanation && <Text style={[styles.exampleText, { color: theme.colors.tertiaryText }]}>{ex.explanation}</Text>}
            </View>
          ))}
        </Card>
      )}

      {question.constraints.length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>Constraints</Text>
          {question.constraints.map((c, i) => (
            <Text key={i} style={[styles.constraintText, { color: theme.colors.secondaryText }]}>- {c}</Text>
          ))}
        </Card>
      )}

      {question.dryRun && (
        <View style={{ marginTop: spacing.sm }}>
          <DryRunSimulator dryRun={question.dryRun} />
        </View>
      )}

      {question.hints.length > 0 && (
        <Card style={styles.section}>
          <Pressable onPress={() => setShowHints(!showHints)} style={styles.sectionHeader}>
            <Lightbulb size={18} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText, flex: 1 }]}>Hints</Text>
            <Text style={[styles.toggleText, { color: theme.colors.primary }]}>{showHints ? 'Hide' : 'Show'}</Text>
          </Pressable>
          {showHints && (
            <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
              {question.hints.map((hint, i) => (
                <View key={i} style={styles.hintRow}>
                  <Text style={[styles.hintNumber, { color: theme.colors.warning }]}>{i + 1}.</Text>
                  <Text style={[styles.hintText, { color: theme.colors.secondaryText }]}>{hint}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      <Card style={styles.section}>
        <Pressable onPress={() => setShowSolution(!showSolution)} style={styles.sectionHeader}>
          <FileText size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText, flex: 1 }]}>Solutions</Text>
          <Text style={[styles.toggleText, { color: theme.colors.primary }]}>{showSolution ? 'Hide' : 'Show'}</Text>
        </Pressable>
        {showSolution && (
          <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
            <View>
              <Text style={[styles.solutionLabel, { color: theme.colors.tertiaryText }]}>Brute Force</Text>
              <Text style={[styles.solutionText, { color: theme.colors.secondaryText }]}>{question.bruteForce}</Text>
            </View>
            <View>
              <Text style={[styles.solutionLabel, { color: theme.colors.success }]}>Optimized</Text>
              <Text style={[styles.solutionText, { color: theme.colors.secondaryText }]}>{question.optimizedSolution}</Text>
            </View>
            <View style={styles.complexityRow}>
              <View style={[styles.complexityBox, { backgroundColor: theme.colors.border + '30' }]}>
                <Text style={[styles.complexityLabel, { color: theme.colors.tertiaryText }]}>Time</Text>
                <Text style={[styles.complexityValue, { color: theme.colors.primaryText }]}>{question.timeComplexity}</Text>
              </View>
              <View style={[styles.complexityBox, { backgroundColor: theme.colors.border + '30' }]}>
                <Text style={[styles.complexityLabel, { color: theme.colors.tertiaryText }]}>Space</Text>
                <Text style={[styles.complexityValue, { color: theme.colors.primaryText }]}>{question.spaceComplexity}</Text>
              </View>
            </View>
          </View>
        )}
      </Card>

      {question.codeExamples.length > 0 && (
        <View style={{ marginTop: spacing.sm }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText, marginBottom: spacing.sm }]}>
            Code Solutions
          </Text>
          <CodeBlock examples={question.codeExamples} />
        </View>
      )}

      {Object.keys(question.practiceUrls).length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>Practice Links</Text>
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {Object.entries(question.practiceUrls).map(([platform, url]) => (
              <Pressable key={platform} onPress={() => { if (typeof window !== 'undefined') window.open(url, '_blank'); }} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View style={[styles.linkRow, { backgroundColor: theme.colors.primary + '10' }]}>
                  <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                  <ExternalLink size={16} color={theme.colors.primary} />
                </View>
              </Pressable>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  headerCenter: { flex: 1, gap: spacing.xs },
  headerTitle: { fontSize: typography.fontSize.lg, fontWeight: '700' },
  modeSwitcher: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, borderBottomWidth: 2 },
  modeBtnText: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxxl },
  noContentText: { fontSize: typography.fontSize.md, textAlign: 'center' },
  // PracticeList
  sectionHeading: { fontSize: typography.fontSize.xl, fontWeight: '700' },
  sectionSub: { fontSize: typography.fontSize.sm, marginTop: spacing.xs },
  questionCard: { padding: spacing.md },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  questionTitle: { fontSize: typography.fontSize.md, fontWeight: '700' },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  questionPattern: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  questionMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  dryRunBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 4 },
  dryRunText: { fontSize: 10, fontWeight: '700' },
  codeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 4 },
  codeBadgeText: { fontSize: 10, fontWeight: '500' },
  companyCount: { fontSize: 10, fontWeight: '500' },
  // QuestionDetail
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  backText: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  solvedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
    marginTop: spacing.xs,
  },
  solvedBtnText: { color: '#fff', fontSize: typography.fontSize.md, fontWeight: '700' },
  titleSection: { gap: spacing.sm, marginBottom: spacing.md },
  qTitle: { fontSize: typography.fontSize.xxl, fontWeight: '700' },
  qPattern: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  companiesRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.md },
  companyChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6 },
  companyText: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  section: { padding: spacing.lg, gap: spacing.xs, marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: typography.fontSize.lg, fontWeight: '700' },
  sectionContent: { fontSize: typography.fontSize.md, lineHeight: typography.fontSize.md * 1.5, marginTop: spacing.xs },
  toggleText: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  exampleLabel: { fontSize: typography.fontSize.xs, fontWeight: '600' },
  exampleText: { fontSize: typography.fontSize.sm, fontFamily: 'monospace' },
  constraintText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },
  hintRow: { flexDirection: 'row', gap: spacing.sm },
  hintNumber: { fontSize: typography.fontSize.sm, fontWeight: '700' },
  hintText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5, flex: 1 },
  solutionLabel: { fontSize: typography.fontSize.xs, fontWeight: '600', marginBottom: 2 },
  solutionText: { fontSize: typography.fontSize.sm, lineHeight: typography.fontSize.sm * 1.5 },
  complexityRow: { flexDirection: 'row', gap: spacing.md },
  complexityBox: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center', gap: 2 },
  complexityLabel: { fontSize: typography.fontSize.xs, fontWeight: '500' },
  complexityValue: { fontSize: typography.fontSize.md, fontWeight: '700' },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderRadius: 8 },
  linkText: { fontSize: typography.fontSize.md, fontWeight: '600' },
});
