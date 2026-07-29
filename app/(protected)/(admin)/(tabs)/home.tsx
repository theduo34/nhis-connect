import { View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import ShortcutCard from '@/components/profile/ShortcutCard';
import WideShortcutCard from '@/components/profile/WideShortcutCard';

export default function AdminHome() {
  const [muted] = useThemeColor(['muted']);

  return (
    <CollapsibleScreen title="Home">
      <View className="flex-row gap-3">
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

      <View className="mt-8">
        <Text className="text-foreground mb-3 text-lg font-bold">Recent activity</Text>
        <View
          className="items-center gap-3 rounded-2xl bg-white px-6 py-8"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 1,
          }}>
          <Ionicons name="time-outline" size={32} color={muted} />
          <Text className="text-muted text-center text-sm">
            Renewal and appointment activity will show up here as subscribers submit them.
          </Text>
        </View>
      </View>

      <View className="mt-6">
        <WideShortcutCard
          icon="help-buoy-outline"
          title="Need help managing the platform?"
          description="Get answers to common questions"
          onPress={() => router.push('/(protected)/help')}
        />
      </View>
    </CollapsibleScreen>
  );
}
