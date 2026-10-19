import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Emotion } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { card, radii } from '../constants/ui';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (emotion: Emotion) => void;
}

export default function CustomEmotionInput({ visible, onClose, onSave }: Props) {
  const { colors } = useTheme();
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleSave = () => {
    if (!label.trim()) return;
    const emotion: Emotion = {
      id: `custom-${Date.now()}`,
      label: label.trim(),
      emoji: emoji.trim() || '💬',
      isCustom: true,
    };
    onSave(emotion);
    setLabel('');
    setEmoji('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.background }, card(colors)]}>
          <Text style={[styles.title, { color: colors.text }]}>Nova emoção personalizada</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Nome da emoção"
            placeholderTextColor={colors.textDim}
            value={label}
            onChangeText={setLabel}
            autoFocus
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            placeholder="Emoji (ex: 🎉)"
            placeholderTextColor={colors.textDim}
            value={emoji}
            onChangeText={setEmoji}
            maxLength={2}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.accent }, !label.trim() && styles.disabled]}
              onPress={handleSave}
              disabled={!label.trim()}
            >
              <Text style={[styles.saveText, { color: colors.textOnAccent }]}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderRadius: radii.input,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 15,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});
