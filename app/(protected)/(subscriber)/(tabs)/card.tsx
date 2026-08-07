import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import MembershipCard from '@/components/home/MembershipCard';
import AddDependentButton from '@/components/card/AddDependentButton';
import StatusBadge from '@/components/card/StatusBadge';
import DependentRow from '@/components/card/DependentRow';
import MenuSection from '@/components/profile/MenuSection';
import { useAuthStore } from '@/store/auth';
import { fetchProfileDetails } from '@/services/profile.service';
import { fetchMembershipStatus, type Membership } from '@/services/membership.service';
import { fetchDependents, type Dependent } from '@/services/dependents.service';

function formatExpiry(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
};

export default function SubscriberCard() {
  const user = useAuthStore((s) => s.user);
  const [nhisNumber, setNhisNumber] = useState<string | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [muted] = useThemeColor(['muted']);

  useEffect(() => {
    if (!user) return;
    fetchProfileDetails(user.id).then((details) => setNhisNumber(details?.nhisNumber ?? null));
    fetchMembershipStatus(user.id).then(setMembership);
    fetchDependents(user.id).then(setDependents);
  }, [user]);

  const canRenew = membership && membership.status !== 'active' && membership.status !== 'pending';

  return (
    <CollapsibleScreen title="Card" rightAction={<AddDependentButton />}>
      <MembershipCard name={user?.name ?? ''} nhisNumber={nhisNumber} status={membership?.status} />

      <View className="mt-5 gap-3 rounded-2xl bg-white p-5" style={cardShadow}>
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-bold">Membership status</Text>
          {membership && <StatusBadge status={membership.status} />}
        </View>
        <Text className="text-muted text-sm">
          {membership?.status === 'pending'
            ? 'Your renewal request is being reviewed.'
            : membership?.expiry
              ? `Valid until ${formatExpiry(membership.expiry)}`
              : 'No expiry date on file yet'}
        </Text>
        {canRenew && (
          <Button size="sm" onPress={() => router.push('/(protected)/renew-membership')}>
            Renew now
          </Button>
        )}
      </View>

      <View className="mt-6">
        <Text className="text-foreground mb-3 text-lg font-bold">Dependents</Text>
        {dependents.length === 0 ? (
          <View className="items-center gap-3 rounded-2xl bg-white px-6 py-8" style={cardShadow}>
            <Ionicons name="people-outline" size={32} color={muted} />
            <Text className="text-muted text-center text-sm">
              No dependents added yet. Tap + above to add a family member&apos;s NHIS card.
            </Text>
          </View>
        ) : (
          <MenuSection variant="flat">
            {dependents.map((dependent) => (
              <DependentRow key={dependent.id} dependent={dependent} />
            ))}
          </MenuSection>
        )}
      </View>
    </CollapsibleScreen>
  );
}
