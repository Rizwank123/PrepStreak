import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, ChevronRight, BookOpen, Code } from 'lucide-react-native';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { DifficultyBadge } from '../../../components/ui/Badges';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import { questionRepository, topicRepository } from '../../../repository';
import type { Question, Topic } from '../../../types';

interface SearchResult {
  id: string;
  type: 'question' | 'topic';
  title: string;
  subtitle: string;
  difficulty?: string;
  entityId: string;
}

export function SearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const [questions, topics] = await Promise.all([
      questionRepository.search(text.trim()),
      topicRepository.getByModule('mod-dsa'),
    ]);
    const filteredTopics = topics.filter(
      (t) => t.title.toLowerCase().includes(text.toLowerCase()) ||
      t.description.toLowerCase().includes(text.toLowerCase()),
    );
    const questionResults: SearchResult[] = questions.map((q: Question) => ({
      id: q.id,
      type: 'question' as const,
      title: q.title,
      subtitle: q.pattern,
      difficulty: q.difficulty,
      entityId: q.id,
    }));
    const topicResults: SearchResult[] = filteredTopics.map((t: Topic) => ({
      id: t.id,
      type: 'topic' as const,
      title: t.title,
      subtitle: t.description,
      entityId: t.id,
    }));
    setResults([...topicResults, ...questionResults]);
    setLoading(false);
  }, []);

  const handlePressResult = useCallback((result: SearchResult) => {
    if (result.type === 'question') {
      router.push(`/dsa/question/${result.entityId}`);
    } else {
      router.push(`/dsa/${result.entityId}`);
    }
  }, [router]);

  const renderItem = useCallback(({ item }: { item: SearchResult }) => (
    <Pressable onPress={() => handlePressResult(item)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <Card style={styles.resultCard}>
        <View style={styles.resultRow}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
            {item.type === 'question' ? (
              <Code size={16} color={theme.colors.primary} />
            ) : (
              <BookOpen size={16} color={theme.colors.primary} />
            )}
          </View>
          <View style={styles.resultInfo}>
            <Text style={[styles.resultTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.resultMeta}>
              <Text style={[styles.resultSubtitle, { color: theme.colors.secondaryText }]} numberOfLines={1}>
                {item.subtitle}
              </Text>
              {item.difficulty && <DifficultyBadge difficulty={item.difficulty as 'beginner' | 'intermediate' | 'advanced'} />}
            </View>
          </View>
          <ChevronRight size={18} color={theme.colors.tertiaryText} />
        </View>
      </Card>
    </Pressable>
  ), [handlePressResult, theme]);

  return (
    <>
      <ScreenHeader title="Search" subtitle="Find topics, questions, and more" />
      <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: spacing.lg }}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Search size={18} color={theme.colors.tertiaryText} />
          <TextInput
            style={[styles.input, { color: theme.colors.primaryText }]}
            placeholder="Search questions, topics, patterns..."
            placeholderTextColor={theme.colors.tertiaryText}
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(''); setResults([]); }}>
              <X size={18} color={theme.colors.tertiaryText} />
            </Pressable>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : query.length < 2 ? (
          <EmptyState
            icon={<Search size={28} color={theme.colors.tertiaryText} />}
            title="Start typing to search"
            subtitle="Search across all topics, questions, and patterns. Everything works offline."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<Search size={28} color={theme.colors.tertiaryText} />}
            title="No results found"
            subtitle={`No matches for "${query}". Try a different search term.`}
          />
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: spacing.md }}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    padding: 0,
  },
  resultCard: {
    padding: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  resultTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultSubtitle: {
    fontSize: typography.fontSize.xs,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
