import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Coupon } from '../../../types';
import { FavoriteButton } from '../favorite-button';
import { styles } from './styles';

interface CouponCardProps {
  item: Coupon;
  onPress: (couponId: number) => void;
  showFavorite?: boolean;
}

export const CouponCard: React.FC<CouponCardProps> = ({ 
  item, 
  onPress, 
  showFavorite = true 
}) => {
  const isExpiringSoon = item.valid_to && 
    new Date(item.valid_to).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
  const isNew = item.created_at && 
    new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Logo URL'sini güvenli şekilde al
  const getLogoUrl = () => {
    const baseUrl = 'https://www.kuponcepte.com.tr';
    const defaultLogo = `${baseUrl}/storage/brands/default-brand-logo.png`;
    
    // Brand nesnesi yoksa default logo
    if (!item.brand || typeof item.brand !== 'object') {
      return defaultLogo;
    }
    
    // Logo property'si yoksa default logo
    if (!item.brand.logo) {
      return defaultLogo;
    }
    
    const logoUrl = item.brand.logo.trim();
    
    // Boş string kontrolü
    if (!logoUrl) {
      return defaultLogo;
    }
    
    // Eğer URL zaten tam URL ise olduğu gibi kullan
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      return logoUrl;
    }
    
    // Eğer slash ile başlıyorsa direkt base URL ekle
    if (logoUrl.startsWith('/')) {
      return `${baseUrl}${logoUrl}`;
    }
    
    // Eğer relative path ise storage path ekle
    return `${baseUrl}/storage/${logoUrl}`;
  };

  const logoUrl = getLogoUrl();

  return (
    <TouchableOpacity
      style={styles.couponCard}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.cardContent}>
        {/* Sol taraf - Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: logoUrl }}
            style={styles.brandLogo}
            onError={(error) => {
              console.log('CouponCard: Brand logo failed to load:', logoUrl, error.nativeEvent.error);
            }}
          />
          
          {/* Badges */}
          {(isNew || isExpiringSoon) && (
            <View style={styles.badgeContainer}>
              {isNew && (
                <View style={[styles.badge, styles.newBadge]}>
                  <Text style={styles.badgeText}>YENİ</Text>
                </View>
              )}
              {isExpiringSoon && (
                <View style={[styles.badge, styles.expiringSoonBadge]}>
                  <Text style={styles.badgeText}>Son Gün!</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Sağ taraf - İçerik */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.brandName} numberOfLines={1}>
              {item.campaign_title}
            </Text>
            {showFavorite && (
              <FavoriteButton 
                couponId={item.id} 
                size={20} 
              />
            )}
          </View>

          <Text style={styles.couponTitle} numberOfLines={2}>
            {item.title || item.description}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.discountContainer}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {item.discount_type === 'percentage' ? `%${item.discount_value}` : `₺${item.discount_value}`}
                </Text>
              </View>
              <Text style={styles.discountLabel}>İndirim</Text>
            </View>

            <View style={styles.validityContainer}>
              <Ionicons name="time-outline" size={12} color="#666" />
              <Text style={styles.validityText} numberOfLines={1}>
                {item.valid_to ? 
                  `${new Date(item.valid_to).toLocaleDateString('tr-TR')}` :
                  'Süresiz'
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CouponCard;
