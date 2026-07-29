import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import MenuSection from '@/components/profile/MenuSection';
import InfoRow from '@/components/profile/InfoRow';
import { useAuthStore } from '@/store/auth';
import { fetchProfileDetails, type FullProfile } from '@/services/profile.service';

const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  prefer_not_to_say: 'Prefer not to say',
};

export default function ViewProfile() {
  const user = useAuthStore((s) => s.user);
  const [details, setDetails] = useState<FullProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProfileDetails(user.id).then((result) => {
      setDetails(result);
      setIsLoading(false);
    });
  }, [user]);

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-6 mt-2 text-2xl font-bold">Your profile</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <MenuSection title="Personal">
            <InfoRow label="Full name" value={details?.name ?? user?.name ?? ''} />
            <InfoRow label="Email" value={user?.email ?? ''} />
            <InfoRow label="Phone" value={details?.phone ?? ''} />
            <InfoRow
              label="Gender"
              value={details?.gender ? (GENDER_LABELS[details.gender] ?? details.gender) : ''}
            />
            <InfoRow label="Date of birth" value={details?.dateOfBirth ?? ''} />
          </MenuSection>

          <MenuSection title="Membership">
            <InfoRow label="NHIS number" value={details?.nhisNumber ?? ''} />
            <InfoRow label="Region" value={details?.region ?? ''} />
            <InfoRow label="Country" value={details?.country ?? ''} />
          </MenuSection>
        </>
      )}
    </MainContainer>
  );
}
