import { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField, Label, InputGroup, FieldError, useThemeColor } from 'heroui-native';
import type { FieldError as RHFFieldError } from 'react-hook-form';

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: RHFFieldError;
  autoComplete?: 'password' | 'password-new';
}

export default function PasswordField({
  label,
  placeholder = '••••••••',
  value,
  onChangeText,
  error,
  autoComplete,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const mutedColor = useThemeColor('muted');

  return (
    <TextField isInvalid={!!error}>
      <Label>{label}</Label>
      <InputGroup>
        <InputGroup.Input
          placeholder={placeholder}
          secureTextEntry={!isVisible}
          autoComplete={autoComplete}
          value={value}
          onChangeText={onChangeText}
        />
        <InputGroup.Suffix className="pr-4">
          <Pressable onPress={() => setIsVisible((v) => !v)} hitSlop={8}>
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={mutedColor}
            />
          </Pressable>
        </InputGroup.Suffix>
      </InputGroup>
      {error && <FieldError>{error.message}</FieldError>}
    </TextField>
  );
}
