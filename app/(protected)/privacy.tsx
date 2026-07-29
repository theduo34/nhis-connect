import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';

export default function Privacy() {
  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-4 mt-2 text-2xl font-bold">Privacy</Text>
      <View className="bg-surface gap-4 rounded-2xl p-5">
        <Text className="text-muted">
          NHIS Connect only collects the details needed to link your account to your NHIS membership
          and manage renewals and appointments — your name, contact details, date of birth, and NHIS
          number.
        </Text>
        <Text className="text-muted">
          Your data is never sold or shared with third parties outside of what&apos;s required to
          process your NHIS membership and facility appointments.
        </Text>
        <Text className="text-muted">
          You can review or update your details at any time from Account settings, or contact
          support to request deletion of your account.
        </Text>
      </View>
    </MainContainer>
  );
}
