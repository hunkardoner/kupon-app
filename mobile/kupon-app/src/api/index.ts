import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Category, Brand, Coupon, Slider, User } from '../types';

export const API_BASE_URL = 'http://localhost:8000/api';

// Platform-aware storage
const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await AsyncStorage.getItem(key);
};

const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

// API Client with authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await getStorageItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await removeStorageItem('auth_token');
      await removeStorageItem('user_data');
    }
    return Promise.reject(error);
  }
);

interface FetchParams {
  limit?: number;
  popular?: boolean;
  page?: number;
  brand_id?: number;
  category_id?: number;
  search?: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

interface RegisterResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

// Authentication APIs
export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/login', { email, password });
    console.log('Raw API response:', response.data);
    
    // API response: { success, message, token, token_type, user, data: { user, access_token, token_type } }
    const responseData = response.data;
    const token = responseData.token || responseData.data?.access_token;
    const user = responseData.user || responseData.data?.user;
    
    if (token) {
      await setStorageItem('auth_token', token);
      await setStorageItem('user_data', JSON.stringify(user));
    }
    
    return {
      success: responseData.success || (!!token),
      token: token,
      user: user,
      message: responseData.message || 'Login successful'
    };
  },

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<RegisterResponse> {
    const response = await apiClient.post('/register', { 
      name, 
      email, 
      password,
      password_confirmation
    });
    
    // API response: { success, message, token, token_type, user, data: { user, access_token, token_type } }
    const responseData = response.data;
    const token = responseData.token || responseData.data?.access_token;
    const user = responseData.user || responseData.data?.user;
    
    if (token) {
      await setStorageItem('auth_token', token);
      await setStorageItem('user_data', JSON.stringify(user));
    }
    
    return {
      success: responseData.success || (!!token),
      token: token,
      user: user,
      message: responseData.message || 'Registration successful'
    };
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } finally {
      await removeStorageItem('auth_token');
      await removeStorageItem('user_data');
    }
  },

  async getUser(): Promise<User> {
    const response = await apiClient.get('/user');
    return response.data.data || response.data;
  },

  async googleLogin(accessToken: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/google', { 
      access_token: accessToken 
    });
    
    // API response: { success, message, data: { access_token, token_type, user } }
    const responseData = response.data;
    const token = responseData.data?.access_token || responseData.token;
    const user = responseData.data?.user || responseData.user;
    
    if (token) {
      await setStorageItem('auth_token', token);
      await setStorageItem('user_data', JSON.stringify(user));
    }
    
    return {
      success: responseData.success || (!!token),
      token: token,
      user: user,
      message: responseData.message || 'Google login successful'
    };
  },

  async appleLogin(identityToken: string, userIdentifier: string, email?: string, fullName?: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/apple', { 
      identity_token: identityToken,
      user_identifier: userIdentifier,
      email: email,
      full_name: fullName
    });
    
    // API response: { success, message, data: { access_token, token_type, user } }
    const responseData = response.data;
    const token = responseData.data?.access_token || responseData.token;
    const user = responseData.data?.user || responseData.user;
    
    if (token) {
      await setStorageItem('auth_token', token);
      await setStorageItem('user_data', JSON.stringify(user));
    }
    
    return {
      success: responseData.success || (!!token),
      token: token,
      user: user,
      message: responseData.message || 'Apple login successful'
    };
  },
};

// Public Data APIs
export const dataAPI = {
  // Categories
  async getCategories(params?: FetchParams): Promise<Category[]> {
    const response = await apiClient.get('/categories', { params });
    console.log('getCategories API response:', response.data);
    // Categories API directly returns array (not wrapped in data)
    const categories = Array.isArray(response.data) ? response.data : (response.data.data || []);
    console.log('Parsed categories:', categories.length, 'items');
    return categories;
  },

  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data || response.data;
  },

  // Brands
  async getBrands(params?: FetchParams): Promise<Brand[]> {
    const response = await apiClient.get('/brands', { params });
    console.log('getBrands API response:', response.data);
    // Brands API directly returns array (not wrapped in data)
    const brands = Array.isArray(response.data) ? response.data : (response.data.data || []);
    console.log('Parsed brands:', brands.length, 'items');
    return brands;
  },

  async getBrand(id: number): Promise<Brand> {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data.data || response.data;
  },

  // Coupons
  async getCoupons(params?: FetchParams): Promise<Coupon[]> {
    const response = await apiClient.get('/coupon-codes', { params });
    console.log('getCoupons API response:', response.data);
    // Coupons API returns paginated response with data array
    const coupons = response.data.data || [];
    console.log('Parsed coupons:', coupons.length, 'items');
    return coupons;
  },

  async getCoupon(id: number): Promise<Coupon> {
    const response = await apiClient.get(`/coupon-codes/${id}`);
    return response.data.data || response.data;
  },

  async getCouponEnhanced(id: number): Promise<Coupon> {
    const response = await apiClient.get(`/coupon-codes/${id}/enhanced`);
    return response.data.data || response.data;
  },

  // Sliders
  async getSliders(): Promise<Slider[]> {
    const response = await apiClient.get('/sliders');
    console.log('getSliders API response:', response.data);
    // Sliders API returns object with data array
    const sliders = Array.isArray(response.data) ? response.data : (response.data.data || []);
    console.log('Parsed sliders:', sliders.length, 'items');
    return sliders;
  },

  // Search
  async search(query: string, filters?: any): Promise<any> {
    const response = await apiClient.get('/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  },

  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await apiClient.get('/search/suggestions', { 
      params: { q: query } 
    });
    return response.data.data || response.data;
  },

  async getPopularSearches(): Promise<string[]> {
    const response = await apiClient.get('/search/popular');
    return response.data.data || response.data;
  },

  // Recommendations
  async getPopularRecommendations(): Promise<Coupon[]> {
    const response = await apiClient.get('/recommendations/popular');
    return response.data.data || response.data;
  },

  // Analytics
  async getGlobalStats(): Promise<any> {
    const response = await apiClient.get('/analytics/global');
    return response.data;
  },

  // Track usage (anonymous)
  async trackCouponUsage(couponId: number): Promise<void> {
    await apiClient.post(`/coupon-codes/${couponId}/track-usage`);
  },
};

