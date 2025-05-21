import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';

type CouponScreenRouteProp = RouteProp<CouponStackParamList, 'CouponDetail'>;
type CouponScreenNavigationProp = StackNavigationProp<CouponStackParamList, 'CouponDetail'>;

interface CouponScreenProps {
  route: CouponScreenRouteProp;
  navigation: CouponScreenNavigationProp;
}

function CouponScreen({ route, navigation }: CouponScreenProps): React.JSX.Element {
  const { couponId } = route.params; // Detay ekranı olduğu için params kesin gelir.

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Kupon Detay Sayfası</Text>
        {couponId && <Text>Kupon ID: {couponId}</Text>}
        {/* Buraya kupon detayları gelecek */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CouponScreen;
