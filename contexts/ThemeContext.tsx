import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, ThemeColors, ThemeName, EmojiPack } from '../constants/colors';

const STORAGE_KEY = 'psymap-theme';

interface ThemeContextValue {
  colors: ThemeColors;
  themeName: ThemeName;
  emojiPack: EmojiPack;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Themes.light,
  themeName: 'light',
  emojiPack: Themes.light.emojiPack,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && stored in Themes) {
          setThemeName(stored as ThemeName);
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

  const current = Themes[themeName] as ThemeColors;

  return (
    <ThemeContext.Provider
      value={{
        colors: current,
        themeName,
        emojiPack: current.emojiPack,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
