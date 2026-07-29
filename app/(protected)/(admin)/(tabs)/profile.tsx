import { View } from 'react-native';
import { router } from 'expo-router';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import NotificationBell from '@/components/navigation/NotificationBell';
import ProfileCard from '@/components/profile/ProfileCard';
import ShortcutCard from '@/components/profile/ShortcutCard';
import WideShortcutCard from '@/components/profile/WideShortcutCard';
import MenuItem from '@/components/profile/MenuItem';
import MenuSection from '@/components/profile/MenuSection';
import { useAuthStore } from '@/store/auth';

export default function AdminProfile() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const onLogout = async () => {
    await signOut();
    router.replace('/(landing)/welcome');
  };

  return (
    <CollapsibleScreen title="Profile" rightAction={<NotificationBell />}>
      <ProfileCard name={user?.name ?? ''} />

      <View className="mt-4 flex-row gap-3">
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

      <View className="mt-3">
        <WideShortcutCard
          icon="help-buoy-outline"
          title="Need help?"
          description="Get answers to common questions"
          onPress={() => router.push('/(protected)/help')}
        />
      </View>

      <View className="mt-6">
        <MenuSection variant="flat">
          <MenuItem
            icon="person-outline"
            label="View profile"
            onPress={() => router.push('/(protected)/view-profile')}
          />
          <MenuItem
            icon="settings-outline"
            label="Account settings"
            onPress={() => router.push('/(protected)/account-settings')}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Privacy"
            onPress={() => router.push('/(protected)/privacy')}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help"
            onPress={() => router.push('/(protected)/help')}
          />
        </MenuSection>

        <MenuSection variant="flat">
          <ConfirmDialog
            trigger={<MenuItem icon="log-out-outline" label="Log out" isDestructive />}
            title="Log out?"
            description="You'll need to log in again to access your account."
            confirmLabel="Log out"
            isDestructive
            onConfirm={onLogout}
          />
        </MenuSection>
      </View>
    </CollapsibleScreen>
  );
}
