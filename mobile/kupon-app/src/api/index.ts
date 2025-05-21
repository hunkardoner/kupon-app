import axios from 'axios';

// API Temel URL'si - .env dosyasından veya sabit olarak alınabilir
// TODO: Bu URL'yi kendi API adresinizle değiştirin
const API_BASE_URL = 'http://localhost:8000/api'; // API_DOCUMENTATION.md dosyasından alındı

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // İleride kimlik doğrulama token'ı gibi başlıklar buraya eklenebilir
    // 'Authorization': `Bearer ${token}`,
  },
});

// Örnek API İstekleri (API_DOCUMENTATION.md'ye göre)

// Kategorileri Getir
export const fetchCategories = () => {
  return apiClient.get('/categories');
};

// Belirli Bir Kategoriyi Getir
export const fetchCategoryById = (id: string) => {
  return apiClient.get(`/categories/${id}`);
};

// Markaları Getir
export const fetchBrands = () => {
  return apiClient.get('/brands');
};

// Belirli Bir Markayı Getir
export const fetchBrandById = (id: string) => {
  return apiClient.get(`/brands/${id}`);
};

// Kupon Kodlarını Getir
export const fetchCouponCodes = () => {
  return apiClient.get('/coupon-codes');
};

// Belirli Bir Kupon Kodunu Getir
export const fetchCouponCodeById = (id: string) => {
  return apiClient.get(`/coupon-codes/${id}`);
};

// Diğer API endpoint'leri için benzer fonksiyonlar eklenebilir:
// fetchBlogs, fetchPageById, fetchSliders vb.

export default apiClient;
