import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyles = () => {
    const baseStyle = {
      backgroundColor: colors.neutral[50],
      borderLeftWidth: 4,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      ...shadows.md,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          borderLeftColor: colors.success[500],
          backgroundColor: colors.success[50],
        };
      case 'error':
        return {
          ...baseStyle,
          borderLeftColor: colors.error[500],
          backgroundColor: colors.error[50],
        };
      case 'warning':
        return {
          ...baseStyle,
          borderLeftColor: colors.warning[500],
          backgroundColor: colors.warning[50],
        };
      default:
        return {
          ...baseStyle,
          borderLeftColor: colors.primary[500],
          backgroundColor: colors.primary[50],
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return colors.success[500];
      case 'error':
        return colors.error[500];
      case 'warning':
        return colors.warning[500];
      default:
        return colors.primary[500];
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        getToastStyles(),
        {
          transform: [{ translateY }],
          opacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        },
      ]}
    >
      <Ionicons name={getIcon() as any} size={24} color={getIconColor()} />
      <Text
        style={{
          flex: 1,
          marginLeft: spacing.sm,
          fontSize: 16,
          color: colors.neutral[900],
          fontWeight: '500' as const,
        }}
      >
        {message}
      </Text>
      <TouchableOpacity onPress={hideToast} style={{ padding: spacing.xs }}>
        <Ionicons name="close" size={20} color={colors.neutral[500]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast; 