import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button, TextField, Label, Input, Spinner, useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import { useAuthStore } from '@/store/auth';
import { addDependent } from '@/services/dependents.service';

export default function AddDependent() {
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [nhisNumber, setNhisNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isComplete = fullName.trim().length > 0 && relationship.trim().length > 0;

  const onSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await addDependent(user.id, {
      fullName: fullName.trim(),
      relationship: relationship.trim(),
      nhisNumber: nhisNumber.trim() || undefined,
    });
    setIsSaving(false);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't add dependent", description: error });
      return;
    }
    toast.show({ variant: 'success', label: 'Dependent added' });
    router.back();
  };

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-6 mt-2 text-2xl font-bold">Add dependent</Text>

      <View className="gap-4">
        <TextField>
          <Label>Full name</Label>
          <Input value={fullName} onChangeText={setFullName} placeholder="e.g. Ama Mensah" />
        </TextField>
        <TextField>
          <Label>Relationship</Label>
          <Input
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g. Spouse, Child"
          />
        </TextField>
        <TextField>
          <Label>NHIS number (optional)</Label>
          <Input
            value={nhisNumber}
            onChangeText={setNhisNumber}
            autoCapitalize="characters"
            placeholder="e.g. NHIS-000000000"
          />
        </TextField>

        <Button onPress={onSave} isDisabled={!isComplete || isSaving} className="mt-4">
          {isSaving ? <Spinner size="sm" color={onPrimary} /> : 'Add dependent'}
        </Button>
      </View>
    </MainContainer>
  );
}
