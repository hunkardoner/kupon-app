import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { Brand } from '../../../types';
import { styles } from './styles';

interface BrandCardProps {
  item: Brand;
  onPress: () => void;
  horizontal?: boolean;
}

export const BrandCard: React.FC<BrandCardProps> = ({ 
  item, 
  onPress, 
  horizontal = false 
}) => {
  const couponCount = item.coupons_count || 0;
  
  // Logo URL'sini güvenli şekilde al
  const getLogoUrl = () => {
    const baseUrl = 'https://www.kuponcepte.com.tr';
    const defaultLogo = `${baseUrl}/storage/brands/default-brand-logo.png`;
    
    // Logo property'si yoksa default logo
    if (!item.logo) {
      return defaultLogo;
    }
    
    const logoUrl = item.logo.trim();
    
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
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.cardContainer, 
        horizontal && styles.cardContainerHorizontal
      ]}>
        <Image
          source={{ uri: getLogoUrl() }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {couponCount} kupon
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BrandCard;
