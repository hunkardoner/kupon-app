Geliştirilmesi Gereken ve Kurallardan Sapan Alanlar:

UI and Styling:
Styling Kütüphanesi: RULES.md styled-components veya Tailwind CSS önerirken, projede React Native'in dahili StyleSheet.create yöntemi kullanılıyor. Bu, kurala tam uyum için bir değişiklik gerektirebilir.
<!-- Responsive Design: useWindowDimensions gibi araçlarla ekran boyutlarına duyarlı tasarım prensipleri daha aktif kullanılabilir. -->
Dark Mode: useColorScheme ile karanlık mod desteği eklenmemiş.
Accessibility (a11y): ARIA rolleri ve native erişilebilirlik propları ile erişilebilirlik standartlarına uyum sağlanması belirtilmiş; bu konuda özel bir çalışma yapılmamış görünüyor.
Animasyonlar: react-native-reanimated ve react-native-gesture-handler ile performanslı animasyonlar ve jestler kuralda belirtilmiş. FlatList için react-native-gesture-handler dolaylı olarak kullanılıyor olabilir ancak özel animasyonlar için aktif bir kullanım yok.
Safe Area Management:
<!-- SafeAreaProvider'ın App.tsx içinde en üst seviyede kullanılıp kullanılmadığı kontrol edilmeli. -->
Kaydırılabilir içerikler için ScrollView yerine SafeAreaScrollView kullanımı önerilmiş.
Performance Optimization:
Resim Optimizasyonu: expo-image ile WebP formatı, boyut verisi ve lazy loading gibi optimizasyonlar önerilmiş. Şu anki Image bileşeni kullanımı daha temel düzeyde.
Memoization: useMemo, useCallback ve React.memo gibi tekniklerle gereksiz yeniden render'ların önlenmesi aktif olarak odaklanılmamış.
AppLoading ve SplashScreen kullanımı (Expo'nun yeni versiyonlarında expo-splash-screen modülü) uygulama başlangıç deneyimi için gözden geçirilebilir.
Navigation:
expo-router: RULES.md dinamik rotalar için expo-router kullanımını öneriyor. Proje şu anda @react-navigation/stack ve @react-navigation/bottom-tabs kullanıyor. Bu, mimari bir tercih farkıdır.
State Management:
Data Fetching: RULES.md veri çekme ve önbellekleme için react-query (yeni adıyla TanStack Query) kullanımını şiddetle tavsiye ediyor. Projede şu an manuel fetch çağrıları (src/api/index.ts) yapılıyor. Bu, kurala göre önemli bir geliştirme alanı.
Global State: React Context ve useReducer (veya Zustand, Redux Toolkit) ile global durum yönetimi henüz karmaşık bir ihtiyaç olmamış olabilir, ancak kuralda belirtilmiş.
Error Handling and Validation:
Zod: Runtime validasyon için Zod kullanımı önerilmiş, projede mevcut değil.
Error Logging: Sentry gibi servisler veya expo-error-reporter ile hata loglama entegrasyonu yapılmamış.
Global Error Boundaries: Beklenmedik hataları yakalamak için global hata sınırları (error boundaries) implemente edilmemiş.
Testing:
Jest, React Native Testing Library ve Detox ile test yazımı kurallarda belirtilmiş. Projede testlerle ilgili bir çalışma yapılmamış görünüyor.
Security:
Hassas verilerin saklanması gerekiyorsa react-native-encrypted-storage kullanımı önerilmiş.
Internationalization (i18n):
react-native-i18n veya expo-localization ile uluslararasılaştırma desteği eklenmemiş.
Key Conventions:
expo-constants (ortam değişkenleri), expo-permissions (cihaz izinleri), expo-updates (OTA güncellemeleri) gibi Expo modüllerinin aktif kullanımı gözden geçirilebilir.
TypeScript Usage:
tsconfig.json dosyasında strict modun aktif olduğundan emin olunmalı.
<!-- Syntax and Formatting:
Prettier kullanımı package.json dosyasında ve proje ayarlarında kontrol edilmeli. -->
