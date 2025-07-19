import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode, ThemeMode } from '../hooks/useThemeMode';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showLabel = false 
}) => {
  const { themeMode, toggleTheme, isDark } = useThemeMode();

  const getIconName = () => {
    if (themeMode === 'system') {
      return isDark ? 'moon' : 'sunny';
    }
    return themeMode === 'dark' ? 'moon' : 'sunny';
  };

  const getLabel = () => {
    if (themeMode === 'system') {
      return isDark ? 'Dark' : 'Light';
    }
    return themeMode === 'dark' ? 'Dark' : 'Light';
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const padding = size === 'small' ? 8 : size === 'large' ? 16 : 12;

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        { padding },
        { backgroundColor: isDark ? '#1e293b' : '#f8fafc' }
      ]}
      accessibilityLabel={`Switch to ${getLabel()} mode`}
      accessibilityRole="button"
    >
      <Ionicons 
        name={getIconName() as any} 
        size={iconSize} 
        color={isDark ? '#60a5fa' : '#3b82f6'} 
      />
      {showLabel && (
        <Text style={[
          styles.label,
          { color: isDark ? '#cbd5e1' : '#475569' }
        ]}>
          {getLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
}); 