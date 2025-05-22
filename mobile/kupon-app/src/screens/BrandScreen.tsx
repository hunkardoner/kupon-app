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
  ViewStyle,
  TextStyle,
  ImageStyle,
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

// Define createStyles function
const createStyles = (width: number) => {
  const numColumns = width < 600 ? 2 : 3; // Example: 2 columns for smaller screens, 3 for wider
  const logoSize = width * 0.3; // Example: logo width as 30% of screen width
  const logoHeight = logoSize * 0.5; // Example: maintain a 2:1 aspect ratio for the logo

  const styles = {
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    } as ViewStyle,
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    headerContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    } as ViewStyle,
    listHeaderStyle: {
      marginBottom: 0,
      zIndex: 1,
    } as ViewStyle,
    brandLogo: {
      width: logoSize, // Dynamic width
      height: logoHeight, // Dynamic height
      marginBottom: 15,
    } as ImageStyle,
    brandName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
      textAlign: 'center',
    } as TextStyle,
    brandDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
      paddingHorizontal: 10,
    } as TextStyle,
    websiteLink: {
      fontSize: 16,
      color: colors.secondary,
      fontWeight: '600',
      marginBottom: 10,
      textDecorationLine: 'underline',
    } as TextStyle,
    couponsHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      marginBottom: 8,
    } as TextStyle,
    listContentContainer: {
      paddingBottom: 10,
      paddingHorizontal: 16,
    } as ViewStyle,
    cardWrapper: {
      marginBottom: 10,
    } as ViewStyle,
    columnWrapper: {
      justifyContent: 'space-between',
      marginHorizontal: 0,
    } as ViewStyle,
    emptyCouponsContainer: {
      padding: 20,
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    } as ViewStyle,
    noCouponsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: colors.textSecondary,
    } as TextStyle,
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      padding: 20,
    } as TextStyle,
  };
  return { styles, numColumns };
};

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
