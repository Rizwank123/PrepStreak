import { StyleSheet, Text, View } from 'react-native';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, typography } from '../../../theme/tokens';
import type { Topic } from '../../../types';

interface QuickResumeWidgetProps {
  recentTopics: Topic[];
  onPressTopic: (topic: Topic) => void;
}

export function QuickResumeWidget({ recentTopics, onPressTopic }: QuickResumeWidgetProps) {
  const { theme } = useTheme();

  if (recentTopics.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primaryText }]}>
          Quick Resume
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
          Continue where you left off
        </Text>
      </View>
      {recentTopics.slice(0, 3).map((topic) => (
        <Pressable key={topic.id} onPress={() => onPressTopic(topic)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <Card style={styles.topicCard}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
              <BookOpen size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.topicInfo}>
              <Text style={[styles.topicTitle, { color: theme.colors.primaryText }]} numberOfLines={1}>
                {topic.title}
              </Text>
              <Text style={[styles.topicMeta, { color: theme.colors.secondaryText }]} numberOfLines={1}>
                {topic.difficulty} • {topic.estimated_time_minutes} min
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.tertiaryText} />
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  topicMeta: {
    fontSize: typography.fontSize.xs,
  },
});
