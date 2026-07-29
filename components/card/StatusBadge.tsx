import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import type { MembershipStatus } from '@/services/membership.service';

export default function StatusBadge({ status }: { status: MembershipStatus }) {
  if (status === 'active') {
    return (
      <View className="bg-success-soft self-start rounded-full px-3 py-1">
        <Text className="text-success-soft-foreground text-xs font-semibold">Active</Text>
      </View>
    );
  }
  if (status === 'expiring_soon') {
    return (
      <View className="bg-warning-soft self-start rounded-full px-3 py-1">
        <Text className="text-warning-soft-foreground text-xs font-semibold">Expiring soon</Text>
      </View>
    );
  }
  return (
    <View className="bg-danger-soft self-start rounded-full px-3 py-1">
      <Text className="text-danger-soft-foreground text-xs font-semibold">Expired</Text>
    </View>
  );
}
