import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../utils/designSystem';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  subtitle?: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  subtitle,
  style,
}) => {
  return (
    <View style={{
      backgroundColor: colors.neutral[50],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 56,
    }}>
      {/* Left Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={{
              padding: spacing.sm,
              marginRight: spacing.sm,
              borderRadius: 20,
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={leftIcon as any} size={24} color={colors.neutral[700]} />
          </TouchableOpacity>
        )}
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: typography.sizes.xl,
            fontWeight: '700' as const,
            color: colors.neutral[900],
          }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{
              fontSize: typography.sizes.sm,
              color: colors.neutral[500],
              marginTop: 2,
            }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Section */}
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            padding: spacing.sm,
            borderRadius: 20,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon as any} size={24} color={colors.neutral[700]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header; 