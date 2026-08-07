import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import MembershipCard from '@/components/home/MembershipCard';
import ShortcutCard from '@/components/profile/ShortcutCard';
import WideShortcutCard from '@/components/profile/WideShortcutCard';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { useAuthStore } from '@/store/auth';
import { fetchProfileDetails } from '@/services/profile.service';
import { fetchMembershipStatus, type MembershipStatus } from '@/services/membership.service';
import { fetchAppointments, type Appointment } from '@/services/appointments.service';

export default function SubscriberHome() {
  const user = useAuthStore((s) => s.user);
  const [nhisNumber, setNhisNumber] = useState<string | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [muted] = useThemeColor(['muted']);

  useEffect(() => {
    if (!user) return;
    fetchProfileDetails(user.id).then((details) => setNhisNumber(details?.nhisNumber ?? null));
    fetchMembershipStatus(user.id).then((membership) =>
      setMembershipStatus(membership?.status ?? null)
    );
    fetchAppointments(user.id).then((appointments) => {
      setNextAppointment(appointments.find((a) => a.status === 'upcoming') ?? null);
    });
  }, [user]);

  const renewalAlert =
    membershipStatus === 'expired'
      ? 'danger'
      : membershipStatus === 'expiring_soon'
        ? 'warning'
        : undefined;

  return (
    <CollapsibleScreen title="Home">
      <MembershipCard name={user?.name ?? ''} nhisNumber={nhisNumber} status={membershipStatus} />

      <View className="mt-5 flex-row gap-3">
        <ShortcutCard
          icon="refresh-outline"
          label="Renew"
          alert={renewalAlert}
          onPress={() => router.push('/(protected)/renew-membership')}
        />
        <ShortcutCard
          icon="calendar-outline"
          label="Book visit"
          onPress={() => router.push('/(protected)/book-appointment')}
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <ShortcutCard
          icon="business-outline"
          label="Find facility"
          onPress={() => router.push('/(protected)/book-appointment')}
        />
        <ShortcutCard
          icon="help-buoy-outline"
          label="Support"
          onPress={() => router.push('/(protected)/help')}
        />
      </View>

      <View className="mt-8">
        <Text className="text-foreground mb-3 text-lg font-bold">Upcoming appointments</Text>
        {nextAppointment ? (
          <AppointmentCard appointment={nextAppointment} />
        ) : (
          <View
            className="items-center gap-3 rounded-2xl bg-white px-6 py-8"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 1,
            }}>
            <Ionicons name="calendar-outline" size={32} color={muted} />
            <Text className="text-muted text-center text-sm">
              You don&apos;t have any appointments booked yet.
            </Text>
            <Button size="sm" onPress={() => router.push('/(protected)/book-appointment')}>
              Book an appointment
            </Button>
          </View>
        )}
      </View>

      <View className="mt-6">
        <WideShortcutCard
          icon="information-circle-outline"
          title="How renewals work"
          description="Learn what you need before renewing"
          onPress={() => router.push('/(protected)/help')}
        />
      </View>
    </CollapsibleScreen>
  );
}
