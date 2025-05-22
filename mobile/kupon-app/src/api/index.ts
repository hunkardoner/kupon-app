import axios from 'axios';
import { Category, Brand, Coupon, Slider } from '../types'; // Tipleri import et

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Laravel API adresiniz

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
    return response.data.data; // Veriyi .data.data'dan al
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error;
  }
};

// Diğer API endpoint'leri için benzer fonksiyonlar eklenebilir:
// fetchBlogs, fetchPageById vb.

export default apiClient;
