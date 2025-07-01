// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme, AppTheme } from './theme';

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  forceDarkMode?: boolean;
}

export function ThemeProvider({ children, forceDarkMode }: ThemeProviderProps) {
  const [manualDark, setManualDark] = useState<boolean | null>(null);
  
  // Otomatik dark mode'u devre dışı bırak - sadece manuel kontrol
  const getAutoDarkMode = () => {
    return false; // Her zaman light mode kullan
  };

  // Tema belirleme mantığı - sadece manuel seçim veya forceDarkMode
  const isDark = forceDarkMode ?? 
                 manualDark ?? 
                 false; // Default olarak her zaman light mode
  
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setManualDark(prev => prev === null ? true : !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
