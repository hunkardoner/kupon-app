import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePersonalization } from '../../hooks/usePersonalization';
import { useFavorites } from '../../context/FavoritesContext';
import { FavoriteButton } from '../../components/common/favorite-button';
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

  const renderCouponCard = (coupon: Coupon, source: 'favorite' | 'personalized' | 'popular') => (
    <TouchableOpacity
      key={`${coupon.id}-${source}`}
      style={styles.couponCard}
      onPress={() => navigation.navigate('CouponDetail', { couponId: coupon.id })}
    >
      <View style={styles.couponImageContainer}>
        <Image 
          source={{ 
            uri: (('brand' in coupon && coupon.brand && typeof coupon.brand === 'object') 
              ? coupon.brand.logo 
              : null) || 'https://via.placeholder.com/150x120?text=Logo' 
          }} 
          style={styles.couponImage}
          defaultSource={{ uri: 'https://via.placeholder.com/150x120?text=Logo' }}
        />
        <FavoriteButton
          couponId={coupon.id}
          size={20}
          style={styles.favoriteButton}
        />
        {('created_at' in coupon) && coupon.created_at && new Date(coupon.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>YENİ</Text>
          </View>
        )}
        {source === 'favorite' && (
          <View style={[styles.newBadge, { backgroundColor: '#E91E63', top: 8, right: 8 }]}>
            <Text style={styles.newBadgeText}>♥</Text>
          </View>
        )}
      </View>

      <View style={styles.couponContent}>
        <Text style={styles.couponBrand} numberOfLines={1}>
          {('brand' in coupon && coupon.brand && typeof coupon.brand === 'object') 
            ? coupon.brand.name 
            : 'Genel'}
        </Text>
        <Text style={styles.couponTitle} numberOfLines={2}>
          {coupon.description || 'Kupon'}
        </Text>
        <Text style={styles.couponDiscount}>
          {('discount_type' in coupon && coupon.discount_type === 'percentage') 
            ? `%${coupon.discount_value} İndirim`
            : ('discount_value' in coupon) 
              ? `₺${coupon.discount_value} İndirim`
              : 'İndirim'}
        </Text>
        
        {source === 'favorite' && (
          <View style={styles.reasonContainer}>
            <Ionicons name="heart" size={12} color="#E91E63" />
            <Text style={styles.reasonText} numberOfLines={1}>
              Favori markanızdan
            </Text>
          </View>
        )}
        
        {source === 'personalized' && (personalizedCoupons.find(p => p.id === coupon.id) as any)?.reason && (
          <View style={styles.reasonContainer}>
            <Ionicons name="bulb" size={12} color="#FF9800" />
            <Text style={styles.reasonText} numberOfLines={1}>
              {(personalizedCoupons.find(p => p.id === coupon.id) as any)?.reason}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Öneriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tüm Öneriler</Text>
      </View>

      {/* Favori Markalardan Kuponlar */}
      {isAuthenticated && favoriteBrandCoupons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favori Markalarınızdan</Text>
          <View style={styles.couponsGrid}>
            {favoriteBrandCoupons.map(coupon => renderCouponCard(coupon, 'favorite'))}
          </View>
        </View>
      )}

      {/* Kişiselleştirilmiş Öneriler */}
      {isAuthenticated && personalizedCoupons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sizin İçin Özel</Text>
          <View style={styles.couponsGrid}>
            {personalizedCoupons.map(coupon => renderCouponCard(coupon as Coupon, 'personalized'))}
          </View>
        </View>
      )}

      {/* Popüler Kuponlar */}
      {popularCoupons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isAuthenticated ? 'Diğer Popüler Kuponlar' : 'Popüler Kuponlar'}
          </Text>
          <View style={styles.couponsGrid}>
            {popularCoupons.map(coupon => renderCouponCard(coupon, 'popular'))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default Recommendations;
