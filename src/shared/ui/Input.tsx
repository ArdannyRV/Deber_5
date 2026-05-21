import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Input as TamaguiInput } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/src/core/styles/theme';

interface InputProps {
  label:            string;
  value:            string;
  onChangeText:     (text: string) => void;
  placeholder?:     string;
  isPassword?:      boolean;
  keyboardType?:    'default' | 'email-address';
  error?:           string;
  autoCapitalize?:  'none' | 'sentences' | 'words' | 'characters';
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword,
  keyboardType = 'default',
  error,
  autoCapitalize,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <YStack gap={6} marginBottom={16}>
      <Text fontSize={13} fontWeight="600" color={theme.colors.textMid}>
        {label}
      </Text>

      <XStack
        alignItems="center"
        borderWidth={1.5}
        borderColor={borderColor}
        borderRadius={theme.radius.md}
        backgroundColor={theme.colors.inputBg}
      >
        <TamaguiInput
          flex={1}
          height={52}
          paddingHorizontal={16}
          fontSize={15}
          color={theme.colors.text}
          placeholderTextColor={theme.colors.textMuted as any}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          borderWidth={0}
          backgroundColor="transparent"
          unstyled
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ paddingRight: 16 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </XStack>

      {error ? (
        <Text fontSize={12} color={theme.colors.danger}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}
