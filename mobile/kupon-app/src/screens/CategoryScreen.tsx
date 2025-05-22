import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet, useWindowDimensions } from 'react-native'; // Import useWindowDimensions
import { RouteProp, useRoute } from '@react-navigation/native';
import { CategoryStackParamList } from '../navigation/types';
import { fetchCategoryById } from '../api';
import { Category, Coupon } from '../types';
import CardComponent from '../components/common/CardComponent';
import COLORS from '../constants/colors';
import createStyles from './CategoryScreen.styles'; // Import createStyles
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList, MainTabParamList } from '../navigation/types';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type CategoryScreenRouteProp = RouteProp<CategoryStackParamList, 'CategoryDetail'>;

// Define navigation prop type for CategoryScreen
type CategoryScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CategoryStackParamList, 'CategoryDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

const CategoryScreen: React.FC = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryId } = route.params;
  const [category, setCategory] = useState<Category | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions(); // Get window dimensions
  const styles = createStyles(width); // Create styles dynamically

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        const categoryData = await fetchCategoryById(categoryId);
        setCategory(categoryData);

        if (categoryData && categoryData.coupon_codes) {
          setCoupons(categoryData.coupon_codes);
        } else {
          setCoupons([]); // Set to empty array if no coupons are loaded
        }
        
        setError(null);
      } catch (err) {
        setError('Kategori bilgileri yüklenirken bir hata oluştu.');
        console.error('Error loading category details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponsTab', {
      screen: 'CouponDetail',
      params: { couponId },
    } as NavigatorScreenParams<CouponStackParamList>); // Type assertion for params
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={styles.centered} />;
  }

  if (error || !category) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error || 'Kategori bulunamadı.'}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {category.image && (
          <Image 
            source={{ uri: category.image }} 
            style={styles.categoryImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          {category.description && (
            <Text style={styles.categoryDescription}>{category.description}</Text>
          )}
        </View>
      </View>

      {coupons.length > 0 ? (
        <View style={styles.couponsSection}>
          <Text style={styles.sectionTitle}>Bu Kategorideki Kuponlar</Text>
          <FlatList
            data={coupons}
            renderItem={({ item }) => (
              <CardComponent 
                item={{ ...item, type: 'coupon' }}
                onPress={() => handleCouponPress(item.id)}
                style={styles.couponCard} // This style might need adjustment or removal if CardComponent handles all its layout
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Nested scrolling önlemek için
            // numColumns could be added here if we want multiple columns for coupons on this screen
            // For now, it defaults to a vertical list (1 column)
          />
        </View>
      ) : (
        <View style={styles.noCouponsContainer}>
          <Text style={styles.noCouponsText}>Bu kategoride henüz kupon bulunmamaktadır.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CategoryScreen;
