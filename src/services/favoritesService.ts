import { API_BASE_URL, API_KEY } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

class FavoritesService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token for authenticated requests
    const token = await SecureStore.getItemAsync('token');
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: 'Ağ hatası oluştu',
      };
    }
  }

  async getFavorites(): Promise<ApiResponse<string[]>> {
    return this.makeRequest('/user/favorites', {
      method: 'GET',
    });
  }

  async addFavorite(couponId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ coupon_id: couponId }),
    });
  }

  async removeFavorite(couponId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/user/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ coupon_id: couponId }),
    });
  }
}

export const favoritesService = new FavoritesService();
