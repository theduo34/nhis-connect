import { View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';

export default function Landing() {
  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-1 items-center justify-center gap-4">
        <Image
          source={require('../../assets/images/icon.png')}
          style={{ width: 96, height: 96, borderRadius: 20 }}
          contentFit="contain"
        />
        <Text className="text-foreground text-3xl font-bold">NHIS Connect</Text>
        <Text className="text-muted text-center">
          Renew your NHIS membership and book appointments, all in one place.
        </Text>
      </View>

      <View className="gap-3 pb-8">
        <Button onPress={() => router.push('/(auth)/register')}>Create account</Button>
        <Button variant="outline" onPress={() => router.push('/(auth)/login')}>
          Log in
        </Button>
      </View>
    </MainContainer>
  );
}
