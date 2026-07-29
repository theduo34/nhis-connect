import { View } from 'react-native';
import { Text } from '@/components/common/Text';

interface ProfileCardProps {
  name: string;
  region?: string | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export default function ProfileCard({ name, region }: ProfileCardProps) {
  return (
    <View
      className="items-center gap-3 rounded-3xl bg-white px-6 py-8"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}>
      <View className="bg-accent-soft h-24 w-24 items-center justify-center rounded-full">
        <Text className="text-accent-soft-foreground text-4xl font-bold">{getInitials(name)}</Text>
      </View>
      <View className="items-center gap-1">
        <Text className="text-foreground text-2xl font-bold">{name || 'Your name'}</Text>
        <Text className="text-muted text-sm">
          {region ? `${region}, Ghana` : 'Add your region · Ghana'}
        </Text>
      </View>
    </View>
  );
}
