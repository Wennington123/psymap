import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  PixelifySans_400Regular,
  PixelifySans_700Bold,
} from '@expo-google-fonts/pixelify-sans';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import { initNotifications } from '../lib/notifications';

function AppContent() {
  const { colors } = useTheme();

  useEffect(() => {
    initNotifications();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right']}>
      <StatusBar style={colors.statusBar as 'light' | 'dark'} />
      <Slot />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    PixelifySans_400Regular,
    PixelifySans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
