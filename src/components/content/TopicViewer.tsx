import { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { BookOpen, Code2, Lightbulb, AlertTriangle, RotateCcw, HelpCircle, Library, BarChart2 } from 'lucide-react-native';
import { MarkdownRenderer } from './MarkdownRenderer';
import { QuizRenderer } from './QuizRenderer';
import { ResourceList } from './ResourceList';
import { CodeBlock } from './CodeBlock';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';
import type { TopicContent } from '../../content/types';

type Tab = 'theory' | 'patterns' | 'code' | 'tips' | 'mistakes' | 'revision' | 'quiz' | 'resources';

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
  { key: 'theory', label: 'Theory', icon: BookOpen },
  { key: 'patterns', label: 'Patterns', icon: BarChart2 },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'tips', label: 'Tips', icon: Lightbulb },
  { key: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
  { key: 'revision', label: 'Revision', icon: RotateCcw },
  { key: 'quiz', label: 'Quiz', icon: HelpCircle },
  { key: 'resources', label: 'Resources', icon: Library },
];

interface Props {
  content: TopicContent;
  loading?: boolean;
}

export function TopicViewer({ content, loading }: Props) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<Tab>('theory');

  const renderContent = useCallback(() => {
    switch (tab) {
      case 'theory': return <MarkdownRenderer content={content.theory} />;
      case 'patterns': return <View style={{ gap: spacing.md }}><MarkdownRenderer content={content.patterns} />{content.examples ? <MarkdownRenderer content={content.examples} /> : null}</View>;
      case 'code': return content.codeExamples?.length ? <CodeBlock examples={content.codeExamples} /> : <Text style={{ color: theme.colors.tertiaryText }}>No code examples.</Text>;
      case 'tips': return <MarkdownRenderer content={content.interviewTips} />;
      case 'mistakes': return <MarkdownRenderer content={content.commonMistakes} />;
      case 'revision': return <MarkdownRenderer content={content.revision} />;
      case 'quiz': return <QuizRenderer quiz={content.quiz ?? []} />;
      case 'resources': return <ResourceList resources={content.resources ?? []} />;
    }
  }, [tab, content, theme]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadText, { color: theme.colors.secondaryText }]}>Loading content…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabBar, { borderBottomColor: theme.colors.border }]} contentContainerStyle={styles.tabBarInner}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, { borderBottomColor: active ? theme.colors.primary : 'transparent', backgroundColor: active ? theme.colors.primary + '10' : 'transparent' }]}>
              <Icon size={13} color={active ? theme.colors.primary : theme.colors.tertiaryText} />
              <Text style={[styles.tabText, { color: active ? theme.colors.primary : theme.colors.tertiaryText }]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView key={tab} style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadText: { fontSize: typography.fontSize.md },
  tabBar: { maxHeight: 48, borderBottomWidth: StyleSheet.hairlineWidth },
  tabBarInner: { paddingHorizontal: spacing.xs, alignItems: 'stretch' },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 2, borderRadius: 6, marginHorizontal: 2 },
  tabText: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
});
