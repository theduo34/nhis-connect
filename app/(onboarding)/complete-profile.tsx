import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button, TextField, Label, Input, Spinner, useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import Steps from '@/components/ui/Steps';
import DateField from '@/components/onboarding/DateField';
import GenderSelector, { type Gender } from '@/components/onboarding/GenderSelector';
import CountryPicker from '@/components/common/CountryPicker';
import { updateProfileDetails } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth';

function toIsoDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function CompleteProfile() {
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');

  const [nhisNumber, setNhisNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [country, setCountry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isComplete =
    nhisNumber.trim().length > 0 && !!dateOfBirth && !!gender && country.trim().length > 0;

  const continueToApp = async () => {
    if (!user || !dateOfBirth || !gender) return;
    setIsSaving(true);
    const { error } = await updateProfileDetails(user.id, {
      nhisNumber: nhisNumber.trim(),
      dateOfBirth: toIsoDate(dateOfBirth),
      gender,
      country,
    });
    setIsSaving(false);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't save your details", description: error });
      return;
    }
    router.replace('/(protected)/(subscriber)/(tabs)/home');
  };

  return (
    <MainContainer contentContainerClassName="flex-1 pt-6">
      <Steps currentStep={1} totalSteps={2} label="Complete your profile" />

      <Text className="text-muted mb-6 text-sm">
        A few details to link your NHIS membership to this account.
      </Text>

      <View className="gap-4">
        <TextField>
          <Label>NHIS number</Label>
          <Input
            placeholder="e.g. NHIS-000000000"
            autoCapitalize="characters"
            value={nhisNumber}
            onChangeText={setNhisNumber}
          />
        </TextField>

        <DateField
          label="Date of birth"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          maximumDate={new Date()}
        />

        <GenderSelector value={gender} onChange={setGender} />

        <CountryPicker value={country} onChange={setCountry} />
      </View>

      <Button onPress={continueToApp} isDisabled={!isComplete || isSaving} className="mt-8">
        {isSaving ? <Spinner size="sm" color={onPrimary} /> : 'Continue'}
      </Button>
    </MainContainer>
  );
}
