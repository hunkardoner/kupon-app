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
  
  // Otomatik dark mode için saat kontrolü
  const getAutoDarkMode = () => {
    const hour = new Date().getHours();
    return hour >= 21 || hour < 6; // 21:00 - 06:00 arası dark mode
  };

  useEffect(() => {
    // Eğer manuel tema seçimi yoksa, otomatik kontrolü başlat
    if (manualDark === null && !forceDarkMode) {
      const interval = setInterval(() => {
        // Her dakika kontrol et (gerçek uygulamada daha optimize edilebilir)
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [manualDark, forceDarkMode]);

  // Tema belirleme mantığı
  const isDark = forceDarkMode ?? 
                 manualDark ?? 
                 getAutoDarkMode(); // Default olarak light, sadece akşam saatlerinde dark
  
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setManualDark(prev => prev === null ? !getAutoDarkMode() : !prev);
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
