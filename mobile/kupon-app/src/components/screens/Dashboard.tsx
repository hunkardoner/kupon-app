import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePersonalization } from '../../hooks/usePersonalization';
import { useFavorites } from '../../context/FavoritesContext';
import { FavoriteButton } from '../common/FavoriteButton';
import { dataAPI, userAPI } from '../../api';
import { Coupon, Category, Slider } from '../../types';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

export function Dashboard({ navigation }: DashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const { personalizedCoupons, isLoading, generateRecommendations } = usePersonalization();
  const { favorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [popularCoupons, setPopularCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      
      // Load public data
      const [popularData, categoriesData, slidersData] = await Promise.all([
        dataAPI.getCoupons({ limit: 10, popular: true }).then(data => {
          console.log('Coupons response:', data);
          return data;
        }).catch(err => {
          console.error('Error loading coupons:', err);
          return [];
        }),
        dataAPI.getCategories({ limit: 6 }).then(data => {
          console.log('Categories response:', data);
          return data;
        }).catch(err => {
          console.error('Error loading categories:', err);
          return [];
        }),
        dataAPI.getSliders().then(data => {
          console.log('Sliders response:', data);
          return data;
        }).catch(err => {
          console.error('Error loading sliders:', err);
          return [];
        })
      ]);

      console.log('Popular coupons count:', Array.isArray(popularData) ? popularData.length : 'Not array');
      console.log('Categories count:', Array.isArray(categoriesData) ? categoriesData.length : 'Not array');
      console.log('Sliders count:', Array.isArray(slidersData) ? slidersData.length : 'Not array');

      setPopularCoupons(popularData || []);
      setCategories(categoriesData || []);
      setSliders(slidersData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboardData(),
      generateRecommendations()
    ]);
    setRefreshing(false);
  };

  const calculateTotalSavings = () => {
    // Get from user profile or analytics
    return user?.totalSavings || 0;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 17) return 'İyi öğlen';
    return 'İyi akşamlar';
  };

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}{isAuthenticated && user ? `, ${user.name}` : ''}!
          </Text>
          <Text style={styles.subtitle}>
            {isAuthenticated 
              ? 'Size özel kuponlar hazırladık' 
              : 'En iyi kupons için giriş yapın'
            }
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate(isAuthenticated ? 'Profile' : 'Auth')}
        >
          <Ionicons
            name={isAuthenticated ? 'person' : 'person-outline'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {isAuthenticated && (
        <View style={styles.savingsWidget}>
          <View style={styles.savingsContent}>
            <Ionicons name="wallet" size={24} color="#4CAF50" />
            <View style={styles.savingsText}>
              <Text style={styles.savingsAmount}>₺{calculateTotalSavings()}</Text>
              <Text style={styles.savingsLabel}>Toplam Tasarrufu</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('Savings')}
          >
            <Text style={styles.viewDetailsText}>Detaylar</Text>
            <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Ionicons name="grid" size={24} color="#2196F3" />
          <Text style={styles.actionText}>Kategoriler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#FF9800" />
          <Text style={styles.actionText}>Arama</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart" size={24} color="#E91E63" />
          <Text style={styles.actionText}>Favoriler</Text>
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications" size={24} color="#9C27B0" />
          <Text style={styles.actionText}>Bildirimler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalizedCoupons = () => {
    const couponsToShow = isAuthenticated ? personalizedCoupons : popularCoupons;
    console.log('Rendering coupons:', couponsToShow.length, 'items');
    
    return (
      <View style={styles.personalizedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isAuthenticated ? 'Sizin İçin Öneriler' : 'Popüler Kuponlar'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCoupons')}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {couponsToShow.length === 0 ? (
          <View style={styles.emptyCouponsContainer}>
            <Text style={styles.emptyCouponsText}>
              {isAuthenticated ? 'Henüz kişiselleştirilmiş kupon yok' : 'Kupon bulunamadı'}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.couponsScroll}
          >
            {couponsToShow.slice(0, 10).map((coupon) => (
              <TouchableOpacity
                key={coupon.id}
                style={styles.couponCard}
                onPress={() => navigation.navigate('CouponDetail', { couponId: coupon.id })}
              >
                <View style={styles.couponImageContainer}>
                  <Image 
                    source={{ 
                      uri: (('brand' in coupon && coupon.brand && typeof coupon.brand === 'object') 
                        ? coupon.brand.logo 
                        : null) || 'https://via.placeholder.com/150x120' 
                    }} 
                    style={styles.couponImage} 
                  />
                  <FavoriteButton
                    couponId={coupon.id.toString()}
                    size="small"
                    style={styles.favoriteButton}
                  />
                  {('created_at' in coupon) && coupon.created_at && new Date(coupon.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>YENİ</Text>
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
                  
                  {isAuthenticated && (personalizedCoupons.find(p => p.id === coupon.id) as any)?.reason && (
                    <View style={styles.reasonContainer}>
                      <Ionicons name="bulb" size={12} color="#FF9800" />
                      <Text style={styles.reasonText} numberOfLines={1}>
                        {(personalizedCoupons.find(p => p.id === coupon.id) as any)?.reason}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderCategories = () => {
    console.log('Rendering categories:', categories.length, 'items');
    
    return (
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
        {categories.length === 0 ? (
          <View style={styles.emptyCouponsContainer}>
            <Text style={styles.emptyCouponsText}>Kategori bulunamadı</Text>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 4).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('CategoryDetail', { categoryId: category.id })}
              >
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeSection()}
      {renderQuickActions()}
      {renderPersonalizedCoupons()}
      {renderCategories()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsWidget: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsText: {
    marginLeft: 12,
  },
  savingsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  savingsLabel: {
    fontSize: 12,
    color: '#666',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
  },
  quickActions: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    position: 'relative',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  personalizedSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
  },
  couponsScroll: {
    marginHorizontal: -10,
  },
  couponCard: {
    width: width * 0.4,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    }),
  },
  couponImageContainer: {
    position: 'relative',
    height: 120,
  },
  couponImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  couponContent: {
    padding: 12,
  },
  couponBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonText: {
    fontSize: 10,
    color: '#FF9800',
    marginLeft: 4,
    flex: 1,
  },
  emptyCouponsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCouponsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  categoriesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
