import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BrandListScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../navigation/types';
import { Brand } from '../types'; // Brand tipini import et
import { fetchBrands } from '../api'; // API fonksiyonunu import et
import COLORS from '../constants/colors';
import CardComponent from '../components/common/CardComponent'; // CardComponent'i import et

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
        const response = await fetchBrands();
        // API'den gelen veri formatına göre ayarlama yapın (response.data.data vb.)
        setBrands(response.data.data || response.data);
      } catch (err) {
        setError('Markalar yüklenirken bir hata oluştu.');
        console.error('Fetch Brands Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrands();
  }, []);

  const handleBrandPress = (brandId: string | number) => {
    navigation.navigate('BrandDetail', { brandId: brandId.toString() });
  };

  const renderBrandItem = ({ item }: { item: Brand }) => (
    <CardComponent
      title={item.name}
      // subtitle={item.description} // Marka için alt başlık gerekirse
      imageUrl={item.logo} // Marka logosu için
      onPress={() => handleBrandPress(item.id)}
    />
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
        {/* Yeniden deneme butonu eklenebilir */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Markalar</Text> */}
      {/* Başlık AppNavigator'da tanımlandığı için burada tekrar göstermeyebiliriz */}
      {brands.length > 0 ? (
        <FlatList
          data={brands}
          renderItem={renderBrandItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer} // Liste için genel padding
          numColumns={2} // Markaları 2 sütunlu göstermek için (isteğe bağlı)
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
