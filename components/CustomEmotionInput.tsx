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

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (emotion: Emotion) => void;
}

export default function CustomEmotionInput({ visible, onClose, onSave }: Props) {
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
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Nova emoção personalizada</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da emoção"
            placeholderTextColor="#666"
            value={label}
            onChangeText={setLabel}
            autoFocus
          />
          <TextInput
            style={styles.input}
            placeholder="Emoji (ex: 🎉)"
            placeholderTextColor="#666"
            value={emoji}
            onChangeText={setEmoji}
            maxLength={2}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !label.trim() && styles.disabled]}
              onPress={handleSave}
              disabled={!label.trim()}
            >
              <Text style={styles.saveText}>Adicionar</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
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
    color: '#888',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#e94560',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});
