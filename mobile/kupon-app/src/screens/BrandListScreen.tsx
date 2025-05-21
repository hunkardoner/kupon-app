import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BrandListScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../navigation/types';

// Tip tanımlamaları
type BrandListScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandList'>;

interface BrandListScreenProps {
  navigation: BrandListScreenNavigationProp;
}

function BrandListScreen({ navigation }: BrandListScreenProps): React.JSX.Element {
  // Örnek bir markaya gitmek için:
  // navigation.navigate('BrandDetail', { brandId: 'abc' });
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Marka Listesi</Text>
      {/* Markalar burada listelenecek */}
    </SafeAreaView>
  );
}

export default BrandListScreen;
