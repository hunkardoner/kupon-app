import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList } from '../navigation/types';
import { Brand, Coupon } from '../types';
import { API_BASE_URL, dataAPI } from '../api/index';
import { useFavorites } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');

type BrandScreenRouteProp = RouteProp<BrandStackParamList, 'BrandDetail'>;
type BrandScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandDetail'>;

interface BrandScreenProps {
  route: BrandScreenRouteProp;
  navigation: BrandScreenNavigationProp;
}

const BrandScreen: React.FC<BrandScreenProps> = ({ route, navigation }) => {
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

      const [brandData, couponsData] = await Promise.allSettled([
        dataAPI.getBrand(brandId),
        dataAPI.getCoupons({ brand_id: brandId }),
      ]);

      if (brandData.status === 'fulfilled') {
        setBrand(brandData.value);
      }

      if (couponsData.status === 'fulfilled') {
        setCoupons(couponsData.value);
      }

      if (brandData.status === 'rejected' && couponsData.status === 'rejected') {
        setError('Marka bilgileri yüklenirken bir hata oluştu');
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.brandInfo}>
          <Image
            source={{
              uri: logoUrl || 'https://via.placeholder.com/100x100?text=Logo'
            }}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>{brand.name}</Text>
          {brand.description && (
            <Text style={styles.brandDescription}>{brand.description}</Text>
          )}
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
    const isFavorite = favorites.includes(item.id.toString());
    const isExpired = item.expiry_date ? new Date(item.expiry_date) < new Date() : false;

    return (
      <TouchableOpacity
        style={[styles.couponCard, isExpired && styles.expiredCard]}
        onPress={() => handleCouponPress(item.id)}
        activeOpacity={0.7}
      >
        {/* Discount Badge */}
        {item.discount_amount && (
          <View style={[styles.discountBadge, isExpired && styles.expiredBadge]}>
            <Text style={[styles.discountText, isExpired && styles.expiredText]}>
              {item.discount_type === 'percentage' ? '%' : '₺'}
              {item.discount_amount}
            </Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={async () => {
            try {
              if (isFavorite) {
                await removeFavorite(item.id.toString());
              } else {
                await addFavorite(item.id.toString());
              }
            } catch (error) {
              console.error('Favorite toggle error:', error);
            }
          }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#f44336' : '#666'}
          />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.couponContent}>
          <Text style={[styles.couponTitle, isExpired && styles.expiredText]} numberOfLines={2}>
            {item.title}
          </Text>
          
          {item.description && (
            <Text style={[styles.couponDescription, isExpired && styles.expiredText]} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.couponFooter}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Kupon Kodu:</Text>
              <Text style={[styles.codeText, isExpired && styles.expiredText]}>
                {item.code}
              </Text>
            </View>

            {item.expiry_date && (
              <View style={styles.expiryContainer}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isExpired ? '#f44336' : '#666'}
                />
                <Text style={[styles.expiryText, isExpired && styles.expiredExpiryText]}>
                  {isExpired ? 'Süresi dolmuş' : new Date(item.expiry_date).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Status Overlay */}
        {isExpired && (
          <View style={styles.expiredOverlay}>
            <Text style={styles.expiredOverlayText}>Süresi Dolmuş</Text>
          </View>
        )}
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brandInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  brandDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  expiredCard: {
    opacity: 0.6,
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 1,
  },
  expiredBadge: {
    backgroundColor: '#999',
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expiredText: {
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  couponContent: {
    paddingTop: 8,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeContainer: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  codeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 1,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    color: '#666',
  },
  expiredExpiryText: {
    color: '#f44336',
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiredOverlayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
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
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
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
  errorContainer: {
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
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BrandScreen;
