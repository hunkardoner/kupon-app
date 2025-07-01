import { API_BASE_URL, API_KEY } from '../constants/config';
import * as SecureStore from 'expo-secure-store';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

class RecommendationService {
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

  async getPersonalizedRecommendations(userId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/recommendations/${userId}`, {
      method: 'GET',
    });
  }

  async getPopularRecommendations(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/recommendations/popular', {
      method: 'GET',
    });
  }

  async trackCategoryView(categoryId: string, timeSpent: number = 0): Promise<ApiResponse<any>> {
    return this.makeRequest('/user/track-category-view', {
      method: 'POST',
      body: JSON.stringify({ 
        category_id: categoryId,
        time_spent: timeSpent,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  async trackSearch(searchTerm: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/user/track-search', {
      method: 'POST',
      body: JSON.stringify({ 
        search_term: searchTerm,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  async trackCouponUsage(couponId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/coupons/${couponId}/track-usage`, {
      method: 'POST',
      body: JSON.stringify({ 
        timestamp: new Date().toISOString(),
        action: 'used',
      }),
    });
  }
}

export const recommendationService = new RecommendationService();
