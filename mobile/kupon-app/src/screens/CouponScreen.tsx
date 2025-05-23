import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { fetchCouponCodeById } from '../api';
import { Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import colors from '../constants/colors';
import { couponScreenStyles as styles } from './CouponScreen.styles';

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

  const brandLogoUrl = coupon.brand?.logo
    ? coupon.brand.logo.startsWith('http')
      ? coupon.brand.logo
      : `${API_BASE_URL.replace('/api', '')}${coupon.brand.logo}`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        accessible={true}
        accessibilityLabel={coupon.brand?.name ? `${coupon.brand.name} kupon detayları` : "Kupon detayları"}>
        {brandLogoUrl && (
          <Image
            source={{ uri: brandLogoUrl }}
            style={styles.brandLogo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={coupon.brand?.name ? `${coupon.brand.name} logosu` : "Marka logosu"}
            accessibilityRole="image"
          />
        )}
        <Text
          style={styles.brandName}
          accessible={true}
          accessibilityRole="header">
          {coupon.brand?.name}
        </Text>
        <Text style={styles.couponCodeLabel}>Kupon Kodu:</Text>
        <Text
          style={styles.couponCode}
          accessible={true}
          accessibilityLabel={`Kupon kodu: ${coupon.code}`}>
          {coupon.code}
        </Text>
        <View style={styles.detailRow}>
          <Text
            style={styles.detailLabel}
            accessible={true}
            accessibilityLabel="İndirim etiketi">
            İndirim:
          </Text>
          <Text
            style={styles.detailValue}
            accessible={true}
            accessibilityLabel={`İndirim değeri: ${
              coupon.discount_type === 'percentage'
                ? `%${coupon.discount_value}`
                : `${coupon.discount_value} TL`
            }`}>
            {coupon.discount_type === 'percentage'
              ? `%${coupon.discount_value}`
              : `${coupon.discount_value} TL`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text
            style={styles.detailLabel}
            accessible={true}
            accessibilityLabel="Geçerlilik tarihi etiketi">
            Geçerlilik Tarihi:
          </Text>
          <Text
            style={styles.detailValue}
            accessible={true}
            accessibilityLabel={`Geçerlilik tarihi: ${new Date(
              coupon.start_date,
            ).toLocaleDateString()} tire ${new Date(
              coupon.end_date,
            ).toLocaleDateString()}`}>
            {new Date(coupon.start_date).toLocaleDateString()} -{' '}
            {new Date(coupon.end_date).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={styles.description}
          accessible={true}
          accessibilityLabel={`Açıklama: ${coupon.description}`}>
          {coupon.description}
        </Text>
        {coupon.categories && coupon.categories.length > 0 && (
          <View style={styles.detailRow}>
            <Text
              style={styles.detailLabel}
              accessible={true}
              accessibilityLabel="Kategoriler etiketi">
              Kategoriler:
            </Text>
            <View style={styles.categoriesContainer}>
              {coupon.categories.map(category => (
                <Text
                  key={category.id}
                  style={styles.categoryTag}
                  accessible={true}
                  accessibilityLabel={category.name}>
                  {category.name}
                </Text>
              ))}
            </View>
          </View>
        )}
        {/* Diğer kupon detayları eklenebilir */}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CouponScreen;
