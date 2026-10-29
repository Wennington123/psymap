import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { type Locale } from '../lib/i18n';

const STORAGE_KEY = 'psymap-locale';

interface LocaleContextValue {
  locale: Locale;
  setAppLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'pt-BR',
  setAppLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>((i18n.locale as Locale) || 'pt-BR');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      const l = (saved as Locale) || 'pt-BR';
      i18n.locale = l;
      setLocaleState(l);
    });
  }, []);

  const setAppLocale = useCallback((l: Locale) => {
    i18n.locale = l;
    setLocaleState(l);
    AsyncStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setAppLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
