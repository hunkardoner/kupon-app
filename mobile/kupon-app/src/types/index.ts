// src/types/index.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null; 
  image?: string | null; // Changed from image_url to image
  is_active: boolean;
  parent_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null; // Changed from image to logo
  website_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coupons_count?: number; // API'den geliyorsa
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  start_date: string;
  end_date: string;
  usage_limit?: number | null;
  usage_count: number;
  is_active: boolean;
  brand_id: number;
  brand?: Brand; // İlişkili marka bilgisi (opsiyonel, API'ye göre)
  category_id?: number | null; // Opsiyonel kategori
  category?: Category; // İlişkili kategori bilgisi
  created_at: string;
  updated_at: string;
}

export interface Slider {
  id: number;
  title: string;
  description?: string | null;
  image: string; // Changed from image_url to image
  link_url?: string | null;
  related_coupon_id?: number | null; // Eklendi
  related_brand_id?: number | null;  // Eklendi
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

// Diğer genel tipler buraya eklenebilir
