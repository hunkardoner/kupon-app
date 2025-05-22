import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrandStackParamList, CouponStackParamList, MainTabParamList } from '../navigation/types';
import { fetchBrandById, fetchCouponCodes } from '../api';
import { Brand, Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import colors from '../constants/colors';
import CardComponent from '../components/common/CardComponent';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

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

function BrandScreen({ route, navigation }: BrandScreenProps): React.JSX.Element {
  const { brandId } = route.params;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrandDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBrand = await fetchBrandById(brandId);
        setBrand(fetchedBrand);
        navigation.setOptions({ title: fetchedBrand.name || 'Marka Detayı' });

        if (fetchedBrand) {
          // Assuming API supports filtering coupons by brand_id in query params
          const fetchedCoupons = await fetchCouponCodes({ brand_id: fetchedBrand.id } as any);
          setCoupons(fetchedCoupons);
        }
      } catch (e) {
        console.error('Failed to fetch brand details', e);
        setError('Marka detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadBrandDetails();
  }, [brandId, navigation]);

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponsTab', {
      screen: 'CouponDetail',
      params: { couponId },
    } as NavigatorScreenParams<CouponStackParamList>); // Type assertion for params
  };

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
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

  const brandLogoUrl = brand.logo_url
    ? brand.logo_url.startsWith('http') || brand.logo_url.startsWith('https')
      ? brand.logo_url
      : `${API_BASE_URL.replace('/api', '')}${brand.logo_url}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {brandLogoUrl && (
              <Image source={{ uri: brandLogoUrl }} style={styles.brandLogo} resizeMode="contain" />
            )}
            <Text style={styles.brandName}>{brand.name}</Text>
            {brand.description && <Text style={styles.brandDescription}>{brand.description}</Text>}
            {brand.website_url && (
              <TouchableOpacity onPress={() => handleWebsitePress(brand.website_url!)}>
                <Text style={styles.websiteLink}>Website Git</Text>
              </TouchableOpacity>
            )}
            {coupons.length > 0 && <Text style={styles.couponsHeader}>Bu Markaya Ait Kuponlar</Text>}
          </View>
        }
        data={coupons}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CardComponent
              item={{ ...item, type: 'coupon' }} // Spread coupon properties and add type
              onPress={() => handleCouponPress(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          !loading && coupons.length === 0 ? (
            <View style={styles.emptyCouponsContainer}>
              <Text style={styles.noCouponsText}>Bu markaya ait aktif kupon bulunmamaktadır.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card, // White background for the header section
    marginBottom: 8, // Space before the list of coupons
  },
  brandLogo: {
    width: 120,
    height: 60,
    marginBottom: 15,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  brandDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  websiteLink: {
    fontSize: 16,
    color: colors.secondary, 
    fontWeight: '600',
    marginBottom: 20, // Increased space after the link
    textDecorationLine: 'underline',
  },
  couponsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    alignSelf: 'stretch', // Make header take full width
    textAlign: 'left',
    paddingHorizontal: 15, // Consistent padding
    marginTop: 10, // Space before the header text
    marginBottom: 10, // Space after the header text
  },
  listContentContainer: {
    paddingBottom: 10, // Padding at the bottom of the list
  },
  cardWrapper: {
    paddingHorizontal: 15, // Add horizontal padding to each card wrapper
    marginBottom: 10, // Add some space between cards
  },
  emptyCouponsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noCouponsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error, // Use error color from theme
    textAlign: 'center',
    padding: 20,
  },
});

export default BrandScreen;
