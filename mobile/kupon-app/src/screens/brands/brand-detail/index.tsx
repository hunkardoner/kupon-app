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
  const [error, setError] = useState<string | null>(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Marka detayını al
      const brandData = await dataAPI.getBrand(brandId);
      
      if (brandData) {
        setBrand(brandData);
        
        // Brand için kuponları ayrı olarak çek
        const couponsData = await dataAPI.getCoupons({ brand_id: brandId });
        setCoupons(couponsData);
      } else {
        setError('Marka bulunamadı');
      }
    } catch (err) {
      console.error('Failed to load brand data:', err);
      setError('Marka bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBrandData();
    setRefreshing(false);
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
            <Text style={styles.statLabel}>% İndirim</Text>
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
        <TouchableOpacity style={styles.retryButton} onPress={loadBrandData}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

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
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default BrandDetailScreen;
