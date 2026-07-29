import { Redirect, Slot } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function AdminLayout() {
  const role = useAuthStore((s) => s.user?.role);

  if (role !== 'admin') {
    return <Redirect href="/(protected)/(subscriber)/(tabs)/home" />;
  }

  return <Slot />;
}
