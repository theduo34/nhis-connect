import { View } from 'react-native';
import { router, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  TextField,
  Label,
  Input,
  FieldError,
  Spinner,
  useThemeColor,
  useToast,
} from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import AuthHeader from '@/components/auth/AuthHeader';
import PasswordField from '@/components/auth/PasswordField';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { useAuthStore } from '@/store/auth';

export default function Register() {
  const signUp = useAuthStore((s) => s.signUp);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { error, delivered, devCode } = await signUp(data.name, data.email, data.password);
    if (error) {
      toast.show({ variant: 'danger', label: 'Couldn’t create account', description: error });
      return;
    }
    if (delivered === false) {
      toast.show({
        variant: 'warning',
        label: 'Account created',
        description: devCode
          ? `Email sending isn't set up yet — use code ${devCode} to verify.`
          : "We couldn't confirm the code email was sent — try Resend on the next screen.",
        duration: 'persistent',
      });
    } else {
      toast.show({ variant: 'success', label: 'Code sent', description: `Check ${data.email}` });
    }
    router.push({ pathname: '/(auth)/otp', params: { email: data.email } });
  };

  return (
    <MainContainer contentContainerClassName="flex-1 justify-center">
      <AuthHeader title="Create your account" subtitle="Sign up to manage your NHIS membership." />

      <View className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <TextField isInvalid={!!errors.name}>
              <Label>Full name</Label>
              <Input
                placeholder="Ama Mensah"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextField isInvalid={!!errors.email}>
              <Label>Email</Label>
              <Input
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <PasswordField
              label="Password"
              autoComplete="password-new"
              value={value}
              onChangeText={onChange}
              error={errors.password}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <PasswordField
              label="Confirm password"
              autoComplete="password-new"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword}
            />
          )}
        />
      </View>

      <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting} className="mt-8">
        {isSubmitting ? <Spinner size="sm" color={onPrimary} /> : 'Create account'}
      </Button>

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-muted">Already have an account?</Text>
        <Link href="/(auth)/login">
          <Text className="text-primary font-semibold">Log in</Text>
        </Link>
      </View>
    </MainContainer>
  );
}
