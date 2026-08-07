import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import NotificationRow from '@/components/notifications/NotificationRow';
import { useAuthStore } from '@/store/auth';
import {
  fetchNotifications,
  markAllNotificationsRead,
  type AppNotification,
} from '@/services/notifications.service';

export default function Notifications() {
  const user = useAuthStore((s) => s.user);
  const [muted] = useThemeColor(['muted']);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id).then((data) => {
      setNotifications(data);
      setIsLoading(false);
      // Viewing the list is the read receipt — no per-item tap needed.
      if (data.some((n) => !n.isRead)) markAllNotificationsRead(user.id);
    });
  }, [user]);

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-2 mt-2 text-2xl font-bold">Notifications</Text>

      {!isLoading && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 pb-24">
          <Ionicons name="notifications-outline" size={40} color={muted} />
          <Text className="text-muted text-center">
            You&apos;re all caught up — no notifications yet.
          </Text>
        </View>
      ) : (
        <View className="mt-2">
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </View>
      )}
    </MainContainer>
  );
}
