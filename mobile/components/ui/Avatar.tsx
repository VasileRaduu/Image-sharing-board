import React from 'react';
import { View, Image, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, borderRadius, typography } from '../../utils/designSystem';

interface AvatarProps {
  source?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  loading?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'md',
  fallback,
  loading = false,
  style,
  onPress,
}) => {
  const getSizeStyles = () => {
    const sizes = {
      xs: 24,
      sm: 32,
      md: 48,
      lg: 64,
      xl: 96,
      '2xl': 128,
    };
    
    const sizeValue = sizes[size];
    return {
      width: sizeValue,
      height: sizeValue,
      borderRadius: sizeValue / 2,
    };
  };

  const getTextSize = () => {
    const textSizes = {
      xs: typography.sizes.xs,
      sm: typography.sizes.sm,
      md: typography.sizes.base,
      lg: typography.sizes.lg,
      xl: typography.sizes.xl,
      '2xl': typography.sizes['2xl'],
    };
    return textSizes[size];
  };

  const getFallbackText = () => {
    if (!fallback) return '?';
    return fallback.charAt(0).toUpperCase();
  };

  const getFallbackColor = () => {
    if (!fallback) return colors.neutral[400];
    
    // Simple hash function for consistent colors
    let hash = 0;
    for (let i = 0; i < fallback.length; i++) {
      hash = fallback.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colorOptions = [
      colors.primary[500],
      colors.success[500],
      colors.warning[500],
      colors.error[500],
      colors.secondary[500],
    ];
    
    return colorOptions[Math.abs(hash) % colorOptions.length];
  };

  const containerStyle = {
    ...getSizeStyles(),
    backgroundColor: source ? 'transparent' : getFallbackColor(),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };

  if (loading) {
    return (
      <View style={[containerStyle, style]}>
        <ActivityIndicator size="small" color={colors.neutral[400]} />
      </View>
    );
  }

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={getSizeStyles()}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={{
          color: 'white',
          fontSize: getTextSize(),
          fontWeight: '600' as const,
        }}
      >
        {getFallbackText()}
      </Text>
    </View>
  );
};

export default Avatar; 