import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './CardComponent.styles';
import { Category, Brand, Coupon } from '../../types';
import COLORS from '../../constants/colors';

// API için temel URL - güncellenebilir
const API_BASE_URL = 'http://localhost:8000';

// CardComponent'in alabileceği item tiplerini birleştir
export type CardItem = 
  | (Category & { type: 'category' }) 
  | (Brand & { type: 'brand' }) 
  | (Coupon & { type: 'coupon' });

interface CardComponentProps {
  item: CardItem; 
  onPress?: (item: CardItem) => void;
  style?: object; 
}

const CardComponent: React.FC<CardComponentProps> = ({
  item,
  onPress,
  style,
}) => {
  let title = '';
  let subtitle: string | undefined | null = undefined;
  let imageUrl: string | undefined | null = undefined;

  if (item.type === 'category') {
    title = item.name;
    subtitle = item.description;
    imageUrl = item.image_url;
  } else if (item.type === 'brand') {
    title = item.name;
    subtitle = item.description;
    imageUrl = item.logo_url;
  } else if (item.type === 'coupon') {
    title = item.code;
    subtitle = item.description;
    imageUrl = item.brand?.logo_url; // Kuponun markasının logosu
  }

  // Resim URL'sini işle - null olmadığını ve tam URL olduğunu kontrol et
  let imageSource;
  if (imageUrl) {
    // Eğer URL http:// veya https:// ile başlamıyorsa, API_BASE_URL ile birleştir
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    imageSource = { uri: imageUrl };
  }

  return (
    <TouchableOpacity onPress={() => onPress && onPress(item)} style={[styles.touchable, style]} disabled={!onPress}>
      <View style={styles.container}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>{title.substring(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardComponent;
