import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, ThemeColors, ThemeName } from '../constants/colors';

const STORAGE_KEY = 'psymap-theme';

interface ThemeContextValue {
  colors: ThemeColors;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Themes.dracula,
  themeName: 'dracula',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('dracula');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && (stored === 'dark' || stored === 'light' || stored === 'dracula')) {
          setThemeName(stored);
        }
      } catch {
        // keep default
      }
    })();
  }, []);

  const setTheme = useCallback(async (name: ThemeName) => {
    setThemeName(name);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, name);
    } catch {
      // ignore storage error
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ colors: Themes[themeName] as ThemeColors, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
