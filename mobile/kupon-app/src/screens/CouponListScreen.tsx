import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CouponListScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import { fetchCouponCodes } from '../api'; 
import COLORS from '../constants/colors';
import CardComponent from '../components/common/CardComponent';

// Tip tanımlamaları
type CouponListScreenNavigationProp = StackNavigationProp<CouponStackParamList, 'CouponList'>;

interface CouponListScreenProps {
  navigation: CouponListScreenNavigationProp;
}

function CouponListScreen({ navigation }: CouponListScreenProps): React.JSX.Element {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedCoupons = await fetchCouponCodes(); // fetchCouponCodes doğrudan Coupon[] döndürüyor
        setCoupons(fetchedCoupons); 
      } catch (err) {
        setError('Kuponlar yüklenirken bir hata oluştu.');
        console.error('Fetch Coupon Codes Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCoupons();
  }, []);

  const handleCouponPress = (couponId: number) => { // couponId number olmalı
    navigation.navigate('CouponDetail', { couponId: couponId }); // toString() kaldırıldı
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <CardComponent
      item={{ ...item, type: 'coupon' }} // CardComponent'e type ile birlikte item gönder
      onPress={() => handleCouponPress(item.id)}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {coupons.length > 0 ? (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Kupon bulunamadı.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default CouponListScreen;
