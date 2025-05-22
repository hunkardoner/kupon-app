import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
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
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CouponsTab: NavigatorScreenParams<CouponStackParamList>;
  BrandsTab: NavigatorScreenParams<BrandStackParamList>; // This was missing, added now
  CategoriesTab: NavigatorScreenParams<CategoryStackParamList>; 
  // SettingsTab: undefined; // Example for another potential tab
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>; // MainTabs now uses the corrected MainTabParamList
  // Modals or other screens outside tabs can be defined here
  // Example: NotFound: undefined;
};
