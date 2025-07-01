import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../../context/FavoritesContext';
import { styles } from './styles';

interface FavoriteButtonProps {
  couponId: number | string;
  size?: number;
  style?: any;
}

export function FavoriteButton({ 
  couponId, 
  size = 24, 
  style 
}: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const couponIdStr = typeof couponId === 'number' ? couponId.toString() : couponId;
  const isFav = isFavorite(couponIdStr);

  const handleToggle = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(couponIdStr);
      } else {
        await addToFavorites(couponIdStr);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.favoriteButton, style]}
      onPress={handleToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name={isFav ? 'heart' : 'heart-outline'}
        size={size}
        color={isFav ? '#e74c3c' : '#666'}
      />
    </TouchableOpacity>
  );
}

export default FavoriteButton;
