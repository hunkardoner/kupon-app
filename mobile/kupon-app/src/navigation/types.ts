import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  CouponDetail: { couponId: number };
  BrandDetail: { brandId: number };
  // Gerekirse Kategori Detay ekranı için parametreler eklenebilir
  // CategoryDetail: { categoryId: number }; 
};

export type CouponStackParamList = {
  CouponList: undefined; // Kupon listeleme ekranı için (CouponListScreen)
  CouponDetail: { couponId: number }; // Kupon detay ekranı için (CouponScreen) - string to number
};

export type BrandStackParamList = {
  BrandList: undefined; // Marka listeleme ekranı için (BrandListScreen)
  BrandDetail: { brandId: number }; // Marka detay ekranı için (BrandScreen) - string to number
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CouponsTab: NavigatorScreenParams<CouponStackParamList>;
  BrandsTab: NavigatorScreenParams<BrandStackParamList>;
  // Diğer sekmeler buraya eklenebilir
};

// RootStackParamList, modal ekranlar veya tab navigator dışındaki genel stack için kullanılabilir.
// Şimdilik MainTabParamList'i ana navigasyon olarak kullanacağız.
export type RootStackParamList = {
  MainTabs: undefined; // MainTabNavigator için
  // Detay ekranları artık kendi stack'leri içinde olduğu için buradan kaldırılabilir
  // Coupon: { couponId?: string }; 
  // Brand: { brandId?: string };   
};

// Önceki RootStackParamList tanımını yorum satırına alabilir veya silebilirsiniz.
// export type RootStackParamList = {
//   Home: undefined;
//   Coupon: { couponId?: string };
//   Brand: { brandId?: string };
// };
