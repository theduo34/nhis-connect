import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';

interface WideShortcutCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

export default function WideShortcutCard({
  icon,
  title,
  description,
  onPress,
}: WideShortcutCardProps) {
  const [accent, muted] = useThemeColor(['accent', 'muted']);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-2xl bg-white px-5 py-5 active:opacity-80"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}>
      <View className="bg-accent-soft h-12 w-12 items-center justify-center rounded-full">
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-base font-semibold">{title}</Text>
        <Text className="text-muted text-xs">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={muted} />
    </Pressable>
  );
}