// User APIs (requires authentication)
export const userAPI = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get('/user/profile');
    return response.data.data || response.data;
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    // API'de /user/profile PUT endpoint'i yoksa /user endpoint'ini kullanabiliriz
    const response = await apiClient.put('/user', profileData);
    return response.data.data || response.data;
  },

  async updatePreferences(preferences: any): Promise<any> {
    const response = await apiClient.post('/user/preferences', preferences);
    return response.data;
  },

  async getFavorites(): Promise<{ coupons: Coupon[]; brands: Brand[] }> {
    const response = await apiClient.get('/user/favorites');
    // API response: { success: boolean, data: { coupons: [], brands: [] } }
    return response.data.data || { coupons: [], brands: [] };
  },

  async addFavorite(couponId: number): Promise<void> {
    await apiClient.post('/user/favorites', { 
      favoritable_type: 'App\\Models\\CouponCode',
      favoritable_id: couponId 
    });
  },

  async removeFavorite(couponId: number): Promise<void> {
    await apiClient.delete('/user/favorites', { 
      params: { 
        favoritable_type: 'App\\Models\\CouponCode',
        favoritable_id: couponId 
      }
    });
  },

  async toggleFavorite(couponId: number): Promise<{ is_favorite: boolean }> {
    const response = await apiClient.post('/favorites/toggle', { coupon_id: couponId });
    // API response: { success: boolean, favorited: boolean, message: string }
    return { 
      is_favorite: response.data.favorited || false 
    };
  },

  async trackCategoryView(categoryId: number): Promise<void> {
    await apiClient.post('/user/track-category-view', { category_id: categoryId });
  },

  async trackSearch(query: string): Promise<void> {
    await apiClient.post('/user/track-search', { query });
  },

  // Personalized recommendations
  async getPersonalizedRecommendations(userId: number): Promise<Coupon[]> {
    const response = await apiClient.get(`/recommendations/${userId}`);
    return response.data.data || response.data;
  },

  // User analytics
  async getSavings(userId: number): Promise<any> {
    const response = await apiClient.get(`/analytics/savings/${userId}`);
    return response.data;
  },
};

// Notification APIs
export const notificationAPI = {
  async registerDevice(deviceData: any): Promise<void> {
    await apiClient.post('/notifications/register-device', deviceData);
  },

  async updateDevice(deviceData: any): Promise<void> {
    await apiClient.put('/notifications/update-device', deviceData);
  },

  async getPreferences(): Promise<any> {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  },

  async updatePreferences(preferences: any): Promise<void> {
    await apiClient.post('/notifications/preferences', preferences);
  },
};

// Review APIs
export const reviewAPI = {
  async getCouponReviews(couponId: number): Promise<any[]> {
    const response = await apiClient.get(`/coupon-codes/${couponId}/reviews`);
    return response.data.data || response.data;
  },

  async createReview(reviewData: any): Promise<any> {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  async updateReview(reviewId: number, reviewData: any): Promise<any> {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  async markHelpful(reviewId: number): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/helpful`);
  },

  async reportReview(reviewId: number, reason: string): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/report`, { reason });
  },

  async getUserReviews(): Promise<any[]> {
    const response = await apiClient.get('/user/reviews');
    return response.data.data || response.data;
  },
};

// Legacy exports for backward compatibility
export const fetchCategoriesData = dataAPI.getCategories;
export const fetchCategoryByIdData = dataAPI.getCategory;
export const fetchBrandsData = dataAPI.getBrands;
export const fetchBrandByIdData = dataAPI.getBrand;
export const fetchCouponCodesData = dataAPI.getCoupons;
export const fetchCouponCodeByIdData = dataAPI.getCoupon;
export const fetchSlidersData = dataAPI.getSliders;

export default apiClient;
