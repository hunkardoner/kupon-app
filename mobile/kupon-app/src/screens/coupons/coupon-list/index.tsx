import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../../../navigation/types';
import { Coupon } from '../../../types';
import { CouponCard } from '../../../components/common/coupon-card';
import { FilterModal, FilterOptions } from '../../../components/common/filter-modal';
import { useInfiniteCoupons } from '../../../hooks/useQueries';
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
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'ending'>('newest');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    discountType: 'all',
    sortBy: 'newest',
    onlyAvailable: true,
  });
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  // Backend query parameters - frontend'deki filtreleri backend parametrelerine çevir
  const queryParams = useMemo(() => {
    // Frontend sort'u backend parametrelerine map et
    const getSortParams = (sortBy: string) => {
      switch (sortBy) {
        case 'newest':
          return { sort_by: 'created_at', sort_order: 'desc' };
        case 'popular':
          return { sort_by: 'view_count', sort_order: 'desc' };
        case 'ending':
          return { sort_by: 'valid_to', sort_order: 'asc' };
        default:
          return { sort_by: 'created_at', sort_order: 'desc' };
      }
    };

    const params: any = {
      per_page: 15,
      ...getSortParams(filters.sortBy || sortBy),
    };

    // Search query
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // Discount type filter
    if (filters.discountType && filters.discountType !== 'all') {
      if (filters.discountType === 'percentage') {
        params.discount_type = 'percentage';
      } else if (filters.discountType === 'fixed') {
        params.discount_type = 'fixed_amount';
      }
    }

    // Category filter (category_id backend'de number bekliyor)
    if (filters.category) {
      const category = categories.find(cat => cat.name === filters.category);
      if (category) {
        params.category_id = category.id;
      }
    }

    // Status filter - only available coupons
    if (filters.onlyAvailable) {
      params.status = 'active';
    }

    console.log('Query params for backend:', params);
    return params;
  }, [searchQuery, filters, sortBy, categories]);

  const {
    data: infiniteData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCoupons(queryParams);

  // Tüm kuponları flat array'e çevir ve benzersiz hale getir
  const allCoupons = useMemo(() => {
    if (!infiniteData) return [];
    
    const allCouponsFlat = infiniteData.pages.flatMap((page: any) => {
      const coupons = page?.data || page;
      return Array.isArray(coupons) ? coupons : [];
    });
    
    // Benzersiz kuponları al (ID'ye göre)
    const uniqueCoupons = allCouponsFlat.filter((coupon: any, index: number, arr: any[]) => 
      arr.findIndex((c: any) => c.id === coupon.id) === index
    );
    
    console.log('All coupons processing:', {
      totalPages: infiniteData.pages.length,
      totalCouponsFlat: allCouponsFlat.length,
      uniqueCoupons: uniqueCoupons.length,
      duplicatesRemoved: allCouponsFlat.length - uniqueCoupons.length
    });
    
    return uniqueCoupons;
  }, [infiniteData]);

  // Backend'den gelen verilerin çoğu zaten filtrelenmiş olduğu için 
  // burada sadece minimal frontend filtreleme yapıyoruz
  const displayedCoupons = useMemo(() => {
    return allCoupons || [];
  }, [allCoupons]);

  // Total count bilgisini backend'den al
  const totalCount = useMemo(() => {
    if (infiniteData?.pages?.[0]?.meta?.total) {
      return infiniteData.pages[0].meta.total;
    }
    return allCoupons?.length || 0;
  }, [infiniteData, allCoupons]);

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

  const onRefresh = async () => {
    await refetch();
  };

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCouponPress = useCallback((couponId: number) => {
    navigation.navigate('CouponDetail', { couponId });
  }, [navigation]);

  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.sortBy) {
      setSortBy(newFilters.sortBy as 'newest' | 'popular' | 'ending');
    }
  };

  const handleSortChange = (newSort: 'newest' | 'popular' | 'ending') => {
    setSortBy(newSort);
    setFilters(prev => ({ ...prev, sortBy: newSort }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Kuponlar</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} kupon bulundu
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
              onPress={() => handleSortChange(sort.key as any)}
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
    return (
      <CouponCard
        item={item}
        onPress={handleCouponPress}
        showFavorite={true}
      />
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

  const renderLoadingFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingFooterText}>Daha fazla kupon yükleniyor...</Text>
      </View>
    );
  };

  if (isLoading && displayedCoupons.length === 0) {
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
        data={displayedCoupons}
        renderItem={renderCouponItem}
        keyExtractor={(item: Coupon) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderLoadingFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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
