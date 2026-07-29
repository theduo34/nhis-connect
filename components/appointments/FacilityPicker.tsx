import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Label, useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import { BackArrow } from '@/components/ui/BackArrow';
import { fetchFacilities, type Facility } from '@/services/facilities.service';

interface FacilityPickerProps {
  label?: string;
  value: Facility | null;
  onChange: (facility: Facility) => void;
  placeholder?: string;
}

export default function FacilityPicker({
  label = 'Facility',
  value,
  onChange,
  placeholder = 'Select a facility',
}: FacilityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [muted] = useThemeColor(['muted']);

  useEffect(() => {
    if (isOpen && facilities.length === 0) {
      fetchFacilities().then(setFacilities);
    }
  }, [isOpen, facilities.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return facilities;
    return facilities.filter(
      (f) => f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q)
    );
  }, [query, facilities]);

  const select = (facility: Facility) => {
    onChange(facility);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <View className="gap-2">
      {label && <Label>{label}</Label>}
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border-field-border bg-field-background flex-row items-center justify-between rounded-xl border px-4 py-3">
        <Text
          className={value ? 'text-foreground flex-1' : 'text-field-placeholder flex-1'}
          numberOfLines={1}>
          {value ? value.name : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={muted} />
      </Pressable>

      <Modal visible={isOpen} animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <View className="bg-background flex-1 pt-14">
          <View className="mb-3 flex-row items-center gap-3 px-5">
            <BackArrow size={40} onPress={() => setIsOpen(false)} />
            <Text className="text-foreground text-xl font-bold">Select facility</Text>
          </View>

          <View className="px-5 pb-3">
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name or region"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => select(item)}
                className="border-border active:bg-default border-b px-5 py-3.5">
                <Text className="text-foreground text-base font-semibold">{item.name}</Text>
                <Text className="text-muted mt-0.5 text-xs">
                  {item.address} · {item.region}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text className="text-muted mt-8 text-center text-sm">No facilities found.</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
}
