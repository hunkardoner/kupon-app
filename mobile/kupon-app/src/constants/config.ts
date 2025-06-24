// API Configuration
export const API_BASE_URL = 'https://kupon.com/api'; // Backend URL'nizi buraya girin
export const API_KEY = 'your-api-key-here'; // Backend'den aldığınız API key

// App Configuration
export const APP_NAME = 'KuponCepte';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  FAVORITES: 'user_favorites',
  PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;

// Notification Settings
export const NOTIFICATION_TYPES = {
  NEW_COUPON: 'new_coupon',
  PRICE_DROP: 'price_drop',
  COUPON_EXPIRY: 'coupon_expiry',
  PERSONALIZED: 'personalized',
} as const;

// Feature Flags
export const FEATURES = {
  PUSH_NOTIFICATIONS: true,
  PRICE_TRACKING: true,
  SOCIAL_FEATURES: true,
  OFFLINE_MODE: true,
} as const;
