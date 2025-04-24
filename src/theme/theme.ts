import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

type ColorMode = 'light' | 'dark';

const COLORS = {
  primary: '#007AFF',
  secondary: '#FF9500',
  error: '#FF3B30',
  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  surface: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  text: {
    light: '#000000',
    dark: '#FFFFFF',
  },
  disabled: {
    light: '#C7C7CC',
    dark: '#3A3A3C',
  },
  placeholder: {
    light: '#8E8E93',
    dark: '#8E8E93',
  },
};

export const getTheme = (colorMode: ColorMode) => {
  const baseTheme = colorMode === 'light' ? MD3LightTheme : MD3DarkTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      error: COLORS.error,
      background: COLORS.background[colorMode],
      surface: COLORS.surface[colorMode],
      text: COLORS.text[colorMode],
      disabled: COLORS.disabled[colorMode],
      placeholder: COLORS.placeholder[colorMode],
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 40,
    },
    borderRadius: {
      s: 4,
      m: 8, 
      l: 16,
      xl: 24,
    },
  };
};

export const lightTheme = getTheme('light');
export const darkTheme = getTheme('dark');

export default {
  lightTheme,
  darkTheme,
}; 