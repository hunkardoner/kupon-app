import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { Coupon } from '../../../types';
import { CouponCard } from '../../../components/common/coupon-card';
import { styles } from './style';

interface FavoritesProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { favoriteCoupons, toggleFavorite, isLoading: favoritesLoading, refreshFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = async (couponId: number) => {
    try {
      await toggleFavorite(couponId);
      // The context will handle updating the state
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      Alert.alert('Hata', 'Favori kaldırılamadı');
    }
  };

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponDetail', { couponId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Favori Kuponlarım</Text>
      <View style={styles.headerRight}>
        <Text style={styles.headerCount}>{favoriteCoupons.length}</Text>
      </View>
    </View>
  );

  const renderCouponItem = (coupon: Coupon) => (
    <CouponCard
      key={coupon.id}
      item={coupon}
      onPress={handleCouponPress}
      showFavorite={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={64} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>Henüz favori kuponunuz yok</Text>
      <Text style={styles.emptySubtitle}>
        Beğendiğiniz kuponları favorilere ekleyerek buradan kolayca erişebilirsiniz
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('MainTabs', { 
          screen: 'Coupons', 
          params: { screen: 'CouponList' } 
        })}
      >
        <Text style={styles.browseButtonText}>Kuponları Keşfet</Text>
      </TouchableOpacity>
    </View>
  );

  if (favoritesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Favori kuponlarınız yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {favoriteCoupons.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.listContainer}>
            {favoriteCoupons.map(renderCouponItem)}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
