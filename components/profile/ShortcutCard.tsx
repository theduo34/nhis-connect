import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';

interface ShortcutCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export default function ShortcutCard({ icon, label, onPress }: ShortcutCardProps) {
  const [accent] = useThemeColor(['accent']);

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-6 active:opacity-80"
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
      <Text className="text-foreground text-sm font-semibold">{label}</Text>
    </Pressable>
  );
}
