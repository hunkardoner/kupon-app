import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Category, Brand, Coupon, Slider, User } from '../types';

export const API_BASE_URL = 'https://www.kuponcepte.com.tr/api';

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
  page?: number;
  per_page?: number;
  limit?: number; // backward compatibility
  popular?: boolean; // backward compatibility
  brand_id?: number;
  category_id?: number;
  discount_type?: 'percentage' | 'fixed_amount' | 'campaign' | 'all';
  search?: string;
  sort_by?: 'created_at' | 'discount_value' | 'usage_count';
  sort_order?: 'asc' | 'desc';
  // Frontend mapping helpers
  sortBy?: 'newest' | 'popular' | 'ending'; // Will be mapped to sort_by
  status?: 'active' | 'expired' | 'all';
  min_discount?: number;
  max_discount?: number;
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
  async getCoupons(params?: FetchParams): Promise<any> {
    const apiParams: any = {};
    
    // Page ve limit parametreleri
    if (params?.page) apiParams.page = params.page;
    if (params?.per_page) apiParams.per_page = params.per_page;
    if (params?.limit && !params.per_page) apiParams.per_page = params.limit; // backward compatibility
    
    // Filter parametreleri
    if (params?.brand_id) apiParams.brand_id = params.brand_id;
    if (params?.category_id) apiParams.category_id = params.category_id;
    if (params?.discount_type && params.discount_type !== 'all') {
      apiParams.discount_type = params.discount_type;
    }
    if (params?.search) apiParams.search = params.search;
    if (params?.status && params.status !== 'all') apiParams.status = params.status;
    if (params?.min_discount) apiParams.min_discount = params.min_discount;
    if (params?.max_discount) apiParams.max_discount = params.max_discount;
    
    // Sort parametreleri - Frontend'den backend'e mapping
    if (params?.sortBy) {
      // Frontend sort seçeneklerini backend parametrelerine çevir
      switch (params.sortBy) {
        case 'newest':
          apiParams.sort_by = 'created_at';
          apiParams.sort_order = 'desc';
          break;
        case 'popular':
          apiParams.sort_by = 'usage_count';
          apiParams.sort_order = 'desc';
          break;
        case 'ending':
          // Ending için backend'de hangi alanı kullanmalıyız? expires_at veya valid_to?
          // Şimdilik created_at kullanıyoruz, backend dokümantasyonuna göre düzeltilmeli
          apiParams.sort_by = 'created_at';
          apiParams.sort_order = 'asc';
          break;
      }
    }
    
    // Direct backend parameters (override frontend mapping if provided)
    if (params?.sort_by) apiParams.sort_by = params.sort_by;
    if (params?.sort_order) apiParams.sort_order = params.sort_order;
    
    // Popular backward compatibility
    if (params?.popular) {
      apiParams.sort_by = 'usage_count';
      apiParams.sort_order = 'desc';
    }
    
    console.log('getCoupons API request params:', apiParams);
    
    const response = await apiClient.get('/coupon-codes', { params: apiParams });
    console.log('getCoupons API response:', {
      success: response.data.success,
      dataLength: response.data.data?.length,
      meta: response.data.meta,
      hasData: !!response.data.data,
      hasMeta: !!response.data.meta
    });
    
    const responseData = response.data;
    let coupons = responseData.data || [];
    const meta = responseData.meta;
    
    console.log('API Response Structure:', {
      success: responseData.success,
      couponsCount: Array.isArray(coupons) ? coupons.length : 0,
      meta: meta,
      isPagedRequest: !!apiParams.page,
      totalPages: meta?.last_page,
      currentPage: meta?.current_page,
      total: meta?.total
    });
    
    // Brand bilgisini zenginleştir (sadece gerekirse)
    if (coupons.length > 0) {
      const needsBrandEnrichment = coupons.some((coupon: any) => 
        coupon.brand_id && !coupon.brand
      );
      
      if (needsBrandEnrichment) {
        console.log('Kuponlarda brand bilgisi eksik, brand listesini çekiyoruz...');
        
        try {
          const brandsResponse = await this.getBrands();
          console.log('Brands loaded for coupon matching:', brandsResponse.length);
          
          // Kuponları brand bilgisiyle zenginleştir
          coupons = coupons.map((coupon: any) => {
            if (coupon.brand_id && !coupon.brand) {
              const matchingBrand = brandsResponse.find(brand => brand.id === coupon.brand_id);
              if (matchingBrand) {
                coupon.brand = matchingBrand;
              }
            }
            return coupon;
          });
        } catch (error) {
          console.error('Brand listesi çekilirken hata:', error);
        }
      }
    }
    
    // Pagination bilgisi için full response döndür
    if (apiParams.page) {
      return {
        data: coupons,
        meta: meta,
        links: responseData.links,
        success: responseData.success,
        message: responseData.message
      };
    }
    
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
