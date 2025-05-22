import axios from 'axios';
import { Category, Brand, Coupon, Slider } from '../types'; // Tipleri import et

export const API_BASE_URL = 'http://localhost:8000/api'; // Laravel API adresiniz // Exported constant

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Gerekirse buraya Authorization token gibi header'lar eklenebilir
  },
});

interface FetchParams {
  limit?: number;
  popular?: boolean;
  page?: number;
  // Diğer olası filtreleme/sayfalama parametreleri eklenebilir
}

// Kategorileri Getir
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data.data; // Veriyi .data.data'dan al
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Belirli Bir Kategoriyi Getir
export const fetchCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// Markaları Getir
export const fetchBrands = async (params?: FetchParams): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/brands', { params });
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Belirli Bir Markayı Getir
export const fetchBrandById = async (id: number): Promise<Brand> => {
  try {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching brand with id ${id}:`, error);
    throw error;
  }
};

// Kupon Kodlarını Getir
export const fetchCouponCodes = async (params?: FetchParams): Promise<Coupon[]> => {
  try {
    const response = await apiClient.get('/coupon-codes', { params });
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching coupon codes:', error);
    throw error;
  }
};

// Belirli Bir Kupon Kodunu Getir
export const fetchCouponCodeById = async (id: number): Promise<Coupon> => {
  try {
    const response = await apiClient.get(`/coupon-codes/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching coupon code with id ${id}:`, error);
    throw error;
  }
};

// Sliderları Getir
export const fetchSliders = async (): Promise<Slider[]> => {
  try {
    const response = await apiClient.get('/sliders');
    
    // Case 1: Standard Laravel wrapped collection: { data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data as Slider[];
    } 
    // Case 2: Potentially unwrapped collection: [...]
    // This handles cases where JsonResource::withoutWrapping() might be used globally
    // or if the /sliders endpoint specifically returns an array directly.
    else if (response.data && Array.isArray(response.data)) {
      return response.data as Slider[];
    }
    // Case 3: Original logic for response.data.data being a single object 
    // (less common for a collection endpoint but kept for safety from original logic)
    else if (response.data && response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
      return [response.data.data as Slider];
    }
    
    // If data is not in any expected array format, log a warning and return an empty array.
    // This prevents the app from crashing and results in no sliders being shown,
    // which can then be investigated further (e.g., checking API response or DB).
    console.warn('Unexpected structure for sliders data or no sliders found:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error; // Rethrow to be handled by the calling component (HomeScreen)
  }
};

// Diğer API endpoint'leri için benzer fonksiyonlar eklenebilir:
// fetchBlogs, fetchPageById vb.

export default apiClient;
