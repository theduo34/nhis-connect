import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import type { AppointmentStatus } from '@/services/appointments.service';

export default function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === 'upcoming') {
    return (
      <View className="bg-accent-soft self-start rounded-full px-3 py-1">
        <Text className="text-accent-soft-foreground text-xs font-semibold">Upcoming</Text>
      </View>
    );
  }
  if (status === 'completed') {
    return (
      <View className="bg-success-soft self-start rounded-full px-3 py-1">
        <Text className="text-success-soft-foreground text-xs font-semibold">Completed</Text>
      </View>
    );
  }
  return (
    <View className="bg-danger-soft self-start rounded-full px-3 py-1">
      <Text className="text-danger-soft-foreground text-xs font-semibold">Cancelled</Text>
    </View>
  );
}
