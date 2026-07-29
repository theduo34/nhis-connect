import { Redirect, Slot } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function SubscriberLayout() {
  const role = useAuthStore((s) => s.user?.role);

  if (role !== 'subscriber') {
    return <Redirect href="/(protected)/(admin)/(tabs)/home" />;
  }

  return <Slot />;
}
