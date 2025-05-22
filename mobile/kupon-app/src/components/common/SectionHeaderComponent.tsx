import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './SectionHeaderComponent.styles'; // Stilleri import et

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void; // "Tümünü Gör" butonu için opsiyonel fonksiyon
  seeAllText?: string;
}

function SectionHeaderComponent({
  title,
  onSeeAllPress, // onViewMore -> onSeeAllPress olarak düzeltildi
  seeAllText = 'Tümünü Gör',
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAllPress && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>{seeAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SectionHeaderComponent;
