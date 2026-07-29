import { View } from 'react-native';
import { Link } from 'expo-router';
import { Button, TextField, Label, Input } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import AuthHeader from '@/components/auth/AuthHeader';
import { BackArrow } from '@/components/ui/BackArrow';

export default function ForgotPassword() {
  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>

      <View className="flex-1 justify-center">
        <AuthHeader
          title="Forgot password?"
          subtitle="Enter the email on your account and we'll send you a link to reset your password."
        />

        <View className="gap-4">
          <TextField>
            <Label>Email</Label>
            <Input
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </TextField>
        </View>

        <Button className="mt-8">Send reset link</Button>

        <View className="mt-6 flex-row justify-center gap-1">
          <Text className="text-muted">Remembered your password?</Text>
          <Link href="/(auth)/login">
            <Text className="text-primary font-semibold">Log in</Text>
          </Link>
        </View>
      </View>
    </MainContainer>
  );
}
