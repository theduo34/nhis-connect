import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import AppointmentStatusBadge from '@/components/appointments/AppointmentStatusBadge';
import type { Appointment } from '@/services/appointments.service';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const [accent] = useThemeColor(['accent']);

  return (
    <View
      className="mb-3 gap-3 rounded-2xl bg-white p-5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-foreground text-base font-bold">{appointment.facilityName}</Text>
          {appointment.facilityAddress && (
            <Text className="text-muted mt-0.5 text-xs">{appointment.facilityAddress}</Text>
          )}
        </View>
        <AppointmentStatusBadge status={appointment.status} />
      </View>

      <View className="border-border flex-row items-center gap-4 border-t pt-3">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={16} color={accent} />
          <Text className="text-foreground text-sm">{formatDate(appointment.date)}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color={accent} />
          <Text className="text-foreground text-sm">{appointment.time}</Text>
        </View>
      </View>
    </View>
  );
}
