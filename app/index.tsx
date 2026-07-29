import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { Image } from 'expo-image';
import { Text } from '@/components/common/Text';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';

export default function Index() {
  const authHydrated = useStoreHydrated(useAuthStore);
  const onboardingHydrated = useStoreHydrated(useOnboardingStore);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isSessionChecked = useAuthStore((s) => s.isSessionChecked);
  const role = useAuthStore((s) => s.user?.role);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);

  const ready = authHydrated && onboardingHydrated && isSessionChecked;

  if (!ready) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-3">
        <Image
          source={require('../assets/images/icon.png')}
          style={{ width: 72, height: 72, borderRadius: 16 }}
          contentFit="contain"
        />
        <Text className="text-foreground font-bold">NHIS Connect</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <Redirect
        href={
          role === 'admin'
            ? '/(protected)/(admin)/(tabs)/home'
            : '/(protected)/(subscriber)/(tabs)/home'
        }
      />
    );
  }

  return <Redirect href={hasSeenOnboarding ? '/(landing)/welcome' : '/(onboarding)/carousel'} />;
}
