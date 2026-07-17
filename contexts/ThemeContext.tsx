import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Themes, ThemeColors, ThemeName, EmojiPack } from '../constants/colors';

const STORAGE_KEY = 'psymap-theme';
const UNLOCKED_KEY = 'psymap-unlocked-themes';
const STORE_CHANNEL = (Constants.expoConfig?.extra?.STORE_CHANNEL as string) || 'gitlab';

interface ThemeContextValue {
  colors: ThemeColors;
  themeName: ThemeName;
  emojiPack: EmojiPack;
  channel: string;
  unlockedThemes: ThemeName[];
  isUnlocked: (name: ThemeName) => boolean;
  setTheme: (name: ThemeName) => void;
  unlockTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Themes.dracula,
  themeName: 'dracula',
  emojiPack: Themes.dracula.emojiPack,
  channel: 'gitlab',
  unlockedThemes: [],
  isUnlocked: () => true,
  setTheme: () => {},
  unlockTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('dracula');
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeName[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && stored in Themes) {
          setThemeName(stored as ThemeName);
        }
        const unlocked = await AsyncStorage.getItem(UNLOCKED_KEY);
        if (unlocked) {
          setUnlockedThemes(JSON.parse(unlocked));
        }
      } catch {
        // keep default
      }
    })();
  }, []);

  const isUnlocked = useCallback(
    (name: ThemeName) => STORE_CHANNEL !== 'play' || !Themes[name].premium || unlockedThemes.includes(name),
    [unlockedThemes],
  );

  const setTheme = useCallback(async (name: ThemeName) => {
    if (!isUnlocked(name)) return;
    setThemeName(name);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, name);
    } catch {
      // ignore storage error
    }
  }, [isUnlocked]);

  const unlockTheme = useCallback(async (name: ThemeName) => {
    setUnlockedThemes((prev) => {
      if (prev.includes(name)) return prev;
      const next = [...prev, name];
      AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const current = Themes[themeName] as ThemeColors;

  return (
    <ThemeContext.Provider
      value={{
        colors: current,
        themeName,
        emojiPack: current.emojiPack,
        channel: STORE_CHANNEL,
        unlockedThemes,
        isUnlocked,
        setTheme,
        unlockTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
