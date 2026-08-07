import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import ShortcutCard from '@/components/profile/ShortcutCard';
import WideShortcutCard from '@/components/profile/WideShortcutCard';
import {
  fetchRecentRenewalActivity,
  type RenewalActivity,
} from '@/services/admin-renewals.service';
import { fetchRecentAppointments, type Appointment } from '@/services/appointments.service';

const cardStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function renewalLabel(activity: RenewalActivity): string {
  if (activity.status === 'pending') return `${activity.subjectName} requested a renewal`;
  if (activity.status === 'approved') return `${activity.subjectName}'s renewal was approved`;
  return `${activity.subjectName}'s renewal was rejected`;
}

export default function AdminHome() {
  const [muted, accent] = useThemeColor(['muted', 'accent']);
  const [renewalActivity, setRenewalActivity] = useState<RenewalActivity[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRecentRenewalActivity(5), fetchRecentAppointments(5)]).then(
      ([renewals, recentAppointments]) => {
        setRenewalActivity(renewals);
        setAppointments(recentAppointments);
        setIsLoading(false);
      }
    );
  }, []);

  const hasActivity = renewalActivity.length > 0 || appointments.length > 0;

  return (
    <CollapsibleScreen title="Home">
      <View className="flex-row gap-3">
        <ShortcutCard
          icon="document-text-outline"
          label="Renewals"
          onPress={() => router.push('/(protected)/(admin)/(tabs)/renewals')}
        />
        <ShortcutCard
          icon="business-outline"
          label="Facilities"
          onPress={() => router.push('/(protected)/(admin)/(tabs)/facilities')}
        />
      </View>

      <View className="mt-8">
        <Text className="text-foreground mb-3 text-lg font-bold">Recent activity</Text>
        {!isLoading && !hasActivity ? (
          <View className="items-center gap-3 rounded-2xl bg-white px-6 py-8" style={cardStyle}>
            <Ionicons name="time-outline" size={32} color={muted} />
            <Text className="text-muted text-center text-sm">
              Renewal and appointment activity will show up here as subscribers submit them.
            </Text>
          </View>
        ) : (
          <View className="gap-2.5">
            {renewalActivity.map((activity) => (
              <View
                key={activity.id}
                className="flex-row items-center gap-3 rounded-2xl bg-white p-4"
                style={cardStyle}>
                <Ionicons name="document-text-outline" size={18} color={accent} />
                <Text className="text-foreground flex-1 text-sm">{renewalLabel(activity)}</Text>
                <Text className="text-muted text-xs">{formatDate(activity.submittedAt)}</Text>
              </View>
            ))}
            {appointments.map((appointment) => (
              <View
                key={appointment.id}
                className="flex-row items-center gap-3 rounded-2xl bg-white p-4"
                style={cardStyle}>
                <Ionicons name="calendar-outline" size={18} color={accent} />
                <Text className="text-foreground flex-1 text-sm">
                  Visit booked at {appointment.facilityName}
                </Text>
                <Text className="text-muted text-xs">{formatDate(appointment.date)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mt-6">
        <WideShortcutCard
          icon="help-buoy-outline"
          title="Need help managing the platform?"
          description="Get answers to common questions"
          onPress={() => router.push('/(protected)/help')}
        />
      </View>
    </CollapsibleScreen>
  );
}
