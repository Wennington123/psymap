import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  value: string;
  onChange: (text: string) => void;
  visible: boolean;
}

export default function NoteInput({ value, onChange, visible }: Props) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Adicionar uma nota (opcional)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
        placeholder="O que está acontecendo?"
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    minHeight: 70,
  },
});
