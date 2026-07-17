import React from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { EmojiSource } from '../constants/colors';

interface Props {
  source: EmojiSource;
  size?: number;
}

export default function EmojiRenderer({ source, size = 28 }: Props) {
  if (typeof source === 'number') {
    return <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />;
  }
  return <Text style={[styles.text, { fontSize: size }]}>{source}</Text>;
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
