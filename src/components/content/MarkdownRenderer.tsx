import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';

interface Props {
  content: string;
  scrollable?: boolean;
}

type Segment = { text: string; bold?: boolean; code?: boolean; italic?: boolean };

function parseInline(line: string): Segment[] {
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/);
  return parts.map((p) => {
    if (p.startsWith('`') && p.endsWith('`')) return { text: p.slice(1, -1), code: true };
    if (p.startsWith('**') && p.endsWith('**')) return { text: p.slice(2, -2), bold: true };
    if (p.startsWith('*') && p.endsWith('*')) return { text: p.slice(1, -1), italic: true };
    return { text: p };
  });
}

function InlineText({ segments, baseStyle }: { segments: Segment[]; baseStyle: object }) {
  const { theme } = useTheme();
  return (
    <Text style={baseStyle}>
      {segments.map((s, i) => {
        if (s.code) {
          return (
            <Text key={i} style={[{ fontFamily: 'monospace', fontSize: 13, backgroundColor: theme.colors.border + '40', color: theme.colors.primary }]}>
              {s.text}
            </Text>
          );
        }
        if (s.bold) return <Text key={i} style={{ fontWeight: '700' }}>{s.text}</Text>;
        if (s.italic) return <Text key={i} style={{ fontStyle: 'italic' }}>{s.text}</Text>;
        return <Text key={i}>{s.text}</Text>;
      })}
    </Text>
  );
}

