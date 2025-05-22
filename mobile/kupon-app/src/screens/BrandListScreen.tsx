import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useWindowDimensions, // Import useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from './BrandListScreen.styles'; // Import createStyles
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
  const { width } = useWindowDimensions(); // Get window dimensions
  const { styles, numColumns } = createStyles(width); // Get styles and numColumns

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
          numColumns={numColumns} // Use dynamic numColumns
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
