import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Button, TextField, Label, Input, Spinner, useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import CountryPicker from '@/components/common/CountryPicker';
import { useAuthStore } from '@/store/auth';
import { fetchProfileDetails, updateAccountSettings } from '@/services/profile.service';

export default function AccountSettings() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfileDetails(user.id).then((details) => {
      if (details) {
        setName(details.name);
        setPhone(details.phone ?? '');
        setRegion(details.region ?? '');
        setCountry(details.country ?? '');
      }
      setIsLoading(false);
    });
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await updateAccountSettings(user.id, {
      name: name.trim(),
      phone: phone.trim(),
      region: region.trim(),
      country: country.trim(),
    });
    if (!error) await refreshUser();
    setIsSaving(false);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't save changes", description: error });
      return;
    }
    toast.show({ variant: 'success', label: 'Saved' });
    router.back();
  };

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-6 mt-2 text-2xl font-bold">Account settings</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View className="gap-4">
          <TextField>
            <Label>Full name</Label>
            <Input value={name} onChangeText={setName} />
          </TextField>
          <TextField>
            <Label>Phone number</Label>
            <Input
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="024 000 0000"
            />
          </TextField>
          <TextField>
            <Label>Region</Label>
            <Input value={region} onChangeText={setRegion} placeholder="e.g. Greater Accra" />
          </TextField>
          <CountryPicker value={country} onChange={setCountry} />

          <Button onPress={onSave} isDisabled={isSaving} className="mt-4">
            {isSaving ? <Spinner size="sm" color={onPrimary} /> : 'Save changes'}
          </Button>
        </View>
      )}
    </MainContainer>
  );
}
