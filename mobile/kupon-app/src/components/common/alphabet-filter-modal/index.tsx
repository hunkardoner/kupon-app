import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

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

export default AlphabetFilterModal;
