import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

export default function MenuItem({ icon, label, onPress, isDestructive = false }: MenuItemProps) {
  const [foreground, danger, muted] = useThemeColor(['foreground', 'danger', 'muted']);
  const iconColor = isDestructive ? danger : foreground;

  return (
    <Pressable
      onPress={onPress}
      className="active:bg-default flex-row items-center gap-3 py-3.5">
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text
        className={
          isDestructive ? 'text-danger flex-1 text-base' : 'text-foreground flex-1 text-base'
        }>
        {label}
      </Text>
      {!isDestructive && <Ionicons name="chevron-forward" size={18} color={muted} />}
    </Pressable>
  );
}
