import { useState } from 'react';
import { Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Label } from 'heroui-native';
import { Text } from '@/components/common/Text';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

export default function DateField({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  maximumDate,
  minimumDate,
}: DateFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Pressable
        onPress={() => setIsPickerOpen(true)}
        className="border-field-border bg-field-background rounded-xl border px-4 py-3">
        <Text className={value ? 'text-foreground' : 'text-field-placeholder'}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>
      {isPickerOpen && (
        <DateTimePicker
          value={value ?? minimumDate ?? new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={(_event, selectedDate) => {
            setIsPickerOpen(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
