import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { Category } from '../../../types';
import { styles } from './styles';

interface CategoryCardProps {
  item: Category;
  onPress: () => void;
  horizontal?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
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
            uri: item.image || 'https://via.placeholder.com/150x150?text=Kategori' 
          }}
          style={styles.cardImage}
          resizeMode="cover"
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

export default CategoryCard;
