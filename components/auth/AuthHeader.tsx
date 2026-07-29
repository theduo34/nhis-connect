import { View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/common/Text';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8 items-center gap-4">
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: 104, height: 104, borderRadius: 24 }}
        contentFit="contain"
      />
      <View className="items-center gap-1">
        <Text className="text-foreground text-2xl font-bold">{title}</Text>
        {subtitle && <Text className="text-muted text-center">{subtitle}</Text>}
      </View>
    </View>
  );
}
