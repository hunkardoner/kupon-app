import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { userAPI } from '../api';
import { Coupon, Brand } from '../types';

// Storage key constant
const STORAGE_KEYS = {
  FAVORITES: 'user_favorites',
};

interface FavoritesContextType {
  favorites: string[];
  favoriteCoupons: Coupon[];
  favoriteBrands: Brand[];
  isLoading: boolean;
  addToFavorites: (couponId: string) => Promise<void>;
  removeFromFavorites: (couponId: string) => Promise<void>;
  addFavorite: (couponId: string) => Promise<void>; // Alias for addToFavorites
  removeFavorite: (couponId: string) => Promise<void>; // Alias for removeFromFavorites
  toggleFavorite: (couponId: string | number) => Promise<void>; // Toggle function
  isFavorite: (couponId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCoupons, setFavoriteCoupons] = useState<Coupon[]>([]);
  const [favoriteBrands, setFavoriteBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated) {
        // Load from server
        const response = await userAPI.getFavorites();
        setFavoriteCoupons(response.coupons || []);
        setFavoriteBrands(response.brands || []);
        
        // Extract coupon IDs for compatibility
        const couponIds = (response.coupons || []).map(coupon => coupon.id.toString());
        setFavorites(couponIds);
      } else {
        // Load from local storage
        const localFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (localFavorites) {
          const parsedFavorites = JSON.parse(localFavorites);
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (couponId: string) => {
    try {
      const newFavorites = [...favorites, couponId];
      setFavorites(newFavorites);

      if (isAuthenticated) {
        // Sync with server
        await userAPI.addFavorite(parseInt(couponId));
        // Refresh to get updated data
        await loadFavorites();
      } else {
        // Save locally
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  const removeFromFavorites = async (couponId: string) => {
    try {
      const newFavorites = favorites.filter(id => id !== couponId);
      setFavorites(newFavorites);

      if (isAuthenticated) {
        // Sync with server
        await userAPI.removeFavorite(parseInt(couponId));
        // Refresh to get updated data
        await loadFavorites();
      } else {
        // Save locally
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  const isFavorite = (couponId: string) => {
    return favorites.includes(couponId);
  };

  const refreshFavorites = async () => {
    setIsLoading(true);
    await loadFavorites();
  };

  const toggleFavorite = async (couponId: string | number) => {
    const id = couponId.toString();
    if (isFavorite(id)) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites(id);
    }
  };

  // Load favorites when context initializes or auth state changes
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated, user]);

  // Sync local favorites with server when user logs in
  useEffect(() => {
    const syncFavorites = async () => {
      if (isAuthenticated && favorites.length > 0) {
        try {
          // Get local favorites from before login
          const localFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
          if (localFavorites) {
            const parsedLocal = JSON.parse(localFavorites);
            // Sync each local favorite with server
            for (const couponId of parsedLocal) {
              await userAPI.addFavorite(parseInt(couponId));
            }
            // Clear local storage
            await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
            // Refresh from server
            await refreshFavorites();
          }
        } catch (error) {
          console.error('Error syncing favorites:', error);
        }
      }
    };

    syncFavorites();
  }, [isAuthenticated]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteCoupons,
        favoriteBrands,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        addFavorite: addToFavorites, // Alias
        removeFavorite: removeFromFavorites, // Alias
        toggleFavorite,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}