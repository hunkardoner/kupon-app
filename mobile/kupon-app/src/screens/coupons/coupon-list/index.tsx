import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../../../navigation/types';
import { Coupon } from '../../../types';
import { FavoriteButton } from '../../../components/common/FavoriteButton';
import { FilterModal, FilterOptions } from '../../../components/common/FilterModal';
import { useCoupons } from '../../../hooks/useQueries';
import { dataAPI } from '../../../api';
import { styles } from './style';

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    discountType: 'all',
    sortBy: 'newest',
    onlyAvailable: true,
  });
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  const {
    data: coupons,
    isLoading,
    error,
    refetch,
  } = useCoupons();

  // Load categories for filter
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await dataAPI.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const filteredAndSortedCoupons = coupons?.filter(coupon => {
    // Search query filter
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const matchesDescription = coupon.description && coupon.description.toLowerCase().includes(query);
      const matchesBrand = coupon.brand && typeof coupon.brand === 'object' && 
                          coupon.brand.name && coupon.brand.name.toLowerCase().includes(query);
      
      if (!matchesDescription && !matchesBrand) return false;
    }

    // Discount type filter
    if (filters.discountType && filters.discountType !== 'all') {
      if (filters.discountType === 'percentage' && coupon.discount_type !== 'percentage') return false;
      if (filters.discountType === 'fixed' && coupon.discount_type !== 'fixed_amount') return false;
    }

    // Category filter
    if (filters.category) {
      const hasCategory = coupon.categories?.some(cat => 
        typeof cat === 'object' && cat.name === filters.category
      );
      if (!hasCategory) return false;
    }

    // Only available filter
    if (filters.onlyAvailable) {
      const now = new Date();
      const expiryDate = coupon.expires_at || coupon.valid_to;
      if (expiryDate && new Date(expiryDate) < now) return false;
    }

    return true;
  }).sort((a, b) => {
    const sortBy = filters.sortBy || 'newest';
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

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.sortBy) {
      setSortBy(newFilters.sortBy as 'newest' | 'popular' | 'ending');
    }
  };

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
          onPress={() => setFilterModalVisible(true)}
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
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
        categories={categories}
      />
    </SafeAreaView>
  );
};

// Display name for better debugging
CouponListScreen.displayName = 'CouponListScreen';

export default CouponListScreen;
