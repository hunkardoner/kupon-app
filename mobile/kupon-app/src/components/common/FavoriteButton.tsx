import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../context/FavoritesContext';

interface FavoriteButtonProps {
  couponId: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: any;
}

const { width } = Dimensions.get('window');

export function FavoriteButton({ 
  couponId, 
  size = 'medium', 
  showLabel = false,
  style 
}: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isFav = isFavorite(couponId);

  const handleToggle = async () => {
    try {
      if (isFav) {
        await removeFromFavorites(couponId);
      } else {
        await addToFavorites(couponId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 48;
      default: return 40;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: getButtonSize(),
          height: getButtonSize(),
          backgroundColor: isFav ? '#FF6B6B' : 'rgba(0,0,0,0.1)',
        },
        style,
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFav ? 'heart' : 'heart-outline'}
        size={getIconSize()}
        color={isFav ? 'white' : '#666'}
      />
      {showLabel && (
        <Text style={[styles.label, { color: isFav ? 'white' : '#666' }]}>
          {isFav ? 'Favorilerde' : 'Favorile'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS !== 'web' && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
    }),
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 48,
    height: 48,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});
