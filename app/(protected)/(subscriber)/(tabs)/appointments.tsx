import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import AddAppointmentButton from '@/components/appointments/AddAppointmentButton';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { useAuthStore } from '@/store/auth';
import { fetchAppointments, type Appointment } from '@/services/appointments.service';

const emptyCardStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
};

export default function SubscriberAppointments() {
  const user = useAuthStore((s) => s.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [muted] = useThemeColor(['muted']);

  useEffect(() => {
    if (!user) return;
    fetchAppointments(user.id).then(setAppointments);
  }, [user]);

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const past = appointments.filter((a) => a.status !== 'upcoming');

  return (
    <CollapsibleScreen title="Appointments" rightAction={<AddAppointmentButton />}>
      <Text className="text-foreground mb-3 text-lg font-bold">Upcoming</Text>
      {upcoming.length === 0 ? (
        <View className="items-center gap-3 rounded-2xl bg-white px-6 py-8" style={emptyCardStyle}>
          <Ionicons name="calendar-outline" size={32} color={muted} />
          <Text className="text-muted text-center text-sm">No upcoming appointments.</Text>
          <Button size="sm" onPress={() => router.push('/(protected)/book-appointment')}>
            Book an appointment
          </Button>
        </View>
      ) : (
        upcoming.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      )}

      <Text className="text-foreground mb-3 mt-8 text-lg font-bold">Past</Text>
      {past.length === 0 ? (
        <Text className="text-muted text-sm">No past appointments yet.</Text>
      ) : (
        past.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      )}
    </CollapsibleScreen>
  );
}
