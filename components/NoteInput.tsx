import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radii } from '../constants/ui';
import i18n from '../lib/i18n';

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
      <Text style={[styles.title, { color: colors.textSecondary }]}>{i18n.t('nota.placeholder')}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderRadius: radii.input }]}
        placeholder="O que aconteceu? O que você percebeu no corpo e nos pensamentos?"
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
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
    padding: 14,
    fontSize: 15,
    minHeight: 96,
  },
});
