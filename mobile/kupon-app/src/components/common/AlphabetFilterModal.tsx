import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

interface AlphabetFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLetter: (letter: string | null) => void;
  selectedLetter: string | null;
}

export const AlphabetFilterModal: React.FC<AlphabetFilterModalProps> = ({
  visible,
  onClose,
  onSelectLetter,
  selectedLetter,
}) => {
  const alphabet = [
    'Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M',
    'N', 'O', 'Ö', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'W', 'X', 'Y', 'Z'
  ];

  const handleLetterPress = (letter: string) => {
    const letterValue = letter === 'Tümü' ? null : letter;
    onSelectLetter(letterValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Harfe Göre Filtrele</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.alphabetGrid}>
            {alphabet.map((letter) => (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.letterButton,
                  (letter === 'Tümü' ? selectedLetter === null : selectedLetter === letter) && 
                  styles.selectedLetter,
                ]}
                onPress={() => handleLetterPress(letter)}
              >
                <Text
                  style={[
                    styles.letterText,
                    (letter === 'Tümü' ? selectedLetter === null : selectedLetter === letter) && 
                    styles.selectedLetterText,
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  alphabetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  letterButton: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLetter: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  letterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedLetterText: {
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
});
