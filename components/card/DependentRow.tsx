import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import StatusBadge from '@/components/card/StatusBadge';
import type { Dependent } from '@/services/dependents.service';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export default function DependentRow({ dependent }: { dependent: Dependent }) {
  const [muted] = useThemeColor(['muted']);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(protected)/renew-membership',
          params: { dependentId: dependent.id, dependentName: dependent.fullName },
        })
      }
      className="active:bg-default flex-row items-center gap-3 px-4 py-3.5">
      <View className="bg-accent-soft h-10 w-10 items-center justify-center rounded-full">
        <Text className="text-accent-soft-foreground text-sm font-bold">
          {getInitials(dependent.fullName)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-base font-semibold">{dependent.fullName}</Text>
        <Text className="text-muted text-xs">{dependent.relationship}</Text>
      </View>
      <StatusBadge status={dependent.membershipStatus} />
      <Ionicons name="chevron-forward" size={16} color={muted} />
    </Pressable>
  );
}
