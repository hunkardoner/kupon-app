import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BrandStackParamList } from '../../../navigation/types';
import { Brand } from '../../../types';
import { useBrands } from '../../../hooks/useQueries';
import { API_BASE_URL } from '../../../api/index';
import { styles } from './style';

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
        style={styles.brandItem}
        onPress={() => handleBrandPress(item.id)}
      >
        <Image
          source={{
            uri: logoUrl || 'https://via.placeholder.com/80x80?text=Logo'
          }}
          style={styles.brandImage}
          resizeMode="contain"
        />
        
        <Text style={styles.brandName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.brandStats}>
          <Text style={styles.couponCount}>
            {item.coupons_count && item.coupons_count > 0 
              ? `${item.coupons_count} kupon` 
              : 'Kupon yok'
            }
          </Text>
          {item.category && (
            <Text style={styles.categoryText} numberOfLines={1}>
              {item.category}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="storefront-outline" size={48} color="#adb5bd" />
      </View>
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
          style={styles.retryButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.retryButtonText}>Aramayı Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Markalar yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>
        {error?.message || 'Markalar yüklenirken bir sorun yaşandı'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
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
        columnWrapperStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default BrandListScreen;