export function MarkdownRenderer({ content, scrollable = false }: Props) {
  const { theme } = useTheme();
  const elements: React.ReactNode[] = [];
  const lines = (content ?? '').split('\n');

  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let inTable = false;
  let tableRows: string[][] = [];
  let key = 0;

  const flushTable = () => {
    if (tableRows.length < 2) { tableRows = []; inTable = false; return; }
    const headers = tableRows[0];
    const data = tableRows.slice(2);
    elements.push(
      <View key={key++} style={[styles.table, { borderColor: theme.colors.border }]}>
        <View style={[styles.tableRow, { backgroundColor: theme.colors.border + '30' }]}>
          {headers.map((h, i) => <Text key={i} style={[styles.th, { color: theme.colors.primaryText, flex: 1 }]}>{h.trim()}</Text>)}
        </View>
        {data.map((row, ri) => (
          <View key={ri} style={[styles.tableRow, { borderTopColor: theme.colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
            {row.map((cell, ci) => <Text key={ci} style={[styles.td, { color: theme.colors.secondaryText, flex: 1 }]}>{cell.trim()}</Text>)}
          </View>
        ))}
      </View>
    );
    tableRows = []; inTable = false;
  };

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      if (inCode) {
        elements.push(
          <View key={key++} style={[styles.codeBlock, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            {codeLang ? <Text style={[styles.codeLang, { color: theme.colors.primary }]}>{codeLang}</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={[styles.codeText, { color: theme.colors.primaryText }]}>{codeLines.join('\n')}</Text>
            </ScrollView>
          </View>
        );
        inCode = false; codeLines = []; codeLang = '';
      } else {
        if (inTable) flushTable();
        inCode = true; codeLang = line.trim().slice(3);
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    if (line.startsWith('|')) {
      inTable = true;
      tableRows.push(line.split('|').filter((_, i, a) => i > 0 && i < a.length - 1));
      continue;
    }
    if (inTable) flushTable();

    if (!line.trim()) { elements.push(<View key={key++} style={{ height: spacing.sm }} />); continue; }

    if (line.startsWith('# ')) {
      elements.push(<Text key={key++} style={[styles.h1, { color: theme.colors.primaryText }]}>{line.slice(2)}</Text>);
    } else if (line.startsWith('## ')) {
      elements.push(<Text key={key++} style={[styles.h2, { color: theme.colors.primaryText }]}>{line.slice(3)}</Text>);
    } else if (line.startsWith('### ')) {
      elements.push(<Text key={key++} style={[styles.h3, { color: theme.colors.primaryText }]}>{line.slice(4)}</Text>);
    } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
      const done = line.startsWith('- [x]');
      elements.push(
        <View key={key++} style={styles.listItem}>
          <Text style={{ color: done ? theme.colors.success : theme.colors.tertiaryText }}>{done ? '✓' : '○'}  </Text>
          <Text style={[styles.listText, { color: theme.colors.secondaryText }]}>{line.slice(6)}</Text>
        </View>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <View key={key++} style={styles.listItem}>
          <Text style={{ color: theme.colors.primary }}>•  </Text>
          <InlineText segments={parseInline(line.slice(2))} baseStyle={[styles.listText, { color: theme.colors.secondaryText }]} />
        </View>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/);
      if (m) elements.push(
        <View key={key++} style={styles.listItem}>
          <Text style={{ color: theme.colors.primary }}>{m[1]}.  </Text>
          <InlineText segments={parseInline(m[2])} baseStyle={[styles.listText, { color: theme.colors.secondaryText }]} />
        </View>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <View key={key++} style={[styles.blockquote, { borderLeftColor: theme.colors.primary, backgroundColor: theme.colors.primary + '08' }]}>
          <Text style={[styles.bqText, { color: theme.colors.secondaryText }]}>{line.slice(2)}</Text>
        </View>
      );
    } else if (line.startsWith('---')) {
      elements.push(<View key={key++} style={[styles.hr, { backgroundColor: theme.colors.border }]} />);
    } else if (line.startsWith('![')) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        elements.push(
          <View key={key++} style={styles.imageWrap}>
            <Image source={{ uri: imgMatch[2] }} style={styles.image} resizeMode="contain" />
            {imgMatch[1] ? <Text style={[styles.imageCaption, { color: theme.colors.tertiaryText }]}>{imgMatch[1]}</Text> : null}
          </View>
        );
      } else {
        elements.push(<InlineText key={key++} segments={parseInline(line)} baseStyle={[styles.para, { color: theme.colors.secondaryText }]} />);
      }
    } else {
      elements.push(<InlineText key={key++} segments={parseInline(line)} baseStyle={[styles.para, { color: theme.colors.secondaryText }]} />);
    }
  }
  if (inTable) flushTable();

  const inner = <View style={styles.root}>{elements}</View>;
  return scrollable ? (
    <ScrollView showsVerticalScrollIndicator={false}>{inner}</ScrollView>
  ) : inner;
}

const styles = StyleSheet.create({
  root: { gap: 2 },
  h1: { fontSize: typography.fontSize.xxl, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  h2: { fontSize: typography.fontSize.xl, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.xs },
  h3: { fontSize: typography.fontSize.lg, fontWeight: '600', marginTop: spacing.sm, marginBottom: spacing.xs },
  para: { fontSize: typography.fontSize.md, lineHeight: typography.fontSize.md * 1.6 },
  listItem: { flexDirection: 'row', paddingVertical: 2, paddingLeft: spacing.sm },
  listText: { flex: 1, fontSize: typography.fontSize.md, lineHeight: typography.fontSize.md * 1.5 },
  codeBlock: { borderRadius: 10, borderWidth: 1, padding: spacing.md, marginVertical: spacing.sm },
  codeLang: { fontSize: typography.fontSize.xs, fontWeight: '600', marginBottom: spacing.xs },
  codeText: { fontFamily: 'monospace', fontSize: 13, lineHeight: 20 },
  blockquote: { borderLeftWidth: 3, paddingLeft: spacing.md, paddingVertical: spacing.sm, borderRadius: 4 },
  bqText: { fontSize: typography.fontSize.md, fontStyle: 'italic' },
  hr: { height: 1, marginVertical: spacing.md },
  table: { borderWidth: 1, borderRadius: 8, marginVertical: spacing.sm, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', paddingVertical: spacing.sm, paddingHorizontal: spacing.sm },
  th: { fontSize: typography.fontSize.sm, fontWeight: '700', paddingHorizontal: 4 },
  td: { fontSize: typography.fontSize.sm, paddingHorizontal: 4 },
  imageWrap: { marginVertical: spacing.md, alignItems: 'center' },
  image: { width: '100%', maxWidth: 400, height: 220, borderRadius: 8 },
  imageCaption: { fontSize: typography.fontSize.sm, marginTop: spacing.xs, textAlign: 'center' },
});
