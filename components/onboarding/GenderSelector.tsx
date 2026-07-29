import { Pressable, View } from 'react-native';
import { Label } from 'heroui-native';
import { Text } from '@/components/common/Text';

export type Gender = 'male' | 'female' | 'prefer_not_to_say';

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

interface GenderSelectorProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <View className="gap-2">
      <Label>Gender</Label>
      <View className="flex-row flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className={
                isSelected
                  ? 'bg-primary rounded-full px-4 py-2'
                  : 'bg-default rounded-full px-4 py-2'
              }>
              <Text
                className={
                  isSelected
                    ? 'text-primary-foreground text-sm font-semibold'
                    : 'text-foreground text-sm'
                }>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
