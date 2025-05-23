import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BrandStackParamList,
  CouponStackParamList,
  MainTabParamList,
} from '../navigation/types';
import { fetchBrandById, fetchCouponCodes } from '../api';
import { Brand, Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import colors from '../constants/colors';
import CardComponent from '../components/common/CardComponent';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { createStyles } from './BrandScreen.styles';

type BrandScreenRouteProp = RouteProp<BrandStackParamList, 'BrandDetail'>;

// Combine BrandStackNavigation with MainTabNavigation for navigating to other tabs
type BrandScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<BrandStackParamList, 'BrandDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface BrandScreenProps {
  route: BrandScreenRouteProp;
  navigation: BrandScreenNavigationProp;
}

function BrandScreen({
  route,
  navigation,
}: BrandScreenProps): React.JSX.Element {
  const { brandId } = route.params;
  const { width: windowWidth } = useWindowDimensions(); // Get window width
  const { styles, numColumns } = createStyles(windowWidth); // Get styles and numColumns

  const {
    data: brand,
    isLoading: brandLoading,
    error: brandError,
  } = useQuery<Brand, Error>({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
  });

  const {
    data: coupons,
    isLoading: couponsLoading,
    error: couponsError,
  } = useQuery<Coupon[], Error>({
    queryKey: ['coupons', 'brand', brandId],
    queryFn: () => fetchCouponCodes({ brand_id: brandId }), // Pass brandId directly
    enabled: !!brand, // Only run this query if brand data is available
  });

  useEffect(() => {
    if (brand) {
      navigation.setOptions({ title: brand.name || 'Marka Detayı' });
    }
  }, [brand, navigation]);

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponsTab', {
      screen: 'CouponDetail',
      params: { couponId },
    } as NavigatorScreenParams<CouponStackParamList>); // Type assertion for params
  };

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const isLoading = brandLoading || couponsLoading;
  const error = brandError || couponsError;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>
          {error.message || 'Veri yüklenirken bir hata oluştu.'}
        </Text>
      </SafeAreaView>
    );
  }

  if (!brand) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Marka bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const brandLogoUrl = brand.logo // Changed from brand.image to brand.logo
    ? brand.logo.startsWith('http') || brand.logo.startsWith('https')
      ? brand.logo
      : `${API_BASE_URL.replace('/api', '')}${brand.logo}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              {brandLogoUrl && (
                <Image
                  source={{ uri: brandLogoUrl }}
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.brandName}>{brand.name}</Text>
              {brand.description && (
                <Text style={styles.brandDescription}>{brand.description}</Text>
              )}
              {brand.website_url && (
                <TouchableOpacity
                  onPress={() => handleWebsitePress(brand.website_url!)}>
                  <Text style={styles.websiteLink}>Website Git</Text>
                </TouchableOpacity>
              )}
            </View>
            {coupons && coupons.length > 0 && (
              <Text style={styles.couponsHeader}>Bu Markaya Ait Kuponlar</Text>
            )}
          </>
        }
        ListHeaderComponentStyle={styles.listHeaderStyle}
        data={coupons || []} // Use coupons from useQuery, default to empty array
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CardComponent
              item={{ ...item, type: 'coupon' }} // Spread coupon properties and add type
              onPress={() => handleCouponPress(item.id)}
            />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns} // Use dynamic numColumns
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          !isLoading && (!coupons || coupons.length === 0) ? (
            <View style={styles.emptyCouponsContainer}>
              <Text style={styles.noCouponsText}>
                Bu markaya ait aktif kupon bulunmamaktadır.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

export default BrandScreen;
