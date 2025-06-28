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
import { CouponCard } from '../../../components/common/coupon-card';
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

  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Kategori detayını al (coupon_codes ilişkisi ile birlikte)
      const categoryData = await dataAPI.getCategory(categoryId);
      
      if (categoryData) {
        setCategory(categoryData);
        
        // Backend'den gelen coupon_codes'u kullan
        if (categoryData.coupon_codes && Array.isArray(categoryData.coupon_codes)) {
          setCoupons(categoryData.coupon_codes);
        } else {
          // Eğer category'de coupon_codes yoksa, API'den kategori bazlı filtreleme yap
          const couponsData = await dataAPI.getCoupons({ category_id: categoryId });
          setCoupons(couponsData);
        }
      } else {
        setError('Kategori bulunamadı');
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
