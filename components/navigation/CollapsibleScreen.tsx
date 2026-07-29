import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text } from '@/components/common/Text';

const COLLAPSE_RANGE = 50;

interface CollapsibleScreenProps {
  title: string;
  /** e.g. a notification bell (Profile) or an add button (Card) — nothing by default. */
  rightAction?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for every dashboard tab: a pinned bg-surface header (title
 * fades in once you scroll past the big in-content title) over a
 * bg-background scroll area. One implementation so all tab screens stay
 * visually identical instead of hand-rolling this per screen.
 */
export default function CollapsibleScreen({
  title,
  rightAction,
  children,
}: CollapsibleScreenProps) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const compactTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_RANGE * 0.5, COLLAPSE_RANGE],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View className="bg-background flex-1">
      <SafeAreaView edges={['top']} className="bg-surface">
        <View className="border-border flex-row items-center justify-between border-b px-5 pb-3 pt-2">
          <Animated.View style={[styles.flex1, compactTitleStyle]}>
            <Text className="text-foreground text-lg font-bold" numberOfLines={1}>
              {title}
            </Text>
          </Animated.View>
          {rightAction}
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.flex1}
        contentContainerStyle={styles.content}>
        <Text className="text-foreground mb-4 text-5xl font-bold">{title}</Text>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
});
