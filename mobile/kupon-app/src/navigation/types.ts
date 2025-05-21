export type HomeStackParamList = {
  HomeMain: undefined; // HomeScreen için
  // Home stack'ine özel diğer ekranlar buraya eklenebilir
};

export type CouponStackParamList = {
  CouponList: undefined; // Kupon listeleme ekranı için (CouponListScreen)
  CouponDetail: { couponId: string }; // Kupon detay ekranı için (CouponScreen)
};

export type BrandStackParamList = {
  BrandList: undefined; // Marka listeleme ekranı için (BrandListScreen)
  BrandDetail: { brandId: string }; // Marka detay ekranı için (BrandScreen)
};

export type MainTabParamList = {
  HomeTab: undefined; // Parametreleri HomeStackParamList\'ten alacak
  CouponsTab: undefined; // Parametreleri CouponStackParamList\'ten alacak
  BrandsTab: undefined; // Parametreleri BrandStackParamList\'ten alacak
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
