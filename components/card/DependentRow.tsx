import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import type { Dependent } from '@/services/dependents.service';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export default function DependentRow({ dependent }: { dependent: Dependent }) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="bg-accent-soft h-10 w-10 items-center justify-center rounded-full">
        <Text className="text-accent-soft-foreground text-sm font-bold">
          {getInitials(dependent.fullName)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-base font-semibold">{dependent.fullName}</Text>
        <Text className="text-muted text-xs">{dependent.relationship}</Text>
      </View>
    </View>
  );
}
