import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import type { TabConfig } from '@/constants/tabs';

interface Props extends BottomTabBarProps {
  tabs: TabConfig[];
}

/** Airbnb-style bottom tab bar — active state is icon/label color only, no pill background. */
export default function BottomTabBar({ state, navigation, insets, tabs }: Props) {
  const [activeColor, mutedColor] = useThemeColor(['accent', 'muted']);

  return (
    <View
      className="bg-surface border-border flex-row border-t px-2 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}>
      {state.routes.map((route, index) => {
        const tab = tabs.find((t) => t.name === route.name);
        if (!tab) return null;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={tab.label}
            className="flex-1 items-center gap-1 py-1">
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={22}
              color={isFocused ? activeColor : mutedColor}
            />
            <Text
              className="text-xs"
              numberOfLines={1}
              style={{ color: isFocused ? activeColor : mutedColor }}
              weight={isFocused ? 'semiBold' : 'regular'}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
