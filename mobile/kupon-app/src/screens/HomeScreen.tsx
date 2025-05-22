import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, MainTabParamList } from '../navigation/types';
import { fetchCategories, fetchSliders, fetchCouponCodes, fetchBrands } from '../api';
import { Category, Slider, Coupon, Brand } from '../types';
import SectionHeaderComponent from '../components/common/SectionHeaderComponent';
import CardComponent from '../components/common/CardComponent';
import SliderComponent from '../components/common/SliderComponent';
import createStyles from './HomeScreen.styles'; // Import createStyles
import COLORS from '../constants/colors';

// HomeScreen için birleşik navigasyon tipi
type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'Home'>, // Changed 'HomeMain' to 'Home'
  BottomTabNavigationProp<MainTabParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [popularCoupons, setPopularCoupons] = useState<Coupon[]>([]);
  const [popularBrands, setPopularBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions(); // Get window dimensions
  const styles = createStyles(width); // Create styles dynamically

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();
        const slidersData = await fetchSliders();
        const couponsData = await fetchCouponCodes({ limit: 5, popular: true });
        const brandsData = await fetchBrands({ limit: 5, popular: true });

        setCategories(categoriesData);
        setSliders(slidersData);
        setPopularCoupons(couponsData);
        setPopularBrands(brandsData);
        setError(null);
      } catch (err) {
        setError('Veri yüklenirken bir hata oluştu.');
        console.error('Error loading home screen data:', err);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={styles.centered} />;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const handleCategoryPress = (item: Category) => {
    console.log('Category pressed:', item.name);
    navigation.navigate('CategoriesTab', { screen: 'CategoryDetail', params: { categoryId: item.id } });
  };

  const handleCouponPress = (item: Coupon) => {
    navigation.navigate('CouponsTab', { screen: 'CouponDetail', params: { couponId: item.id } });
  };

  const handleBrandPress = (item: Brand) => {
    navigation.navigate('BrandsTab', { screen: 'BrandDetail', params: { brandId: item.id } });
  };

  const handleSliderPress = (slider: Slider) => {
    console.log('Slider pressed:', slider.title);
    if (slider.related_coupon_id) {
      navigation.navigate('CouponsTab', { screen: 'CouponDetail', params: { couponId: slider.related_coupon_id } });
    } else if (slider.related_brand_id) {
      navigation.navigate('BrandsTab', { screen: 'BrandDetail', params: { brandId: slider.related_brand_id } });
    }
    // else if (slider.link_url) { /* Open link_url */ }
  };

  return (
    <ScrollView style={styles.container}>
      {sliders.length > 0 && (
        <SliderComponent sliders={sliders} onPressSlider={handleSliderPress} />
      )}

      {categories.length > 0 && (
        <View style={styles.sectionContainer}>
          <SectionHeaderComponent title="Kategoriler" />
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CardComponent
                item={{ ...item, type: 'category' }}
                onPress={() => handleCategoryPress(item)}
                horizontal={true}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </View>
      )}

      {popularCoupons.length > 0 && (
        <View style={styles.sectionContainer}>
          <SectionHeaderComponent 
            title="Popüler Kuponlar" 
            onSeeAllPress={() => navigation.navigate('CouponsTab', { screen: 'CouponList' })} 
          />
          <FlatList
            data={popularCoupons}
            renderItem={({ item }) => (
              <CardComponent
                item={{ ...item, type: 'coupon' }}
                onPress={() => handleCouponPress(item)}
                horizontal={true}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </View>
      )}

      {popularBrands.length > 0 && (
        <View style={styles.sectionContainer}>
          <SectionHeaderComponent 
            title="Popüler Markalar" 
            onSeeAllPress={() => navigation.navigate('BrandsTab', { screen: 'BrandList' })} 
          />
          <FlatList
            data={popularBrands}
            renderItem={({ item }) => (
              <CardComponent
                item={{ ...item, type: 'brand' }}
                onPress={() => handleBrandPress(item)}
                horizontal={true}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
