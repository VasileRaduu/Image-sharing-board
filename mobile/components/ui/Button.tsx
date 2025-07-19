import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../utils/designSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.neutral[300] : colors.primary[500],
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.neutral[200] : colors.neutral[100],
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.neutral[300] : colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.neutral[300] : colors.error[500],
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          minHeight: 56,
        };
      default: // medium
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          minHeight: 44,
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.neutral[400];
    
    switch (variant) {
      case 'primary':
      case 'danger':
        return 'white';
      case 'secondary':
        return colors.neutral[700];
      case 'outline':
        return colors.primary[500];
      case 'ghost':
        return colors.primary[500];
      default:
        return 'white';
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'small':
        return typography.sizes.sm;
      case 'large':
        return typography.sizes.lg;
      default:
        return typography.sizes.base;
    }
  };

  return (
    <TouchableOpacity
      style={[getVariantStyles(), getSizeStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? 'white' : colors.primary[500]} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: getTextSize(),
                fontWeight: '600' as const,
                marginLeft: icon && iconPosition === 'left' ? spacing.sm : 0,
                marginRight: icon && iconPosition === 'right' ? spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button; 