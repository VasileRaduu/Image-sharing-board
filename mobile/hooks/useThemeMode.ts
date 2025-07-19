import { Appearance, ColorSchemeName } from 'react-native';
import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  border: {
    primary: string;
    accent: string;
  };
  interactive: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
  };
}

export const lightTheme: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    card: '#ffffff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    inverse: '#ffffff',
  },
  border: {
    primary: '#e2e8f0',
    accent: '#3b82f6',
  },
  interactive: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#22c55e',
    error: '#ef4444',
  },
};

export const darkTheme: ThemeColors = {
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    card: '#1e293b',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    inverse: '#0f172a',
  },
  border: {
    primary: '#334155',
    accent: '#60a5fa',
  },
  interactive: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    success: '#4ade80',
    error: '#f87171',
  },
};

export const useThemeMode = (initialThemeMode: ThemeMode = 'system') => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialThemeMode);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  return {
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };
}; 