import React from 'react';
import {
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, MainTabParamList } from '../navigation/types';
import { Category, Slider, Coupon, Brand } from '../types';
import SectionHeaderComponent from '../components/common/SectionHeaderComponent';
import CardComponent from '../components/common/CardComponent';
import SliderComponent from '../components/common/SliderComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { 
  useCategories, 
  useSliders, 
  usePopularCoupons, 
  usePopularBrands 
} from '../hooks/useQueries';
import { useTheme } from '../theme';
import { 
  CenteredContainer,
  Text 
} from '../components/styled';

// Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const LoadingContainer = styled(CenteredContainer)`
  background-color: ${(props: any) => props.theme.colors.background};
`;

const SectionContainer = styled(View)`
  margin-bottom: ${(props: any) => props.theme.spacing.lg}px;
`;

const ItemsContainer = styled(View)<{ numColumns: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-horizontal: ${(props: any) => props.theme.spacing.sm}px;
`;

const ItemWrapper = styled(View)<{ width: number }>`
  width: ${(props: any) => props.width}px;
  margin-bottom: ${(props: any) => props.theme.spacing.sm}px;
`;

// HomeScreen için birleşik navigasyon tipi
type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<MainTabParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  // Responsive layout
  const numColumns = width < 600 ? 2 : 3;
  const itemWidth = (width - (numColumns + 1) * theme.spacing.md) / numColumns;

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

  // Navigation handlers
  const handleCouponPress = (coupon: Coupon) => {
    navigation.navigate('CouponDetail', { couponId: coupon.id });
  };

  const handleBrandPress = (brand: Brand) => {
    navigation.navigate('BrandDetail', { brandId: brand.id });
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  const handleSliderPress = (slider: Slider) => {
    console.log('Slider pressed:', slider.title);
  };

  const handleSeeAllPress = (section: string) => {
    switch (section) {
      case 'coupons':
        navigation.navigate('CouponsTab', { screen: 'CouponList' });
        break;
      case 'brands':
        navigation.navigate('BrandsTab', { screen: 'BrandList' });
        break;
      case 'categories':
        navigation.navigate('CategoriesTab', { screen: 'CategoryList' });
        break;
    }
  };

  // Render functions
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CardComponent
      item={{ ...item, type: 'category' }}
      onPress={() => handleCategoryPress(item)}
      horizontal={true}
    />
  );

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <CardComponent
      item={{ ...item, type: 'coupon' }}
      onPress={() => handleCouponPress(item)}
      horizontal={true}
    />
  );

  const renderBrandItem = ({ item }: { item: Brand }) => (
    <CardComponent
      item={{ ...item, type: 'brand' }}
      onPress={() => handleBrandPress(item)}
      horizontal={true}
    />
  );

  // Loading and error states
  if (categoriesLoading || slidersLoading || couponsLoading || brandsLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner message="Ana sayfa yükleniyor..." fullScreen />
      </LoadingContainer>
    );
  }

  if (categoriesError || slidersError || couponsError || brandsError) {
    const error = categoriesError || slidersError || couponsError || brandsError;
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
};

export default HomeScreen;
