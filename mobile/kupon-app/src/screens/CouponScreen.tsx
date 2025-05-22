import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { fetchCouponCodeById } from '../api';
import { Coupon } from '../types';
import { API_BASE_URL } from '../api/index'; // Corrected: import named export
import colors from '../constants/colors';

type CouponScreenRouteProp = RouteProp<CouponStackParamList, 'CouponDetail'>;
type CouponScreenNavigationProp = StackNavigationProp<
  CouponStackParamList,
  'CouponDetail'
>;

interface CouponScreenProps {
  route: CouponScreenRouteProp;
  navigation: CouponScreenNavigationProp;
}

function CouponScreen({
  route,
  navigation,
}: CouponScreenProps): React.JSX.Element {
  const { couponId } = route.params;
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoupon = async () => {
      try {
        setLoading(true);
        const fetchedCoupon = await fetchCouponCodeById(couponId);
        setCoupon(fetchedCoupon);
        navigation.setOptions({
          title: fetchedCoupon.brand?.name || 'Kupon Detayı',
        });
        setError(null);
      } catch (e) {
        console.error('Failed to fetch coupon details', e);
        setError('Kupon detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
  }, [couponId, navigation]);

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

  if (!coupon) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Kupon bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const brandLogoUrl = coupon.brand?.logo // Changed from coupon.brand?.image to coupon.brand?.logo
    ? coupon.brand.logo.startsWith('http')
      ? coupon.brand.logo
      : `${API_BASE_URL.replace('/api', '')}${coupon.brand.logo}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {brandLogoUrl && (
          <Image
            source={{ uri: brandLogoUrl }}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        )}
        <Text style={styles.brandName}>{coupon.brand?.name}</Text>
        <Text style={styles.couponCodeLabel}>Kupon Kodu:</Text>
        <Text style={styles.couponCode}>{coupon.code}</Text>
        <Text style={styles.description}>{coupon.description}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>İndirim:</Text>
          <Text style={styles.detailValue}>
            {coupon.discount_type === 'percentage'
              ? `%${coupon.discount_value}`
              : `${coupon.discount_value} TL`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Geçerlilik Tarihi:</Text>
          <Text style={styles.detailValue}>
            {new Date(coupon.start_date).toLocaleDateString()} -{' '}
            {new Date(coupon.end_date).toLocaleDateString()}
          </Text>
        </View>
        {coupon.categories && coupon.categories.length > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kategoriler:</Text>
            <View style={styles.categoriesContainer}>
              {coupon.categories.map(category => (
                <Text key={category.id} style={styles.categoryTag}>
                  {category.name}
                </Text>
              ))}
            </View>
          </View>
        )}
        {/* Diğer kupon detayları eklenebilir */}
      </View>
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
  contentContainer: {
    padding: 20,
    alignItems: 'center', // İçeriği ortala
  },
  brandLogo: {
    width: 150,
    height: 75,
    marginBottom: 15,
  },
  brandName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  couponCodeLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 15,
  },
  couponCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary, // Changed from colors.accent
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.border, // Changed from colors.lightGray
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flexShrink: 1, // Allow text to shrink if needed
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1, // Take remaining space
    marginLeft: 8, // Add some space between label and tags
  },
  categoryTag: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
  },
});

export default CouponScreen;
