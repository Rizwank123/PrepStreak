import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, Star, CheckCircle, Lightbulb, Clock, ExternalLink, FileText, Code } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { DifficultyBadge, StatusBadge } from '../../../components/ui/Badges';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { questionRepository } from '../../../repository';
import { useProgressStore } from '../../../store/progressStore';
import type { Question } from '../../../types';

export function QuestionDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const recordQuestion = useProgressStore((s) => s.recordQuestionSolved);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const q = await questionRepository.getById(id);
      setQuestion(q);
    })();
  }, [id]);

  const handleMarkSolved = useCallback(async () => {
    if (!question) return;
    await recordQuestion(question.id);
    const updated = await questionRepository.getById(question.id);
    setQuestion(updated);
  }, [question, recordQuestion]);

  const handleToggleBookmark = useCallback(async () => {
    if (!question) return;
    await questionRepository.toggleBookmark(question.id, question.is_bookmarked);
    const updated = await questionRepository.getById(question.id);
    setQuestion(updated);
  }, [question]);

  const handleToggleFavorite = useCallback(async () => {
    if (!question) return;
    await questionRepository.toggleFavorite(question.id, question.is_favorite);
    const updated = await questionRepository.getById(question.id);
    setQuestion(updated);
  }, [question]);

  if (!question) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.secondaryText }}>Loading...</Text>
      </View>
    );
  }

  const hints: string[] = JSON.parse(question.hints || '[]');
  const companies: string[] = JSON.parse(question.companies || '[]');
  const tags: string[] = JSON.parse(question.tags || '[]');
  const practiceUrls: Record<string, string> = JSON.parse(question.practice_urls || '{}');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.colors.primaryText} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={handleToggleFavorite} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <Star size={22} color={theme.colors.streak} fill={question.is_favorite ? theme.colors.streak : 'none'} />
          </Pressable>
          <Pressable onPress={handleToggleBookmark} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <Bookmark size={22} color={theme.colors.primary} fill={question.is_bookmarked ? theme.colors.primary : 'none'} />
          </Pressable>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          {question.title}
        </Text>
        <View style={styles.badgeRow}>
          <DifficultyBadge difficulty={question.difficulty} />
          <StatusBadge status={question.status} />
          <View style={styles.platformBadge}>
            <Text style={[styles.platformText, { color: theme.colors.tertiaryText }]}>
              {question.platform}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Clock size={14} color={theme.colors.tertiaryText} />
          <Text style={[styles.metaText, { color: theme.colors.tertiaryText }]}>
            {question.estimated_time_minutes} min
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Code size={14} color={theme.colors.tertiaryText} />
          <Text style={[styles.metaText, { color: theme.colors.tertiaryText }]}>
            {question.pattern}
          </Text>
        </View>
        <Text style={[styles.metaText, { color: theme.colors.tertiaryText }]}>
          {question.attempts} attempts
        </Text>
      </View>

      {companies.length > 0 && (
        <View style={styles.companiesRow}>
          {companies.map((c, i) => (
            <View key={i} style={[styles.companyChip, { backgroundColor: theme.colors.border + '30' }]}>
              <Text style={[styles.companyText, { color: theme.colors.secondaryText }]}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
          Problem
        </Text>
        <Text style={[styles.sectionContent, { color: theme.colors.secondaryText }]}>
          {question.problem_statement}
        </Text>
      </Card>

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <View key={i} style={[styles.tagChip, { backgroundColor: theme.colors.primary + '15' }]}>
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {hints.length > 0 && (
        <Card style={styles.section}>
          <Pressable onPress={() => setShowHints(!showHints)} style={styles.sectionHeader}>
            <Lightbulb size={18} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primaryText, flex: 1 }]}>
              Hints
            </Text>
            <Text style={[styles.toggleText, { color: theme.colors.primary }]}>
              {showHints ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
          {showHints && (
            <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
              {hints.map((hint, i) => (
                <View key={i} style={styles.hintRow}>
                  <Text style={[styles.hintNumber, { color: theme.colors.warning }]}>
                    {i + 1}.
                  </Text>
                  <Text style={[styles.hintText, { color: theme.colors.secondaryText }]}>
                    {hint}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      <Card style={styles.section}>
        <Pressable onPress={() => setShowSolution(!showSolution)} style={styles.sectionHeader}>
          <FileText size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText, flex: 1 }]}>
            Solutions
          </Text>
          <Text style={[styles.toggleText, { color: theme.colors.primary }]}>
            {showSolution ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
        {showSolution && (
          <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
            <View>
              <Text style={[styles.solutionLabel, { color: theme.colors.tertiaryText }]}>
                Brute Force
              </Text>
              <Text style={[styles.solutionText, { color: theme.colors.secondaryText }]}>
                {question.brute_force}
              </Text>
            </View>
            <View>
              <Text style={[styles.solutionLabel, { color: theme.colors.success }]}>
                Optimized
              </Text>
              <Text style={[styles.solutionText, { color: theme.colors.secondaryText }]}>
                {question.optimized_solution}
              </Text>
            </View>
            <View style={styles.complexityRow}>
              <View style={[styles.complexityBox, { backgroundColor: theme.colors.border + '30' }]}>
                <Text style={[styles.complexityLabel, { color: theme.colors.tertiaryText }]}>Time</Text>
                <Text style={[styles.complexityValue, { color: theme.colors.primaryText }]}>
                  {question.time_complexity}
                </Text>
              </View>
              <View style={[styles.complexityBox, { backgroundColor: theme.colors.border + '30' }]}>
                <Text style={[styles.complexityLabel, { color: theme.colors.tertiaryText }]}>Space</Text>
                <Text style={[styles.complexityValue, { color: theme.colors.primaryText }]}>
                  {question.space_complexity}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Card>

      {Object.keys(practiceUrls).length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primaryText }]}>
            Practice Links
          </Text>
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {Object.entries(practiceUrls).map(([platform, url]) => (
              <Pressable key={platform} onPress={() => Linking.openURL(url)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
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

      <Button
        label={question.is_solved ? 'Solved!' : 'Mark as Solved'}
        variant={question.is_solved ? 'secondary' : 'primary'}
        fullWidth
        icon={<CheckCircle size={18} color={question.is_solved ? theme.colors.success : '#fff'} />}
        onPress={handleMarkSolved}
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  titleSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  platformBadge: {
    justifyContent: 'center',
  },
  platformText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
  },
  companiesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  companyChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  companyText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tagChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  section: {
    padding: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  sectionContent: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.fontSize.md * 1.5,
    marginTop: spacing.xs,
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  hintRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hintNumber: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  hintText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
    flex: 1,
  },
  solutionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 2,
  },
  solutionText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  complexityRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  complexityBox: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    gap: 2,
  },
  complexityLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  complexityValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
  },
  linkText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
});
