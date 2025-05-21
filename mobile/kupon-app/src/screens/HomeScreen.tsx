import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories } from '../api'; // API fonksiyonunu import et
import { Category } from '../types'; // Category tipini import et
import COLORS from '../constants/colors'; // Renkleri import et
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/types'; // Yeni import

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>; // Yeni tip

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchCategories();
        // API'den gelen veri formatına göre ayarlama yapın (response.data.data vb.)
        // Bu örnekte direkt response.data'nın kategori dizisi olduğu varsayılıyor.
        setCategories(response.data.data || response.data); 
      } catch (err) {
        setError('Kategoriler yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      // Kategoriye tıklandığında ne olacağını burada tanımlayabilirsiniz
      // Örneğin: navigation.navigate('CategoryDetail', { categoryId: item.id });
    >
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {/* Yeniden deneme butonu eklenebilir */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Popüler Kategoriler</Text>
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()} // ID'nin string olduğundan emin olun
          numColumns={2} // İki sütunlu görünüm
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Kategori bulunamadı.</Text>
        </View>
      )}
      {/* Buraya anasayfa içeriği (slider, popüler kuponlar vb.) eklenebilir */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContentContainer: {
    paddingHorizontal: 8, // Kenarlardan boşluk
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // Gölge efekti (iOS)
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Gölge efekti (Android)
    elevation: 3,
    minHeight: 100, // Kartların minimum yüksekliği
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
