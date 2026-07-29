import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { useStoreHydrated } from '@/hooks/useStoreHydrated';

export default function ProtectedLayout() {
  const hydrated = useStoreHydrated(useAuthStore);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(landing)/welcome" />;
  }

  if (!user?.isVerified) {
    return <Redirect href="/(auth)/otp" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(subscriber)" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="view-profile" />
      <Stack.Screen name="account-settings" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="help" />
      <Stack.Screen name="add-dependent" />
      <Stack.Screen name="book-appointment" />
    </Stack>
  );
}
