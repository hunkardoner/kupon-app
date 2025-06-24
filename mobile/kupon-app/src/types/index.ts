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
  coupon_codes?: Coupon[]; // Added to include related coupons
  coupons_count?: number; // Added for displaying coupon count
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
  category?: string; // Added for displaying brand category
}

export interface Coupon {
  id: number;
  code: string;
  title: string; // Added title field
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  discount_amount?: number; // Alias for discount_value
  valid_from: string; // API'den gelen field ismi
  valid_to: string; // API'den gelen field ismi
  expiry_date?: string; // Alias for valid_to
  usage_limit?: number | null;
  usage_count: number;
  minimum_amount?: number | null; // Minimum purchase amount
  is_active: boolean;
  brand_id: number;
  campaign_url?: string | null; // Kampanya linki
  link?: string; // Alias for campaign_url
  campaign_title?: string | null; // Kampanya başlığı
  terms?: string | null; // Terms and conditions
  brand?: Brand; // İlişkili marka bilgisi (opsiyonel, API'ye göre)
  categories?: Category[]; // Changed to an array of categories
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
