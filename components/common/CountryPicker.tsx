import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import { getNames } from 'country-list';
import { Ionicons } from '@expo/vector-icons';
import { Input, Label, useThemeColor } from 'heroui-native';
import { Text } from '@/components/common/Text';
import { BackArrow } from '@/components/ui/BackArrow';

const COUNTRIES = getNames().sort((a, b) => a.localeCompare(b));

interface CountryPickerProps {
  label?: string;
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
}

export default function CountryPicker({
  label = 'Country',
  value,
  onChange,
  placeholder = 'Select your country',
}: CountryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [muted] = useThemeColor(['muted']);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRIES.filter((c) => c.toLowerCase().includes(q)) : COUNTRIES;
  }, [query]);

  const select = (country: string) => {
    onChange(country);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <View className="gap-2">
      {label && <Label>{label}</Label>}
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border-field-border bg-field-background flex-row items-center justify-between rounded-xl border px-4 py-3">
        <Text className={value ? 'text-foreground' : 'text-field-placeholder'}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={muted} />
      </Pressable>

      <Modal visible={isOpen} animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <View className="bg-background flex-1 pt-14">
          <View className="mb-3 flex-row items-center gap-3 px-5">
            <BackArrow size={40} onPress={() => setIsOpen(false)} />
            <Text className="text-foreground text-xl font-bold">Select country</Text>
          </View>

          <View className="px-5 pb-3">
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => select(item)}
                className="border-border active:bg-default border-b px-5 py-3.5">
                <Text className="text-foreground text-base">{item}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
