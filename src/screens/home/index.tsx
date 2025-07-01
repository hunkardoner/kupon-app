import React, { useMemo, useCallback } from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
  NavigationProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Category, Slider, Coupon, Brand } from '../../types';
import SectionHeaderComponent from '../../components/common/section-header';
import { CouponCard } from '../../components/common/coupon-card';
import { CategoryCard } from '../../components/common/category-card';
import { BrandCard } from '../../components/common/brand-card';
import SliderComponent from '../../components/common/slider-component';
import LoadingSpinner from '../../components/common/loading-spinner';
import ErrorDisplay from '../../components/common/error-display';
import { 
  useCategories, 
  useSliders, 
  usePopularCoupons, 
  usePopularBrands 
} from '../../hooks/useQueries';
import { useTheme } from '../../theme';
import { 
  Container,
  LoadingContainer,
  SectionContainer,
  ItemsContainer,
  ItemWrapper
} from './style';

// HomeScreen için birleşik navigasyon tipi - hem tab navigation hem root navigation için
type HomeScreenNavigationProp = NavigationProp<RootStackParamList & MainTabParamList>;

const HomeScreen: React.FC = React.memo(() => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  // Responsive layout - memoized to avoid recalculation
  const layoutConfig = useMemo(() => {
    const numColumns = width < 600 ? 2 : 3;
    const itemWidth = (width - (numColumns + 1) * theme.spacing.md) / numColumns;
    return { numColumns, itemWidth };
  }, [width, theme.spacing.md]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    data: sliders,
    isLoading: slidersLoading,
    error: slidersError,
  } = useSliders();

  const {
    data: popularCoupons,
    isLoading: couponsLoading,
    error: couponsError,
  } = usePopularCoupons();

  const {
    data: popularBrands,
    isLoading: brandsLoading,
    error: brandsError,
  } = usePopularBrands();

  // Memoized navigation handlers to prevent unnecessary re-renders
  const handleCouponPress = useCallback((coupon: Coupon) => {
    navigation.navigate('CouponDetail', { couponId: coupon.id });
  }, [navigation]);

  const handleBrandPress = useCallback((brand: Brand) => {
    navigation.navigate('BrandDetail', { brandId: brand.id });
  }, [navigation]);

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  }, [navigation]);

  const handleSliderPress = useCallback((slider: Slider) => {
    console.log('Slider pressed:', slider.title);
  }, []);

  const handleSeeAllPress = useCallback((section: string) => {
    switch (section) {
      case 'coupons':
        navigation.navigate('Coupons', { screen: 'CouponList' });
        break;
      case 'brands':
        navigation.navigate('Brands', { screen: 'BrandList' });
        break;
      case 'categories':
        navigation.navigate('Categories', { screen: 'CategoryList' });
        break;
    }
  }, [navigation]);

  // Memoized render functions to avoid recreation on each render
  const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
    <CategoryCard
      item={item}
      onPress={() => handleCategoryPress(item)}
      horizontal={true}
    />
  ), [handleCategoryPress]);

  const renderCouponItem = useCallback(({ item }: { item: Coupon }) => (
    <CouponCard
      item={item}
      onPress={() => handleCouponPress(item)}
    />
  ), [handleCouponPress]);

  const renderBrandItem = useCallback(({ item }: { item: Brand }) => (
    <BrandCard
      item={item}
      onPress={() => handleBrandPress(item)}
      horizontal={true}
    />
  ), [handleBrandPress]);

  // Memoized loading and error states
  const isLoading = useMemo(() => 
    categoriesLoading || slidersLoading || couponsLoading || brandsLoading,
    [categoriesLoading, slidersLoading, couponsLoading, brandsLoading]
  );

  const error = useMemo(() => 
    categoriesError || slidersError || couponsError || brandsError,
    [categoriesError, slidersError, couponsError, brandsError]
  );

  // Loading and error states
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner message="Ana sayfa yükleniyor..." fullScreen />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <ErrorDisplay
          error={error || undefined}
          message="Ana sayfa verileri yüklenirken bir hata oluştu"
        />
      </LoadingContainer>
    );
  }

  return (
    <Container contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
      {/* Sliders Section */}
      {sliders && sliders.length > 0 && (
        <SectionContainer>
          <SliderComponent 
            sliders={sliders} 
            onPress={handleSliderPress} 
          />
        </SectionContainer>
      )}

      {/* Popular Categories Section */}
      {categories && categories.length > 0 && (
        <SectionContainer>
          <SectionHeaderComponent
            title="Popüler Kategoriler"
            onSeeAllPress={() => handleSeeAllPress('categories')}
          />
          <FlatList
            data={categories.slice(0, 6)} // Sadece ilk 6 kategori
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
            }}
            ItemSeparatorComponent={() => <View style={{ width: theme.spacing.lg }} />}
          />
        </SectionContainer>
      )}

      {/* Popular Brands Section */}
      {popularBrands && popularBrands.length > 0 && (
        <SectionContainer>
          <SectionHeaderComponent
            title="Popüler Markalar"
            onSeeAllPress={() => handleSeeAllPress('brands')}
          />
          <FlatList
            data={popularBrands.slice(0, 8)} // Sadece ilk 8 marka
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
            }}
            ItemSeparatorComponent={() => <View style={{ width: theme.spacing.lg }} />}
          />
        </SectionContainer>
      )}

      {/* Popular Coupons Section */}
      {popularCoupons && popularCoupons.length > 0 && (
        <SectionContainer>
          <SectionHeaderComponent
            title="Popüler Kuponlar"
            onSeeAllPress={() => handleSeeAllPress('coupons')}
          />
          <FlatList
            data={popularCoupons.slice(0, 6)} // Sadece ilk 6 kupon
            renderItem={renderCouponItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
            }}
            ItemSeparatorComponent={() => <View style={{ width: theme.spacing.lg }} />}
          />
        </SectionContainer>
      )}
    </Container>
  );
});

// Display name for better debugging
HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
