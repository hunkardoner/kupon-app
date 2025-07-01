import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../../../navigation/types';
import { Brand, Coupon } from '../../../types';
import { API_BASE_URL, dataAPI } from '../../../api/index';
import { useFavorites } from '../../../context/FavoritesContext';
import { CouponCard } from '../../../components/common/coupon-card';
import { styles } from './style';

const { width } = Dimensions.get('window');

type BrandScreenRouteProp = RouteProp<BrandStackParamList, 'BrandDetail'>;
type BrandScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandDetail'>;

interface BrandScreenProps {
  route: BrandScreenRouteProp;
  navigation: BrandScreenNavigationProp;
}

const BrandDetailScreen: React.FC<BrandScreenProps> = ({ route, navigation }) => {
  const { brandId } = route.params;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      // İlk sayfa için marka detayını da al
      if (page === 1) {
        const brandData = await dataAPI.getBrand(brandId);
        if (brandData) {
          setBrand(brandData);
        } else {
          setError('Marka bulunamadı');
          return;
        }
      }

      // Brand için kuponları çek
      const response = await dataAPI.getCoupons({ 
        brand_id: brandId, 
        page: page, 
        per_page: 15 
      });

      if (response && response.data) {
        const newCoupons = Array.isArray(response.data) ? response.data : response;
        if (append) {
          // Duplicate kuponları filtrele
          setCoupons(prev => {
            const existingIds = new Set(prev.map(coupon => coupon.id));
            const uniqueNewCoupons = newCoupons.filter((coupon: Coupon) => !existingIds.has(coupon.id));
            return [...prev, ...uniqueNewCoupons];
          });
        } else {
          setCoupons(newCoupons);
        }
        
        // Meta bilgilerini kontrol et
        if (response.meta) {
          setHasMorePages(response.meta.has_more_pages || page < response.meta.last_page);
        } else {
          setHasMorePages(newCoupons.length === 15); // Eğer meta yoksa, coupon sayısına göre tahmin et
        }
      } else {
        const newCoupons = Array.isArray(response) ? response : [];
        if (append) {
          // Duplicate kuponları filtrele
          setCoupons(prev => {
            const existingIds = new Set(prev.map(coupon => coupon.id));
            const uniqueNewCoupons = newCoupons.filter((coupon: Coupon) => !existingIds.has(coupon.id));
            return [...prev, ...uniqueNewCoupons];
          });
        } else {
          setCoupons(newCoupons);
        }
        setHasMorePages(false);
      }

      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to load brand data:', err);
      setError('Marka bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMorePages(true);
    await loadBrandData(1, false);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!loadingMore && hasMorePages && !loading && !refreshing) {
      await loadBrandData(currentPage + 1, true);
    }
  };

  const handleCouponPress = (couponId: number) => {
    // Navigate to CouponDetail in a different stack - we might need to use a different approach
    // For now, let's use the common navigation pattern
    (navigation as any).navigate('CouponDetail', { couponId });
  };

  const renderHeader = () => {
    if (!brand) return null;

    let logoUrl = brand.logo;
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `${API_BASE_URL.replace('/api', '')}${logoUrl}`;
    }

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.brandSection}>
          <View style={styles.brandLogoContainer}>
            <Image
              source={{
                uri: logoUrl || 'https://www.kuponcepte.com.tr/storage/brands/default-brand-logo.png'
              }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.brandTextInfo}>
            <Text style={styles.brandName}>{brand.name}</Text>
            {brand.description && (
              <Text style={styles.brandDescription} numberOfLines={2}>
                {brand.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{coupons.length}</Text>
            <Text style={styles.statLabel}>Aktif Kupon</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {coupons.filter(c => c.discount_type === 'percentage').length}
            </Text>
            <Text style={styles.statLabel}>İndirim</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {coupons.filter(c => c.discount_type === 'fixed_amount').length}
            </Text>
            <Text style={styles.statLabel}>Sabit İndirim</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => {
    // CouponCard bileşeninde brand bilgisi otomatik olarak item.brand'dan alınacak
    // Eğer brand bilgisi yoksa, mevcut brand bilgisini ekleyelim
    const couponWithBrand = {
      ...item,
      brand: item.brand || brand || undefined
    };

    return (
      <CouponCard
        item={couponWithBrand}
        onPress={handleCouponPress}
        showFavorite={true}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="pricetag-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Henüz kupon yok</Text>
      <Text style={styles.emptySubtitle}>
        Bu marka için henüz aktif kupon bulunmuyor. Yeni kuponlar için takipte kalın!
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Marka bilgileri yükleniyor...</Text>
      </View>
    </SafeAreaView>
  );

  const renderErrorState = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadBrandData(1, false)}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.footerLoaderText}>Daha fazla kupon yükleniyor...</Text>
      </View>
    );
  };

  if (loading) {
    return renderLoadingState();
  }

  if (error && !brand) {
    return renderErrorState();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={coupons}
        renderItem={renderCouponItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.01}
      />
    </SafeAreaView>
  );
};

export default BrandDetailScreen;
