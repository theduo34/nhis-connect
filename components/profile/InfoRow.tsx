import { View } from 'react-native';
import { Text } from '@/components/common/Text';

interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="px-4 py-3.5">
      <Text className="text-muted text-xs">{label}</Text>
      <Text className="text-foreground mt-0.5 text-base">{value || '—'}</Text>
    </View>
  );
}
