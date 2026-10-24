import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { displayFont } from '../../constants/ui';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function StatsSection({ title, children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
});
