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
import { loginSchema, type LoginFormData } from '@/lib/validation';
import { useAuthStore } from '@/store/auth';

export default function Login() {
  const signIn = useAuthStore((s) => s.signIn);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.show({ variant: 'danger', label: 'Couldn’t log in', description: error });
      return;
    }
    router.replace('/');
  };

  return (
    <MainContainer contentContainerClassName="flex-1 justify-center">
      <AuthHeader title="Welcome back" subtitle="Log in to continue to NHIS Connect." />

      <View className="gap-4">
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
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              error={errors.password}
            />
          )}
        />

        <Link href="/(auth)/forgot-password" className="self-end">
          <Text className="text-primary text-sm font-semibold">Forgot password?</Text>
        </Link>
      </View>

      <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting} className="mt-8">
        {isSubmitting ? <Spinner size="sm" color={onPrimary} /> : 'Log in'}
      </Button>

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-muted">Don&apos;t have an account?</Text>
        <Link href="/(auth)/register">
          <Text className="text-primary font-semibold">Create one</Text>
        </Link>
      </View>
    </MainContainer>
  );
}
