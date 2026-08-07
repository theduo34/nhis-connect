import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Input, Label } from 'heroui-native';

interface RejectReasonDialogProps {
  trigger: ReactNode;
  onConfirm: (reason: string) => void;
}

export default function RejectReasonDialog({ trigger, onConfirm }: RejectReasonDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');

  const openDialog = () => setIsOpen(true);
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onPress?: () => void }>, { onPress: openDialog })
    : trigger;

  const confirm = () => {
    setIsOpen(false);
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <>
      {triggerElement}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Reject renewal request</Dialog.Title>
            <Dialog.Description>Let the subscriber know why this was rejected.</Dialog.Description>
            <View className="mt-4 gap-2">
              <Label>Reason</Label>
              <Input
                value={reason}
                onChangeText={setReason}
                placeholder="e.g. Documents unclear, please resubmit"
              />
            </View>
            <View className="mt-6 flex-row gap-3">
              <Button variant="outline" className="flex-1" onPress={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                isDisabled={reason.trim().length === 0}
                onPress={confirm}>
                Reject
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
