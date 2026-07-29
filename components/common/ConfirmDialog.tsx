import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { View } from 'react-native';
import { Button, Dialog } from 'heroui-native';

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onPress?: () => void }>, { onPress: openDialog })
    : trigger;

  const confirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <>
      {triggerElement}
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>{title}</Dialog.Title>
            {description && <Dialog.Description>{description}</Dialog.Description>}
            <View className="mt-6 flex-row gap-3">
              <Button variant="outline" className="flex-1" onPress={() => setIsOpen(false)}>
                {cancelLabel}
              </Button>
              <Button
                variant={isDestructive ? 'danger' : 'primary'}
                className="flex-1"
                onPress={confirm}>
                {confirmLabel}
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
