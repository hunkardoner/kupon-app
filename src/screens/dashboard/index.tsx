import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { FavoriteButton } from '../../components/common/favorite-button';
import { dataAPI, userAPI, API_BASE_URL } from '../../api';
import { Coupon, Category, Slider } from '../../types';
import { styles } from './style';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

export function Dashboard({ navigation }: DashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const { personalizedCoupons, isLoading, generateRecommendations } = usePersonalization();
  const { favorites, favoriteBrands, favoriteCoupons } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [popularCoupons, setPopularCoupons] = useState<Coupon[]>([]);
  const [favoriteBrandCoupons, setFavoriteBrandCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularBrands, setPopularBrands] = useState<any[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);

  // Logo URL'sini güvenli şekilde al
  const getLogoUrl = (logoPath?: string | null) => {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const defaultLogo = `${baseUrl}/storage/brands/default-brand-logo.png`;
    
    // Logo property'si yoksa default logo
    if (!logoPath) {
      return defaultLogo;
    }
    
    const logoUrl = logoPath.trim();
    
    // Boş string kontrolü
    if (!logoUrl) {
      return defaultLogo;
    }
    
    // Eğer URL zaten tam URL ise olduğu gibi kullan
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      return logoUrl;
    }
    
    // Eğer slash ile başlıyorsa direkt base URL ekle
    if (logoUrl.startsWith('/')) {
      return `${baseUrl}${logoUrl}`;
    }
    
    // Eğer relative path ise storage path ekle
    return `${baseUrl}/storage/${logoUrl}`;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && favoriteBrands.length > 0) {
      loadFavoriteBrandCoupons();
    }
  }, [isAuthenticated, favoriteBrands]);

  const loadFavoriteBrandCoupons = async () => {
    try {
      if (!isAuthenticated || favoriteBrands.length === 0) {
        setFavoriteBrandCoupons([]);
        return;
      }

      console.log('Loading coupons from favorite brands:', favoriteBrands.map(b => b.name));
      
      // Favori markalardan kuponları getir
      const brandIds = favoriteBrands.map(brand => brand.id);
      const allCoupons: Coupon[] = [];

      // Her marka için kuponları getir
      for (const brandId of brandIds) {
        try {
          const brandCoupons = await dataAPI.getCoupons({ 
            brand_id: brandId, 
            limit: 3,
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

      // Tarihe göre sırala (en yeni önce) ve 5-6 kupon al
      const sortedCoupons = allCoupons
        .sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 6);

      console.log('Loaded favorite brand coupons:', sortedCoupons.length);
      setFavoriteBrandCoupons(sortedCoupons);
    } catch (error) {
      console.error('Error loading favorite brand coupons:', error);
      setFavoriteBrandCoupons([]);
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      
      // Load public data
      const [popularData, categoriesData, brandsData, slidersData] = await Promise.all([
        dataAPI.getCoupons({ limit: 10, popular: true }).then(data => {
          console.log('Coupons response:', data);
          return data;
        }).catch(err => {
          console.error('Error loading coupons:', err);
          return [];
        }),
        dataAPI.getCategories({ limit: 6 }).then(data => {
          // Kategorileri kupon sayısına göre sırala
          if (Array.isArray(data)) {
            const sortedCategories = data.sort((a, b) => {
              const countA = (a as any).coupons_count || (a as any).coupon_codes_count || (a as any).coupon_count || 0;
              const countB = (b as any).coupons_count || (b as any).coupon_codes_count || (b as any).coupon_count || 0;
              return countB - countA;
            });
            return sortedCategories;
          }
          return data;
        }).catch(err => {
          console.error('Error loading categories:', err);
          return [];
        }),
        dataAPI.getBrands({ limit: 8 }).then(data => {
          // Markaları kupon sayısına göre sırala
          if (Array.isArray(data)) {
            const sortedBrands = data.sort((a, b) => {
              const countA = (a as any).coupons_count || (a as any).coupon_codes_count || (a as any).coupon_count || 0;
              const countB = (b as any).coupons_count || (b as any).coupon_codes_count || (b as any).coupon_count || 0;
              return countB - countA;
            });
            return sortedBrands;
          }
          return data;
        }).catch(err => {
          console.error('Error loading brands:', err);
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
      console.log('Brands count:', Array.isArray(brandsData) ? brandsData.length : 'Not array');
      console.log('Sliders count:', Array.isArray(slidersData) ? slidersData.length : 'Not array');

      setPopularCoupons(popularData || []);
      setCategories(categoriesData || []);
      setPopularBrands(brandsData || []);
      setSliders(slidersData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboardData(),
      generateRecommendations(),
      loadFavoriteBrandCoupons()
    ]);
    setRefreshing(false);
  };

  const calculateTotalSavings = () => {
    // Bu fonksiyon backend'den kullanılan kuponların toplamını alacak
    // Şimdilik basit bir hesaplama yapıyoruz
    let totalSavings = 0;
    
    // Favori kuponlardaki fixed amount indirimlerini hesapla
    favoriteCoupons.forEach(coupon => {
      if (coupon.discount_type === 'fixed_amount' && coupon.discount_value) {
        totalSavings += Number(coupon.discount_value);
      }
    });
    
    // Favori brand kuponlarından da ekle
    favoriteBrandCoupons.forEach(coupon => {
      if (('discount_type' in coupon && coupon.discount_type === 'fixed_amount') && 
          ('discount_value' in coupon && coupon.discount_value)) {
        totalSavings += Number(coupon.discount_value);
      }
    });
    
    // TODO: Backend'den gerçek kullanım verilerini al
    return user?.totalSavings || totalSavings;
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
          onPress={() => navigation.navigate('Profile', { 
            screen: 'Favorites' 
          })}
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
          onPress={() => navigation.navigate('Brands')}
        >
          <Ionicons name="storefront" size={24} color="#9C27B0" />
          <Text style={styles.actionText}>Markalar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalizedCoupons = () => {
    // Kullanıcı giriş yapmışsa ve favori markaları varsa onlardan kuponları göster
    // Yoksa popüler kuponları göster
    let couponsToShow: Coupon[] = [];
    let sectionTitle = '';
    let isFromFavoriteBrands = false;
    let isFromPersonalized = false;
    
    if (isAuthenticated && favoriteBrandCoupons.length > 0) {
      couponsToShow = favoriteBrandCoupons;
      sectionTitle = 'Favori Markalarınızdan Yeni Kuponlar';
      isFromFavoriteBrands = true;
    } else if (isAuthenticated && personalizedCoupons.length > 0) {
      couponsToShow = personalizedCoupons.map(pc => ({...pc} as Coupon));
      sectionTitle = 'Sizin İçin Öneriler';
      isFromPersonalized = true;
    } else {
      couponsToShow = popularCoupons;
      sectionTitle = isAuthenticated ? 'Sizin İçin Önerilenler' : 'Popüler Kuponlar';
    }
    
    console.log('Rendering coupons:', couponsToShow.length, 'items, section:', sectionTitle);
    
    return (
      <View style={styles.personalizedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {sectionTitle}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recommendations')}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {couponsToShow.length === 0 ? (
          <View style={styles.emptyCouponsContainer}>
            <Text style={styles.emptyCouponsText}>
              {isAuthenticated ? 'Henüz kupon yok. Markaları takip ederek kişisel öneriler alabilirsiniz!' : 'Kupon bulunamadı'}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.couponsScroll}
          >
            {couponsToShow.slice(0, 6).map((coupon) => (
              <TouchableOpacity
                key={coupon.id}
                style={styles.couponCard}
                onPress={() => navigation.navigate('CouponDetail', { couponId: coupon.id })}
              >
                <View style={styles.couponImageContainer}>
                  <Image 
                    source={{ 
                      uri: getLogoUrl(('brand' in coupon && coupon.brand && typeof coupon.brand === 'object') 
                        ? coupon.brand.logo 
                        : null)
                    }} 
                    style={styles.couponImage}
                    onError={() => console.log('Image load error for coupon:', coupon.id)}
                    defaultSource={{ uri: getLogoUrl(null) }}
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
                  {isFromFavoriteBrands && (
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
                  
                  {isFromFavoriteBrands && (
                    <View style={styles.reasonContainer}>
                      <Ionicons name="heart" size={12} color="#E91E63" />
                      <Text style={styles.reasonText} numberOfLines={1}>
                        Favori markanızdan
                      </Text>
                    </View>
                  )}
                  
                  {isFromPersonalized && (personalizedCoupons.find(p => p.id === coupon.id) as any)?.reason && (
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
                <Text style={styles.categoryCount}>
                  {(category as any).coupons_count || (category as any).coupon_codes_count || (category as any).coupon_count || 0} kupon
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPopularBrands = () => {
    console.log('Rendering brands:', popularBrands.length, 'items');
    
    return (
      <View style={styles.brandsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popüler Markalar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Brands')}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {popularBrands.length === 0 ? (
          <View style={styles.emptyCouponsContainer}>
            <Text style={styles.emptyCouponsText}>Marka bulunamadı</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.brandsScroll}
          >
            {popularBrands.slice(0, 8).map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={styles.brandCard}
                onPress={() => navigation.navigate('BrandDetail', { brandId: brand.id })}
              >
                <View style={styles.brandLogoContainer}>
                  <Image 
                    source={{ 
                      uri: getLogoUrl(brand.logo)
                    }} 
                    style={styles.brandLogo}
                    defaultSource={{ uri: getLogoUrl(null) }}
                  />
                </View>
                <Text style={styles.brandName} numberOfLines={1}>
                  {brand.name}
                </Text>
                <Text style={styles.brandCouponCount}>
                  {(brand as any).coupons_count || (brand as any).coupon_codes_count || (brand as any).coupon_count || 0} kupon
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
      {renderPopularBrands()}
    </ScrollView>
  );
}

export default Dashboard;