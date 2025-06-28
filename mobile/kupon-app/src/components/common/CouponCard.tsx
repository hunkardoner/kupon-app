import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Coupon } from '../../types';
import { FavoriteButton } from './FavoriteButton';
import { StyleSheet } from 'react-native';

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
    // Önce brand nesnesi varsa logoyu oradan al
    if (item.brand && typeof item.brand === 'object' && item.brand.logo) {
      return item.brand.logo;
    }
    
    // Brand nesnesi yoksa default logo
    return 'https://www.kuponcepte.com.tr/storage/brands/default-brand-logo.png';
  };

  const logoUrl = getLogoUrl();

  return (
    <TouchableOpacity
      style={styles.couponCard}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.couponImageContainer}>
        <Image
          source={{ uri: logoUrl }}
          style={styles.couponImage}
          resizeMode="cover"
        />
        {showFavorite && (
          <FavoriteButton
            couponId={item.id.toString()}
            size="small"
            style={styles.favoriteButton}
          />
        )}
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>YENİ</Text>
          </View>
        )}
        {isExpiringSoon && (
          <View style={styles.expireBadge}>
            <Text style={styles.expireBadgeText}>BİTİYOR</Text>
          </View>
        )}
      </View>

      <View style={styles.couponContent}>
        <Text style={styles.couponBrand}>
          {(item.brand && typeof item.brand === 'object') ? item.brand.name : 'Genel'}
        </Text>
        <Text style={styles.couponTitle} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.couponDetails}>
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>
              {item.discount_type === 'percentage' 
                ? `%${item.discount_value}` 
                : `₺${item.discount_value}`
              }
            </Text>
            <Text style={styles.discountLabel}>İndirim</Text>
          </View>
          
          {item.valid_to && (
            <View style={styles.expiryContainer}>
              <Ionicons name="time" size={14} color="#666" />
              <Text style={styles.expiryText}>
                {new Date(item.valid_to).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          )}
        </View>

        {item.usage_count && item.usage_count > 0 && (
          <View style={styles.usageContainer}>
            <Ionicons name="people" size={14} color="#2196F3" />
            <Text style={styles.usageText}>
              {item.usage_count} kişi kullandı
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  couponImageContainer: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  expireBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  expireBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  couponContent: {
    padding: 16,
  },
  couponBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  couponDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  discountLabel: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  usageText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
});
