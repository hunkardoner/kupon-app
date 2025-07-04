import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Share,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Clipboard from 'expo-clipboard';
import { CouponStackParamList, RootStackParamList } from '../../../navigation/types';
import { Coupon } from '../../../types';
import { API_BASE_URL, dataAPI, userAPI } from '../../../api/index';
import { useFavorites } from '../../../context/FavoritesContext';
import { styles } from './style';

const { width, height } = Dimensions.get('window');

type CouponScreenRouteProp = RouteProp<CouponStackParamList, 'CouponDetail'>;
type CouponScreenNavigationProp = StackNavigationProp<CouponStackParamList, 'CouponDetail'>;

interface CouponScreenProps {
  route: CouponScreenRouteProp;
  navigation: CouponScreenNavigationProp;
}

const CouponScreen: React.FC<CouponScreenProps> = ({ route, navigation: stackNavigation }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { couponId } = route.params;
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = coupon ? favorites.includes(coupon.id.toString()) : false;

  useEffect(() => {
    loadCoupon();
  }, [couponId]);

  const loadCoupon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const couponData = await dataAPI.getCoupon(couponId);
      setCoupon(couponData);
    } catch (err) {
      console.error('Failed to load coupon:', err);
      setError('Kupon yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!coupon?.code) return;

    try {
      await Clipboard.setStringAsync(coupon.code);
      setCopySuccess(true);
      
      // Track usage
      await dataAPI.trackCouponUsage(coupon.id);
      
      setTimeout(() => setCopySuccess(false), 2000);
      
      Alert.alert(
        'Kupon Kopyalandı!',
        `"${coupon.code}" kupon kodu panoya kopyalandı. Şimdi markaya giderek kuponu kullanabilirsiniz.`,
        [
          {
            text: 'Kuponu Kullan',
            onPress: () => handleUseCoupon(),
          },
          {
            text: 'Tamam',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Kupon kodu kopyalanırken bir hata oluştu');
    }
  };

  const handleUseCoupon = () => {
    if (!coupon?.campaign_url) {
      Alert.alert('Hata', 'Kupon bağlantısı bulunamadı');
      return;
    }

    Linking.openURL(coupon.campaign_url).catch(() => {
      Alert.alert('Hata', 'Kupon açılırken bir hata oluştu');
    });
  };

  const handleBrandPress = () => {
    if (!coupon?.brand?.id) return;
    navigation.navigate('BrandDetail', { brandId: coupon.brand.id });
  };

  const handleCategoryPress = (categoryId: number) => {
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const handleFavoriteToggle = async () => {
    if (!coupon) return;

    try {
      if (isFavorite) {
        await removeFavorite(coupon.id.toString());
      } else {
        await addFavorite(coupon.id.toString());
      }
    } catch (error) {
      Alert.alert('Hata', 'Favori işlemi sırasında bir hata oluştu');
    }
  };

  const handleShare = async () => {
    if (!coupon) return;

    try {
      const shareContent = {
        message: `${coupon.title}\n\nKupon Kodu: ${coupon.code}\n\n${coupon.description}`,
        url: coupon.link || '',
      };

      await Share.share(shareContent);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => stackNavigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFavoriteToggle}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#f44336' : '#666'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCouponCard = () => {
    if (!coupon) return null;

    let logoUrl = coupon.brand?.logo;
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `${API_BASE_URL.replace('/api', '')}${logoUrl}`;
    }

    const expired = coupon.expiry_date ? isExpired(coupon.expiry_date) : false;

    return (
      <View style={styles.couponCard}>
        {/* Brand Info */}
        <TouchableOpacity style={styles.brandSection} onPress={handleBrandPress}>
          <Image
            source={{
              uri: logoUrl || 'https://via.placeholder.com/80x80?text=Logo'
            }}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>{coupon.brand?.name || 'Marka'}</Text>
        </TouchableOpacity>

        {/* Coupon Title */}
        <Text style={styles.couponTitle}>{coupon.title}</Text>

        {/* Discount Badge */}
        {coupon.discount_amount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {coupon.discount_type === 'percentage' ? '%' : '₺'}{coupon.discount_amount}
              {coupon.discount_type === 'percentage' ? ' İndirim' : ' İndirim'}
            </Text>
          </View>
        )}

        {/* Coupon Code */}

        <View style={styles.couponCodeSection}>

          <Text style={styles.codeTitle}> {coupon.campaign_title} </Text>
        
        </View>

        <View style={[styles.codeContainer, expired && styles.expiredCodeContainer]}>
          <Text style={styles.codeLabel}>Kupon Kodu</Text>
          <View style={styles.codeRow}>
            <Text style={[styles.codeText, expired && styles.expiredText]}>
              {coupon.code}
            </Text>
            <TouchableOpacity
              style={[styles.copyButton, expired && styles.disabledButton]}
              onPress={handleCopyCode}
              disabled={expired}
            >
              <Ionicons
                name={copySuccess ? 'checkmark' : 'copy-outline'}
                size={16}
                color={expired ? '#999' : 'white'}
              />
              <Text style={[styles.copyButtonText, expired && styles.disabledButtonText]}>
                {copySuccess ? 'Kopyalandı!' : 'Kopyala'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, expired && styles.disabledButton]}
            onPress={handleUseCoupon}
            disabled={expired || !coupon.campaign_url}
          >
            <Ionicons
              name="gift-outline"
              size={20}
              color={expired ? '#999' : 'white'}
            />
            <Text style={[styles.primaryButtonText, expired && styles.disabledButtonText]}>
              Kuponu Kullan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expiry Status */}
        {coupon.expiry_date && (
          <View style={[styles.expirySection, expired && styles.expiredSection]}>
            <Ionicons
              name={expired ? 'time-outline' : 'calendar-outline'}
              size={16}
              color={expired ? '#f44336' : '#4CAF50'}
            />
            <Text style={[styles.expiryText, expired && styles.expiredText]}>
              {expired
                ? `Son kullanma tarihi: ${formatDate(coupon.expiry_date)} (Süresi dolmuş)`
                : `Son kullanma tarihi: ${formatDate(coupon.expiry_date)}`
              }
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderDetails = () => {
    if (!coupon) return null;

    return (
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Kupon Detayları</Text>

        {/* Description */}
        {coupon.description && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Açıklama</Text>
            <Text style={styles.detailValue}>{coupon.description}</Text>
          </View>
        )}

        {/* Terms */}
        {coupon.terms && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Kullanım Koşulları</Text>
            <Text style={styles.detailValue}>{coupon.terms}</Text>
          </View>
        )}

        {/* Categories */}
        {coupon.categories && coupon.categories.length > 0 && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Kategoriler</Text>
            <View style={styles.categoriesContainer}>
              {coupon.categories.map((category: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryTag}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <Text style={styles.categoryTagText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.infoGrid}>
          {coupon.minimum_amount && (
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Minimum {coupon.minimum_amount}₺
              </Text>
            </View>
          )}
          
          {coupon.usage_limit && (
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Kullanım limiti: {coupon.usage_limit}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLoadingState = () => (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Kupon yükleniyor...</Text>
      </View>
    </SafeAreaView>
  );

  const renderErrorState = () => (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.centerContent}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCoupon}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (error || !coupon) {
    return renderErrorState();
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderCouponCard()}
        {renderDetails()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CouponScreen;
