import React, { useState, useCallback } from 'react';
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
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { useCoupons } from '../hooks/useQueries';

const { width } = Dimensions.get('window');

// Tip tanımlamaları
type CouponListScreenNavigationProp = StackNavigationProp<
  CouponStackParamList,
  'CouponList'
>;

interface CouponListScreenProps {
  navigation: CouponListScreenNavigationProp;
}

const CouponListScreen: React.FC<CouponListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'ending'>('newest');

  const {
    data: coupons,
    isLoading,
    error,
    refetch,
  } = useCoupons();

  const filteredAndSortedCoupons = coupons?.filter(coupon =>
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (coupon.brand && typeof coupon.brand === 'object' && 
     coupon.brand.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'popular':
        return (b.usage_count || 0) - (a.usage_count || 0);
      case 'ending':
        return new Date(a.valid_to || 0).getTime() - new Date(b.valid_to || 0).getTime();
      default:
        return 0;
    }
  }) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCouponPress = useCallback((couponId: number) => {
    navigation.navigate('CouponDetail', { couponId });
  }, [navigation]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Kuponlar</Text>
          <Text style={styles.headerSubtitle}>
            {filteredAndSortedCoupons.length} kupon bulundu
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
          placeholder="Kupon veya marka ara..."
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

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sırala:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'newest', label: 'Yeni' },
            { key: 'popular', label: 'Popüler' },
            { key: 'ending', label: 'Bitiyor' }
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortButton,
                sortBy === sort.key && styles.sortButtonActive
              ]}
              onPress={() => setSortBy(sort.key as any)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === sort.key && styles.sortButtonTextActive
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCouponItem = ({ item }: { item: Coupon }) => {
    const isExpiringSoon = item.valid_to && 
      new Date(item.valid_to).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
    const isNew = item.created_at && 
      new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

    return (
      <TouchableOpacity
        style={styles.couponCard}
        onPress={() => handleCouponPress(item.id)}
      >
        <View style={styles.couponImageContainer}>
          <Image
            source={{
              uri: (item.brand && typeof item.brand === 'object' && item.brand.logo) || 
                   'https://via.placeholder.com/100x100'
            }}
            style={styles.couponImage}
            resizeMode="cover"
          />
          <FavoriteButton
            couponId={item.id.toString()}
            size="small"
            style={styles.favoriteButton}
          />
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>YENİ</Text>
            </View>
          )}
          {isExpiringSoon && (
            <View style={styles.expireBadge}>
              <Text style={styles.expireBadgeText}>BİTİYOR</Text>
            </View>
          )}
        </View>

        <View style={styles.couponContent}>
          <Text style={styles.couponBrand}>
            {(item.brand && typeof item.brand === 'object') ? item.brand.name : 'Genel'}
          </Text>
          <Text style={styles.couponTitle} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.couponDetails}>
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>
                {item.discount_type === 'percentage' 
                  ? `%${item.discount_value}` 
                  : `₺${item.discount_value}`
                }
              </Text>
              <Text style={styles.discountLabel}>İndirim</Text>
            </View>
            
            {item.valid_to && (
              <View style={styles.expiryContainer}>
                <Ionicons name="time" size={14} color="#666" />
                <Text style={styles.expiryText}>
                  {new Date(item.valid_to).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            )}
          </View>

          {item.usage_count && item.usage_count > 0 && (
            <View style={styles.usageContainer}>
              <Ionicons name="people" size={14} color="#2196F3" />
              <Text style={styles.usageText}>
                {item.usage_count} kişi kullandı
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aradığınız kupon bulunamadı' : 'Henüz kupon bulunmuyor'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Farklı anahtar kelimeler deneyebilirsiniz'
          : 'Yeni kuponlar yakında eklenecek'
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
      <Text style={styles.loadingText}>Kuponlar yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>Kuponlar yüklenirken bir sorun yaşandı</Text>
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
        data={filteredAndSortedCoupons}
        renderItem={renderCouponItem}
        keyExtractor={(item: Coupon) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    marginBottom: 16,
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  couponImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
  },
  couponImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expireBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  expireBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  couponContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  couponBrand: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  couponDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  discountContainer: {
    alignItems: 'center',
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discountLabel: {
    fontSize: 12,
    color: '#666',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '600',
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

// Display name for better debugging
CouponListScreen.displayName = 'CouponListScreen';

export default CouponListScreen;
