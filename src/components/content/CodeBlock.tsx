import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';
import type { CodeExample } from '../../content/types';

const LANG_COLORS: Record<string, string> = {
  go: '#00ADD8', typescript: '#3178C6', javascript: '#D4AB00',
  python: '#3572A5', java: '#B07219', sql: '#336791', bash: '#4EAA25',
};

export function CodeBlock({ examples }: { examples: CodeExample[] }) {
  const { theme } = useTheme();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!examples.length) return null;
  const cur = examples[active];

  const copy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(cur.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* ignore */ }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {examples.map((ex, i) => {
            const label = ex.label ?? ex.language;
            const color = LANG_COLORS[ex.language] ?? theme.colors.primary;
            const active_ = i === active;
            return (
              <Pressable key={i} onPress={() => setActive(i)} style={[styles.tab, { borderBottomColor: active_ ? color : 'transparent' }]}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Text style={[styles.tabText, { color: active_ ? theme.colors.primaryText : theme.colors.tertiaryText }]}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable onPress={copy} style={styles.copyBtn}>
          {copied ? <Check size={16} color={theme.colors.success} /> : <Copy size={16} color={theme.colors.tertiaryText} />}
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ maxHeight: 320 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.code, { color: theme.colors.primaryText }]}>{cur.code}</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  tabs: { flexDirection: 'row', paddingLeft: spacing.xs },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  tabText: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  copyBtn: { padding: spacing.md },
  code: { fontFamily: 'monospace', fontSize: 13, lineHeight: 22, padding: spacing.md },
});
