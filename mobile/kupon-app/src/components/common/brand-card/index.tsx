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
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.cardContainer, 
        horizontal && styles.cardContainerHorizontal
      ]}>
        <Image
          source={{ 
            uri: item.logo || 'https://via.placeholder.com/150x150?text=Marka' 
          }}
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
