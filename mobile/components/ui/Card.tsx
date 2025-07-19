import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../utils/designSystem';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
}) => {
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.neutral[50],
      borderRadius: borderRadius.lg,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.neutral[200],
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: colors.neutral[100],
        };
      default:
        return {
          ...baseStyle,
          ...shadows.sm,
        };
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: spacing.sm };
      case 'large':
        return { padding: spacing.lg };
      default: // medium
        return { padding: spacing.md };
    }
  };

  const getMarginStyles = (): ViewStyle => {
    switch (margin) {
      case 'none':
        return {};
      case 'small':
        return { margin: spacing.sm };
      case 'large':
        return { margin: spacing.lg };
      default: // medium
        return { margin: spacing.md };
    }
  };

  return (
    <View style={[getVariantStyles(), getPaddingStyles(), getMarginStyles(), style]}>
      {children}
    </View>
  );
};

export default Card; 