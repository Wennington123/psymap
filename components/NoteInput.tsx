import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (text: string) => void;
  visible: boolean;
}

export default function NoteInput({ value, onChange, visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar uma nota (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="O que está acontecendo?"
        placeholderTextColor="#555"
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
    color: '#a0a0b0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#0f3460',
    minHeight: 70,
  },
});
