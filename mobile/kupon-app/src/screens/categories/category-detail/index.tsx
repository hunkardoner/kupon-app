import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { CategoryStackParamList } from '../../../navigation/types';
import { Category, Coupon } from '../../../types';
import { API_BASE_URL, dataAPI } from '../../../api/index';
import { useFavorites } from '../../../context/FavoritesContext';
import { styles } from './style';

const { width } = Dimensions.get('window');

type CategoryScreenRouteProp = RouteProp<CategoryStackParamList, 'CategoryDetail'>;
type CategoryScreenNavigationProp = StackNavigationProp<CategoryStackParamList, 'CategoryDetail'>;

interface CategoryScreenProps {
  route: CategoryScreenRouteProp;
  navigation: CategoryScreenNavigationProp;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [category, setCategory] = useState<Category | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryData, couponsData] = await Promise.allSettled([
        dataAPI.getCategory(categoryId),
        dataAPI.getCoupons({ category_id: categoryId }),
      ]);

      if (categoryData.status === 'fulfilled') {
        setCategory(categoryData.value);
      }

      if (couponsData.status === 'fulfilled') {
        setCoupons(couponsData.value);
      }

      if (categoryData.status === 'rejected' && couponsData.status === 'rejected') {
        setError('Kategori bilgileri yüklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Failed to load category data:', err);
      setError('Kategori bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategoryData();
    setRefreshing(false);
  };

  const handleCouponPress = (couponId: number) => {
    // Navigate to CouponDetail in a different stack
    (navigation as any).navigate('CouponDetail', { couponId });
  };

  const renderHeader = () => {
    if (!category) return null;

    let imageUrl = category.image;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
    }

    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.categoryInfo}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.categoryName}>{category.name}</Text>
          {category.description && (
            <Text style={styles.categoryDescription}>{category.description}</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{coupons.length}</Text>
            <Text style={styles.statLabel}>Toplam Kupon</Text>
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

    let brandLogoUrl = item.brand?.logo;
    if (brandLogoUrl && !brandLogoUrl.startsWith('http')) {
      brandLogoUrl = `${API_BASE_URL.replace('/api', '')}${brandLogoUrl}`;
    }

    return (
      <TouchableOpacity
        style={[styles.couponCard, isExpired && styles.expiredCard]}
        onPress={() => handleCouponPress(item.id)}
        activeOpacity={0.7}
      >
        {/* Brand Logo */}
        <View style={styles.brandLogoContainer}>
          <Image
            source={{
              uri: brandLogoUrl || 'https://via.placeholder.com/50x50?text=Logo'
            }}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>

        {/* Discount Badge */}
        {(item.discount_amount || item.discount_value) && (
          <View style={[styles.discountBadge, isExpired && styles.expiredBadge]}>
            <Text style={[styles.discountText, isExpired && styles.expiredText]}>
              {item.discount_type === 'percentage' ? '%' : '₺'}
              {item.discount_amount || item.discount_value}
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
          <Text style={styles.brandName}>{item.brand?.name || 'Marka'}</Text>
          
          <Text style={[styles.couponTitle, isExpired && styles.expiredText]} numberOfLines={2}>
            {item.title || item.campaign_title || 'Kupon'}
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

            {(item.expiry_date || item.valid_to) && (
              <View style={styles.expiryContainer}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isExpired ? '#f44336' : '#666'}
                />
                <Text style={[styles.expiryText, isExpired && styles.expiredExpiryText]}>
                  {isExpired 
                    ? 'Süresi dolmuş' 
                    : new Date(item.expiry_date || item.valid_to).toLocaleDateString('tr-TR')
                  }
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
      <Text style={styles.emptyTitle}>Bu kategoride henüz kupon yok</Text>
      <Text style={styles.emptySubtitle}>
        Bu kategori için henüz aktif kupon bulunmuyor. Yeni kuponlar için takipte kalın!
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Kategori bilgileri yükleniyor...</Text>
      </View>
    </SafeAreaView>
  );

  const renderErrorState = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCategoryData}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error && !category) {
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

export default CategoryScreen;
