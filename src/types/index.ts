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
  logo?: string | null; // Logo URL'si (backend'den asset() ile tam URL gelir)
  // website_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coupons_count?: number; // API'den geliyorsa
  category?: string; // Added for displaying brand category
}

export interface Coupon {
  id: number;
  code: string;
  title?: string; // Mobile app için alias
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'campaign'; // 'campaign' eklendi
  discount_value: number;
  discount_amount?: number; // Alias for discount_value
  valid_from: string; // API'den gelen field ismi
  valid_to: string; // API'den gelen field ismi
  expires_at?: string; // Alias for valid_to
  expiry_date?: string; // Alias for valid_to
  max_uses?: number | null; // API field name
  max_uses_user?: number; // API field name
  usage_limit?: number | null; // Alias for max_uses
  usage_count?: number; // Calculated field
  times_used?: number; // API field name
  minimum_amount?: number | null; // Alias for min_purchase_amount
  min_purchase_amount?: number | null; // API field name
  is_active: boolean;
  brand_id: number;
  campaign_url?: string | null; // Kampanya linki
  link?: string; // Alias for campaign_url
  campaign_title?: string | null; // Kampanya başlığı
  terms?: string | null; // Terms and conditions
  brand?: Brand; // İlişkili marka bilgisi (opsiyonel, API'ye göre)
  categories?: Category[]; // Changed to an array of categories
  // Enhanced data fields (from /enhanced endpoint)
  average_rating?: string | number;
  reviews_count?: string | number;
  is_favorited?: boolean | string;
  expires_in_days?: string | null;
  is_expiring_soon?: boolean | string;
  is_new?: boolean | string;
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

export interface UserPreferences {
  notifications: boolean;
  emailAlerts: boolean;
  favoriteCategories: string[];
  priceAlertThreshold: number;
  language: string;
  currency: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email_verified_at?: string | null;
  google2fa_enabled?: boolean;
  google2fa_enabled_at?: string | null;
  permissions?: any;
  // Social login fields - API'den gelen
  google_id?: string;
  apple_id?: string;
  avatar?: string; // Google login'de geliyor
  social_verified_at?: string;
  // Additional profile fields
  phone?: string;
  bio?: string;
  // Optional fields for backwards compatibility
  preferences?: UserPreferences;
  favoriteCategories?: string[];
  totalSavings?: number;
  memberSince?: string;
}

// Diğer genel tipler buraya eklenebilir
