import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  CouponDetail: { couponId: number };
  BrandDetail: { brandId: number };
  CategoryDetail: { categoryId: number }; // Added for consistency, was commented out
};

export type CouponStackParamList = {
  CouponList: undefined; 
  CouponDetail: { couponId: number }; 
};

export type BrandStackParamList = {
  BrandList: undefined; 
  BrandDetail: { brandId: number }; 
};

export type CategoryStackParamList = {
  CategoryList: undefined; 
  CategoryDetail: { categoryId: number }; 
};

// Ensure all tabs are correctly defined for MainTabParamList
export type MainTabParamList = {
  Dashboard: NavigatorScreenParams<HomeStackParamList>;
  Coupons: NavigatorScreenParams<CouponStackParamList>;
  Brands: NavigatorScreenParams<BrandStackParamList>;
  Categories: NavigatorScreenParams<CategoryStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>; // MainTabs now uses the corrected MainTabParamList
  // Detail screens as modals
  CouponDetail: { couponId: number };
  BrandDetail: { brandId: number };
  CategoryDetail: { categoryId: number };
  // Profile screens
  EditProfile: undefined;
  Favorites: undefined;
  // Auth screen
  Auth: undefined;
  // Modals or other screens outside tabs can be defined here
  // Example: NotFound: undefined;
};
