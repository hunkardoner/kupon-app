import React from 'react'; // Removed useEffect and useState
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useWindowDimensions, // Import useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from './CouponListScreen.styles'; // Import the function
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import { fetchCouponCodes } from '../api';
import COLORS from '../constants/colors';
import CardComponent from '../components/common/CardComponent';
import { useQuery } from '@tanstack/react-query'; // Import useQuery

// Tip tanımlamaları
type CouponListScreenNavigationProp = StackNavigationProp<
  CouponStackParamList,
  'CouponList'
>;

interface CouponListScreenProps {
  navigation: CouponListScreenNavigationProp;
}

function CouponListScreen({
  navigation,
}: CouponListScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions(); // Get window dimensions
  const { styles, numColumns } = createStyles(width); // Destructure styles and numColumns

  const {
    data: coupons,
    isLoading,
    error,
  } = useQuery<Coupon[], Error>({
    queryKey: ['coupons'],
    queryFn: () => fetchCouponCodes(), // Adjusted to call fetchCouponCodes
  });

  const handleCouponPress = (couponId: number) => {
    // couponId number olmalı
    navigation.navigate('CouponDetail', { couponId: couponId }); // toString() kaldırıldı
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <View style={styles.cardContainer}>
      <CardComponent
        item={{ ...item, type: 'coupon' }} // CardComponent'e type ile birlikte item gönder
        onPress={() => handleCouponPress(item.id)}
      />
    </View>
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
        <Text style={styles.errorText}>
          Kuponlar yüklenirken bir hata oluştu: {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {coupons && coupons.length > 0 ? (
        <FlatList
          data={coupons} // Use data from useQuery
          renderItem={renderCouponItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
          numColumns={numColumns} // Use dynamic numColumns from createStyles
          columnWrapperStyle={styles.columnWrapper}
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
