import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BrandStackParamList } from '../navigation/types';
import { Brand } from '../types';
import { useBrands } from '../hooks/useQueries';
import { API_BASE_URL } from '../api/index';

const { width } = Dimensions.get('window');

// Types
type BrandListScreenRouteProp = RouteProp<BrandStackParamList, 'BrandList'>;
type BrandListScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandList'>;

interface BrandListScreenProps {
  route: BrandListScreenRouteProp;
  navigation: BrandListScreenNavigationProp;
}

const BrandListScreen: React.FC<BrandListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useBrands(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBrandPress = (brandId: number) => {
    navigation.navigate('BrandDetail', { brandId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Markalar</Text>
          <Text style={styles.headerSubtitle}>
            {filteredBrands.length} marka bulundu
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {/* TODO: Filter modal */}}
        >
          <Ionicons name="filter" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Marka ara..."
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

  const renderBrandItem = ({ item, index }: { item: Brand; index: number }) => {
    let logoUrl = item.logo;
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `${API_BASE_URL.replace('/api', '')}${logoUrl}`;
    }

    return (
      <TouchableOpacity
        style={[
          styles.brandCard,
          index % 2 === 0 ? styles.brandCardLeft : styles.brandCardRight
        ]}
        onPress={() => handleBrandPress(item.id)}
      >
        <View style={styles.brandImageContainer}>
          <Image
            source={{
              uri: logoUrl || 'https://via.placeholder.com/80x80?text=Logo'
            }}
            style={styles.brandImage}
            resizeMode="cover"
          />
          {item.coupons_count && item.coupons_count > 0 && (
            <View style={styles.couponBadge}>
              <Text style={styles.couponBadgeText}>{item.coupons_count}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.brandInfo}>
          <Text style={styles.brandName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={styles.brandDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.brandStats}>
            <Ionicons name="pricetag" size={14} color="#4CAF50" />
            <Text style={styles.couponCount}>
              {item.coupons_count && item.coupons_count > 0 
                ? `${item.coupons_count} aktif kupon` 
                : 'Henüz kupon yok'
              }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="storefront-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aradığınız marka bulunamadı' : 'Henüz marka bulunmuyor'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Farklı anahtar kelimeler deneyebilirsiniz'
          : 'Yeni markalar yakında eklenecek'
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
      <Text style={styles.loadingText}>Markalar yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>Markalar yüklenirken bir sorun yaşandı</Text>
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
        data={filteredBrands}
        renderItem={renderBrandItem}
        keyExtractor={(item: Brand) => item.id.toString()}
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
  brandCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
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
  },
  brandCardLeft: {
    marginRight: 8,
  },
  brandCardRight: {
    marginLeft: 8,
  },
  brandImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  brandImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  couponBadge: {
    position: 'absolute',
    top: -4,
    right: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  couponBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  brandInfo: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  brandStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponCount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
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

export default BrandListScreen;