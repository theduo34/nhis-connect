import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import type { BackArrowProps } from '@/interfaces/components/ui';

/**
 * Defaults to expo-router's own back navigation. When there's no screen to
 * go back to (e.g. this screen was reached via a redirect, not a push), it
 * falls back to `/` instead of firing the unhandled GO_BACK action — `/`
 * always resolves to the right place since app/index.tsx's own redirect
 * logic re-evaluates auth/verification state from there.
 */
export function BackArrow({ onPress, size = 40, style }: BackArrowProps) {
  const [foreground] = useThemeColor(['foreground']);
  const iconSize = Math.round(size * 0.5);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-default items-center justify-center rounded-full active:opacity-70"
      style={[{ width: size, height: size }, style]}>
      <Ionicons name="arrow-back" size={iconSize} color={foreground} />
    </Pressable>
  );
}
