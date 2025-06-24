import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryStackParamList } from '../navigation/types';
import { Category } from '../types';
import { useCategories } from '../hooks/useQueries';

const { width } = Dimensions.get('window');

type CategoryListScreenNavigationProp = StackNavigationProp<
  CategoryStackParamList,
  'CategoryList'
>;

const CategoryListScreen: React.FC = () => {
  const navigation = useNavigation<CategoryListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useCategories();

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Elektronik': 'phone-portrait',
      'Moda': 'shirt',
      'Ev & Yaşam': 'home',
      'Kozmetik': 'flower',
      'Spor': 'fitness',
      'Kitap': 'book',
      'Yemek': 'restaurant',
      'Seyahat': 'airplane',
      'Oyun': 'game-controller',
      'Müzik': 'musical-notes',
      'Film': 'film',
      'Alışveriş': 'bag',
    };
    
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key.toLowerCase())) {
        return icon;
      }
    }
    return 'apps';
  };

  const getCategoryColor = (index: number): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    return colors[index % colors.length];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Kategoriler</Text>
          <Text style={styles.headerSubtitle}>
            {filteredCategories.length} kategori bulundu
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* TODO: Filter modal */}}
        >
          <Ionicons name="options" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kategori ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategoryItem = ({ item, index }: { item: Category; index: number }) => {
    const iconName = getCategoryIcon(item.name);
    const backgroundColor = getCategoryColor(index);

    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          index % 2 === 0 ? styles.categoryCardLeft : styles.categoryCardRight
        ]}
        onPress={() => handleCategoryPress(item)}
      >
        <View style={[styles.categoryIcon, { backgroundColor }]}>
          <Ionicons name={iconName as any} size={32} color="white" />
        </View>
        
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
        
        {item.description && (
          <Text style={styles.categoryDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        <View style={styles.categoryStats}>
          <Ionicons name="pricetag" size={14} color="#4CAF50" />
          <Text style={styles.couponCount}>
            Kuponları gör
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="apps-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aradığınız kategori bulunamadı' : 'Henüz kategori bulunmuyor'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Farklı anahtar kelimeler deneyebilirsiniz'
          : 'Yeni kategoriler yakında eklenecek'
        }
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearSearchText}>Aramayı Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>Kategoriler yüklenirken bir sorun yaşandı</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item: Category) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    minHeight: 160,
  },
  categoryCardLeft: {
    marginRight: 8,
  },
  categoryCardRight: {
    marginLeft: 8,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
    flex: 1,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  couponCount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f44336',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoryListScreen;
