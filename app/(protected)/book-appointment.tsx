import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button, TextField, Label, Input, Spinner, useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import DateField from '@/components/onboarding/DateField';
import FacilityPicker from '@/components/appointments/FacilityPicker';
import { useAuthStore } from '@/store/auth';
import { createAppointment } from '@/services/appointments.service';
import type { Facility } from '@/services/facilities.service';

function toIsoDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookAppointment() {
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');

  const [facility, setFacility] = useState<Facility | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isComplete = !!facility && !!date && time.trim().length > 0;

  const onSave = async () => {
    if (!user || !facility || !date) return;
    setIsSaving(true);
    const { error } = await createAppointment(user.id, {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityAddress: facility.address,
      date: toIsoDate(date),
      time: time.trim(),
    });
    setIsSaving(false);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't book appointment", description: error });
      return;
    }
    toast.show({ variant: 'success', label: 'Appointment booked' });
    router.back();
  };

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-6 mt-2 text-2xl font-bold">Book appointment</Text>

      <View className="gap-4">
        <FacilityPicker value={facility} onChange={setFacility} />

        <DateField
          label="Date"
          value={date}
          onChange={setDate}
          placeholder="Select a date"
          minimumDate={new Date()}
        />

        <TextField>
          <Label>Time</Label>
          <Input value={time} onChangeText={setTime} placeholder="e.g. 10:00 AM" />
        </TextField>

        <Button onPress={onSave} isDisabled={!isComplete || isSaving} className="mt-4">
          {isSaving ? <Spinner size="sm" color={onPrimary} /> : 'Book appointment'}
        </Button>
      </View>
    </MainContainer>
  );
}
