import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import {
  Button,
  InputOTP,
  REGEXP_ONLY_DIGITS,
  Spinner,
  useThemeColor,
  useToast,
} from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import AuthHeader from '@/components/auth/AuthHeader';
import { BackArrow } from '@/components/ui/BackArrow';
import { useAuthStore } from '@/store/auth';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function Otp() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const user = useAuthStore((s) => s.user);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const signOut = useAuthStore((s) => s.signOut);
  const onPrimary = useThemeColor('accent-foreground');
  const { toast } = useToast();

  const email = user?.email ?? emailParam;

  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!email) {
    return <Redirect href="/(auth)/register" />;
  }

  const verify = async () => {
    setIsVerifying(true);
    const { error } = await verifyOtp(code);
    setIsVerifying(false);
    if (error) {
      toast.show({ variant: 'danger', label: 'Invalid code', description: error });
      return;
    }
    toast.show({ variant: 'success', label: 'Email verified' });
    router.replace('/(onboarding)/complete-profile');
  };

  const resend = async () => {
    setIsResending(true);
    const { error, delivered, devCode } = await resendOtp();
    setIsResending(false);
    if (error) {
      toast.show({ variant: 'danger', label: 'Couldn’t resend code', description: error });
      return;
    }
    setCode('');
    setCooldown(RESEND_COOLDOWN_SECONDS);
    toast.show({
      variant: delivered === false ? 'warning' : 'success',
      label: delivered === false ? 'Code regenerated' : 'Code sent',
      description: devCode
        ? `Email sending isn't set up yet — use code ${devCode} to verify.`
        : delivered === false
          ? 'Delivery is unconfirmed — check spam, or try again shortly.'
          : `Check ${email}`,
      duration: devCode ? 'persistent' : undefined,
    });
  };

  const onSignOut = async () => {
    await signOut();
    router.replace('/(landing)/welcome');
  };

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>

      <View className="flex-1 justify-center">
        <AuthHeader
          title="Verify your email"
          subtitle={`Enter the ${OTP_LENGTH}-digit code we sent to ${email}.`}
        />

        <InputOTP
          maxLength={OTP_LENGTH}
          value={code}
          onChange={setCode}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          className="self-center">
          <InputOTP.Group>
            {Array.from({ length: OTP_LENGTH }, (_, i) => (
              <InputOTP.Slot key={i} index={i} />
            ))}
          </InputOTP.Group>
        </InputOTP>

        <Button
          onPress={verify}
          isDisabled={code.length < OTP_LENGTH || isVerifying}
          className="mt-8">
          {isVerifying ? <Spinner size="sm" color={onPrimary} /> : 'Verify'}
        </Button>

        <View className="mt-6 flex-row justify-center gap-1">
          <Text className="text-muted">Didn&apos;t get a code?</Text>
          {cooldown > 0 ? (
            <Text className="text-muted">Resend in {cooldown}s</Text>
          ) : (
            <Text className="text-primary font-semibold" onPress={isResending ? undefined : resend}>
              {isResending ? 'Sending…' : 'Resend'}
            </Text>
          )}
        </View>

        <Text className="text-muted mt-4 text-center text-sm" onPress={onSignOut}>
          Not you? Sign out
        </Text>
      </View>
    </MainContainer>
  );
}
