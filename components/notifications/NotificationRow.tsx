import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import type { AppNotification, NotificationType } from '@/services/notifications.service';

const ICONS: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  renewal_approved: 'checkmark-circle-outline',
  renewal_rejected: 'close-circle-outline',
  appointment_booked: 'calendar-outline',
  general: 'notifications-outline',
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationRow({ notification }: { notification: AppNotification }) {
  const [accent] = useThemeColor(['accent']);

  return (
    <View
      className="mb-3 flex-row items-start gap-3 rounded-2xl bg-white p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        opacity: notification.isRead ? 0.6 : 1,
      }}>
      <View className="bg-accent-soft h-9 w-9 items-center justify-center rounded-full">
        <Ionicons name={ICONS[notification.type]} size={18} color={accent} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-semibold">{notification.title}</Text>
        <Text className="text-muted mt-0.5 text-xs">{notification.body}</Text>
        <Text className="text-muted mt-1 text-[11px]">{formatDate(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && (
        <View
          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent, marginTop: 4 }}
        />
      )}
    </View>
  );
}
