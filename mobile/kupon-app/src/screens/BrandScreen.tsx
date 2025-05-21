import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../navigation/types';

type BrandScreenRouteProp = RouteProp<BrandStackParamList, 'BrandDetail'>;
type BrandScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandDetail'>;

interface BrandScreenProps {
  route: BrandScreenRouteProp;
  navigation: BrandScreenNavigationProp;
}

function BrandScreen({ route, navigation }: BrandScreenProps): React.JSX.Element {
  const { brandId } = route.params; // Detay ekranı olduğu için params kesin gelir.

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Marka Detay Sayfası</Text>
        {brandId && <Text>Marka ID: {brandId}</Text>}
        {/* Buraya marka detayları gelecek */}
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

export default BrandScreen;
