import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { ExternalLink, Video, BookOpen, FileText, Github, GraduationCap } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography, radius } from '../../theme/tokens';
import type { Resource } from '../../content/types';

const ICON_MAP: Record<string, typeof FileText> = {
  video: Video, docs: BookOpen, article: FileText,
  github: Github, book: BookOpen, course: GraduationCap,
};

const COLOR_MAP: Record<string, string> = {
  video: '#ef4444', docs: '#8b5cf6', article: '#3b82f6',
  github: '#374151', book: '#f59e0b', course: '#10b981',
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  const { theme } = useTheme();
  if (!resources.length) return (
    <View style={styles.empty}>
      <Text style={{ color: theme.colors.tertiaryText }}>No resources listed.</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      {resources.map((r, i) => {
        const Icon = ICON_MAP[r.type] ?? FileText;
        const color = COLOR_MAP[r.type] ?? theme.colors.primary;
        return (
          <Pressable key={i} onPress={() => Linking.openURL(r.url)} style={({ pressed }) => [styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.7 : 1 }]}>
            <View style={[styles.icon, { backgroundColor: color + '18' }]}>
              <Icon size={18} color={color} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.colors.primaryText }]} numberOfLines={2}>{r.title}</Text>
              <View style={styles.tags}>
                <View style={[styles.tag, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.tagText, { color }]}>{r.type}</Text>
                </View>
                {r.free !== false && (
                  <View style={[styles.tag, { backgroundColor: theme.colors.success + '18' }]}>
                    <Text style={[styles.tagText, { color: theme.colors.success }]}>Free</Text>
                  </View>
                )}
              </View>
            </View>
            <ExternalLink size={14} color={theme.colors.tertiaryText} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  empty: { padding: spacing.xl, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, gap: spacing.xs },
  title: { fontSize: typography.fontSize.md, fontWeight: '600' },
  tags: { flexDirection: 'row', gap: spacing.xs },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: typography.fontSize.xs, fontWeight: '600' },
});
