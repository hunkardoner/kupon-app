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
  brand_id?: number; // Added for fetching coupons by brand_id
  // Diğer olası filtreleme/sayfalama parametreleri eklenebilir
}

// Kategorileri Getir
const fetchCategoriesData = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.data; // Veriyi .data.data'dan al
};

// Belirli Bir Kategoriyi Getir
const fetchCategoryByIdData = async (id: number): Promise<Category> => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data.data;
};

// Markaları Getir
const fetchBrandsData = async (params?: FetchParams): Promise<Brand[]> => {
  const response = await apiClient.get('/brands', { params });
  return response.data.data;
};

// Belirli Bir Markayı Getir
const fetchBrandByIdData = async (id: number): Promise<Brand> => {
  const response = await apiClient.get(`/brands/${id}`);
  return response.data.data;
};

// Kupon Kodlarını Getir
const fetchCouponCodesData = async (params?: FetchParams): Promise<Coupon[]> => {
  const response = await apiClient.get('/coupon-codes', { params });
  return response.data.data;
};

// Belirli Bir Kupon Kodunu Getir
const fetchCouponCodeByIdData = async (id: number): Promise<Coupon> => {
  const response = await apiClient.get(`/coupon-codes/${id}`);
  return response.data.data;
};

// Sliderları Getir
const fetchSlidersData = async (): Promise<Slider[]> => {
  const response = await apiClient.get('/sliders');
  // Case 1: Standard Laravel wrapped collection: { data: [...] }
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data as Slider[];
  }
  // Case 2: Potentially unwrapped collection: [...]
  else if (response.data && Array.isArray(response.data)) {
    return response.data as Slider[];
  }
  // Case 3: Original logic for response.data.data being a single object
  else if (response.data && response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
    return [response.data.data as Slider];
  }
  console.warn('Unexpected structure for sliders data or no sliders found:', response.data);
  return [];
};

export {
    fetchCategoriesData as fetchCategories,
    fetchCategoryByIdData as fetchCategoryById,
    fetchBrandsData as fetchBrands,
    fetchBrandByIdData as fetchBrandById,
    fetchCouponCodesData as fetchCouponCodes,
    fetchCouponCodeByIdData as fetchCouponCodeById,
    fetchSlidersData as fetchSliders
}

// Diğer API endpoint'leri için benzer fonksiyonlar eklenebilir:
// fetchBlogs, fetchPageById vb.

export default apiClient;
