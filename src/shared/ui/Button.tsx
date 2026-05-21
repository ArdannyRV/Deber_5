import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { theme } from '@/src/core/styles/theme';

interface ButtonProps {
  label:      string;
  onPress:    () => void;
  isLoading?: boolean;
  variant?:   'primary' | 'ghost' | 'danger';
  disabled?:  boolean;
}

const bgMap = {
  primary: theme.colors.primary,
  ghost:   'transparent',
  danger:  theme.colors.danger,
} as const;

const borderMap = {
  primary: theme.colors.primary,
  ghost:   theme.colors.primary,
  danger:  theme.colors.danger,
} as const;

const textColorMap = {
  primary: '#FFFFFF',
  ghost:   theme.colors.primary,
  danger:  '#FFFFFF',
} as const;

export default function Button({
  label,
  onPress,
  isLoading,
  variant = 'primary',
  disabled,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={{
        height: 52,
        borderRadius: theme.radius.md,
        width: '100%',
        backgroundColor: bgMap[variant],
        borderWidth: variant === 'ghost' ? 1.5 : 0,
        borderColor: borderMap[variant],
        opacity: isDisabled ? 0.5 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={textColorMap[variant]} size="small" />
      ) : (
        <Text
          style={{
            color: textColorMap[variant],
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
