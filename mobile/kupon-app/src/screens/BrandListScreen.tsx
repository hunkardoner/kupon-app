import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BrandListScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../navigation/types';
import { Brand } from '../types';
import { fetchBrands } from '../api';
import COLORS from '../constants/colors';
import CardComponent from '../components/common/CardComponent';

// Tip tanımlamaları
type BrandListScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandList'>;

interface BrandListScreenProps {
  navigation: BrandListScreenNavigationProp;
}

function BrandListScreen({ navigation }: BrandListScreenProps): React.JSX.Element {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrands() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedBrands = await fetchBrands();
        setBrands(fetchedBrands);
      } catch (err) {
        setError('Markalar yüklenirken bir hata oluştu.');
        console.error('Fetch Brands Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrands();
  }, []);

  const handleBrandPress = (brandId: number) => {
    navigation.navigate('BrandDetail', { brandId: brandId });
  };

  const renderBrandItem = ({ item }: { item: Brand }) => (
    <View style={styles.cardContainer}>
      <CardComponent
        item={{ ...item, type: 'brand' }}
        onPress={() => handleBrandPress(item.id)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {brands.length > 0 ? (
        <FlatList
          data={brands}
          renderItem={renderBrandItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Marka bulunamadı.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default BrandListScreen;
