import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Props {
  visible: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function NamePromptModal({ visible, onConfirm, onCancel }: Props) {
  const [name, setName] = useState('');

  function handleConfirm() {
    onConfirm(name);
    setName('');
  }

  function handleClose() {
    onCancel();
    setName('');
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Text style={styles.title}>Identificação para o PDF</Text>
          <Text style={styles.body}>
            Seu nome será usado apenas para identificar o relatório. Não será armazenado ou compartilhado.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Gerar PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e0e0e0',
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#0f3460',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#e94560',
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
