import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import { fetchFacilities, type Facility } from '@/services/facilities.service';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [accent] = useThemeColor(['accent']);

  useEffect(() => {
    fetchFacilities().then(setFacilities);
  }, []);

  return (
    <CollapsibleScreen title="Facilities">
      <Text className="text-muted mb-4 text-sm">{facilities.length} accredited facilities</Text>

      {facilities.map((facility) => (
        <View
          key={facility.id}
          className="mb-3 flex-row items-center gap-4 rounded-2xl bg-white p-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 1,
          }}>
          <View className="bg-accent-soft h-11 w-11 items-center justify-center rounded-full">
            <Ionicons name="business-outline" size={20} color={accent} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-base font-semibold">{facility.name}</Text>
            <Text className="text-muted mt-0.5 text-xs">
              {facility.address} · {facility.region}
            </Text>
          </View>
        </View>
      ))}
    </CollapsibleScreen>
  );
}
