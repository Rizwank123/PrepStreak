import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../theme/tokens';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  noBottomPadding?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  noBottomPadding,
}: ScreenContainerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View style={{ gap: spacing.md, paddingBottom: noBottomPadding ? 0 : insets.bottom + spacing.xxxl }}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
