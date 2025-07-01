import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePersonalization } from '../../hooks/usePersonalization';
import { useFavorites } from '../../context/FavoritesContext';
import { FavoriteButton } from '../../components/common/favorite-button';
import { CouponCard } from '../../components/common/coupon-card';
import { dataAPI } from '../../api';
import { Coupon } from '../../types';
import { styles } from './style'

interface RecommendationsProps {
  navigation: any;
}

export function Recommendations({ navigation }: RecommendationsProps) {
  const { isAuthenticated } = useAuth();
  const { personalizedCoupons, generateRecommendations } = usePersonalization();
  const { favoriteBrands } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteBrandCoupons, setFavoriteBrandCoupons] = useState<Coupon[]>([]);
  const [popularCoupons, setPopularCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllRecommendations();
  }, []);

  const loadFavoriteBrandCoupons = async () => {
    if (!isAuthenticated || favoriteBrands.length === 0) {
      setFavoriteBrandCoupons([]);
      return;
    }

    const brandIds = favoriteBrands.map(brand => brand.id);
    const allCoupons: Coupon[] = [];

    for (const brandId of brandIds) {
      try {
        const brandCoupons = await dataAPI.getCoupons({ 
          brand_id: brandId, 
          limit: 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        if (Array.isArray(brandCoupons)) {
          allCoupons.push(...brandCoupons);
        }
      } catch (error) {
        console.error(`Error loading coupons for brand ${brandId}:`, error);
      }
    }

    const sortedCoupons = allCoupons
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

    setFavoriteBrandCoupons(sortedCoupons);
  };

  const loadPopularCoupons = async () => {
    try {
      const popular = await dataAPI.getCoupons({ 
        limit: 20, 
        sort_by: 'usage_count',
        sort_order: 'desc'
      });
      setPopularCoupons(Array.isArray(popular) ? popular : []);
    } catch (error) {
      console.error('Error loading popular coupons:', error);
      setPopularCoupons([]);
    }
  };

  const loadAllRecommendations = async () => {
    setIsLoading(true);
    await Promise.all([
      loadFavoriteBrandCoupons(),
      loadPopularCoupons(),
      generateRecommendations()
    ]);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllRecommendations();
    setRefreshing(false);
  };

  const renderCouponCard = (coupon: Coupon, source: 'favorite' | 'personalized' | 'popular') => {
    const handleCouponPress = (couponId: number) => {
      navigation.navigate('CouponDetail', { couponId });
    };

    return (
      <View key={`${coupon.id}-${source}`} style={styles.couponWrapper}>
        <CouponCard
          item={coupon}
          onPress={handleCouponPress}
          showFavorite={true}
        />
        
        {/* Source badge */}
        {source === 'favorite' && (
          <View style={[styles.sourceBadge, { backgroundColor: '#E91E63' }]}>
            <Ionicons name="heart" size={12} color="#FFF" />
            <Text style={styles.sourceBadgeText}>Favori</Text>
          </View>
        )}
        
        {source === 'personalized' && (
          <View style={[styles.sourceBadge, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="bulb" size={12} color="#FFF" />
            <Text style={styles.sourceBadgeText}>Önerilen</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Öneriler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Tüm kuponları tek bir array'de birleştir
  const allCoupons = [
    ...favoriteBrandCoupons.map(coupon => ({ ...coupon, source: 'favorite' as const })),
    ...personalizedCoupons.map(coupon => ({ ...coupon as Coupon, source: 'personalized' as const })),
    ...popularCoupons.map(coupon => ({ ...coupon, source: 'popular' as const }))
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Tüm Öneriler</Text>
    </View>
  );

  const renderCouponItem = ({ item }: { item: Coupon & { source: 'favorite' | 'personalized' | 'popular' } }) => {
    return renderCouponCard(item, item.source);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Henüz öneri yok</Text>
      <Text style={styles.emptySubtitle}>
        Sizin için özel kuponlar hazırlanıyor. Favori markalarınızı ekleyerek kişiselleştirilmiş öneriler alabilirsiniz.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allCoupons}
        renderItem={renderCouponItem}
        keyExtractor={(item) => `${item.id}-${item.source}`}
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
}

export default Recommendations;
