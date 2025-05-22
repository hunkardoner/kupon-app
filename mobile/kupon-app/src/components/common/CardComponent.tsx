import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import styles from './CardComponent.styles';
import { Category, Brand, Coupon } from '../../types';

// CardComponent'in alabileceği item tiplerini birleştir
export type CardItem = 
  | (Category & { type: 'category' }) 
  | (Brand & { type: 'brand' }) 
  | (Coupon & { type: 'coupon' });

interface CardComponentProps {
  // title, subtitle, imageUrl doğrudan item içerisinden alınacak şekilde değiştirildi.
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

  const imageSource = imageUrl ? { uri: imageUrl } : undefined;

  return (
    <TouchableOpacity onPress={() => onPress && onPress(item)} style={[styles.touchable, style]} disabled={!onPress}>
      <View style={styles.container}>
        {imageSource && (
          <Image source={imageSource} style={styles.image} resizeMode="contain" /> // resizeMode eklendi
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
