import { Slot } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar style={colors.statusBar as 'light' | 'dark'} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
