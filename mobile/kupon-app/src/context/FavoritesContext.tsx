import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Storage key constant
const STORAGE_KEYS = {
  FAVORITES: 'user_favorites',
};

// Temporary inline service for favorites operations
const favoritesService = {
  async addFavorite(couponId: string) {
    // Mock implementation
    return { success: true, message: 'Favorilere eklendi' };
  },

  async removeFavorite(couponId: string) {
    // Mock implementation  
    return { success: true, message: 'Favorilerden çıkarıldı' };
  },

  async getFavorites() {
    // Mock implementation
    return { success: true, data: [] };
  },

  async syncFavorites(localFavorites: string[]) {
    // Mock implementation
    return { success: true, data: localFavorites };
  },
};

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  addToFavorites: (couponId: string) => Promise<void>;
  removeFromFavorites: (couponId: string) => Promise<void>;
  isFavorite: (couponId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const loadFavorites = async () => {
    try {
      if (isAuthenticated && user) {
        // Authenticated user - fetch from server
        const response = await favoritesService.getFavorites();
        if (response.success) {
          setFavorites(response.data || []);
        }
      } else {
        // Anonymous user - load from local storage
        const storedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
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
        await favoritesService.addFavorite(couponId);
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
        await favoritesService.removeFavorite(couponId);
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
              await favoritesService.addFavorite(couponId);
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
        isLoading,
        addToFavorites,
        removeFromFavorites,
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
