import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';

export default function Notifications() {
  const [muted] = useThemeColor(['muted']);

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-2 mt-2 text-2xl font-bold">Notifications</Text>
      <View className="flex-1 items-center justify-center gap-3 pb-24">
        <Ionicons name="notifications-outline" size={40} color={muted} />
        <Text className="text-muted text-center">
          You&apos;re all caught up — no notifications yet.
        </Text>
      </View>
    </MainContainer>
  );
}
