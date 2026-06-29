import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function StatsSection({ title, children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.accent, borderBottomColor: colors.border }]}>{title}</Text>
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
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
});
