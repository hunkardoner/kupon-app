import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CouponListScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';

// Tip tanımlamaları
type CouponListScreenNavigationProp = StackNavigationProp<CouponStackParamList, 'CouponList'>;

interface CouponListScreenProps {
  navigation: CouponListScreenNavigationProp;
}

function CouponListScreen({ navigation }: CouponListScreenProps): React.JSX.Element {
  // Örnek bir kupona gitmek için:
  // navigation.navigate('CouponDetail', { couponId: '123' });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kupon Listesi</Text>
      {/* Kuponlar burada listelenecek */}
    </SafeAreaView>
  );
}

export default CouponListScreen;
