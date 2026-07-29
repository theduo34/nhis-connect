import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'heroui-native';

export default function AddAppointmentButton() {
  const [foreground] = useThemeColor(['foreground']);

  return (
    <Pressable
      onPress={() => router.push('/(protected)/book-appointment')}
      hitSlop={10}
      className="bg-default h-10 w-10 items-center justify-center rounded-full active:opacity-70">
      <Ionicons name="add" size={22} color={foreground} />
    </Pressable>
  );
}
