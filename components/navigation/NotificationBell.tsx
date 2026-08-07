import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { useAuthStore } from '@/store/auth';
import { fetchUnreadNotificationCount } from '@/services/notifications.service';

export default function NotificationBell() {
  const [foreground, danger] = useThemeColor(['foreground', 'danger']);
  const userId = useAuthStore((s) => s.user?.id);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchUnreadNotificationCount(userId).then((count) => setHasUnread(count > 0));
  }, [userId]);

  return (
    <Pressable
      onPress={() => router.push('/(protected)/notifications')}
      hitSlop={10}
      className="bg-default h-10 w-10 items-center justify-center rounded-full active:opacity-70">
      <Ionicons name="notifications-outline" size={20} color={foreground} />
      {hasUnread && (
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 9,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: danger,
            borderWidth: 1.5,
            borderColor: '#ffffff',
          }}
        />
      )}
    </Pressable>
  );
}
