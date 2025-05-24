# kupon
KuponSal, kullanıcıların çeşitli markalara ait indirim kuponlarını bulup kullanabileceği bir platformdur. Proje, bir web uygulaması (Laravel ile geliştirilmiş admin paneli ve kullanıcı arayüzü içerir) ve bu web uygulamasının sağladığı API'yi kullanan bir mobil uygulamadan (React Native ile geliştirilmiş) oluşmaktadır.

## Özellikler

**Web (Admin Paneli & API):**
*   Slider Yönetimi
*   Kategori Yönetimi (alt kategorilerle birlikte)
*   Marka Yönetimi
*   Kupon Kodu Yönetimi
*   Blog Yazısı Yönetimi
*   Statik Sayfa Yönetimi
*   E-posta Abonelik Yönetimi
*   Mobil uygulama için RESTful API servisi

**Mobil Uygulama (React Native):**
*   Anasayfa (Sliderlar, Popüler Kategoriler, Popüler Markalar, Popüler Kuponlar)
*   Kupon Listeleme ve Detay Görüntüleme
*   Marka Listeleme ve Detay Görüntüleme (markaya ait kuponlar)
*   Kategori Listeleme ve Detay Görüntüleme (kategoriye ait kuponlar)

## Teknolojiler

**Web (Backend & Frontend):**
*   PHP (Laravel Framework)
*   MySQL
*   HTML, CSS, JavaScript
*   Bootstrap

**Mobil Uygulama:**
*   React Native
*   TypeScript
*   React Navigation (Navigasyon)
*   TanStack Query (Veri Çekme ve Önbellekleme)
*   Axios (API İstekleri)

## Proje Yapısı

Proje ana dizininde iki ana klasör bulunmaktadır:

*   `web/`: Laravel tabanlı web uygulamasını ve API endpoint'lerini içerir.
    *   `web/API_DOCUMENTATION.md`: API endpoint'lerinin detaylı dökümantasyonu.
*   `mobile/`: React Native ile geliştirilmiş mobil uygulamayı içerir.
    *   `mobile/GELİŞTİRME.md`: Mobil uygulama geliştirme süreçleri ve iyileştirme alanları hakkında notlar.

## Kurulum ve Başlatma

Her bir alt projenin (web ve mobil) kendi `README.md` dosyalarında veya ilgili dökümantasyonlarında detaylı kurulum ve başlatma talimatları bulunmalıdır. Genel adımlar aşağıdaki gibidir:

**Web (Laravel):**
1.  `web/` dizinine gidin.
2.  Gerekli bağımlılıkları yükleyin (örn: `composer install`).
3.  `.env` dosyasını yapılandırın.
4.  Veritabanı migration'larını çalıştırın (örn: `php artisan migrate`).
5.  Uygulamayı başlatın (örn: `php artisan serve`).

**Mobil (React Native):**
1.  `mobile/` dizinine gidin.
2.  Gerekli bağımlılıkları yükleyin (örn: `npm install` veya `yarn install`).
3.  Gerekli ortam yapılandırmalarını yapın (API adresi vb.).
4.  Uygulamayı bir emülatörde/simülatörde veya fiziksel bir cihazda başlatın (örn: `npm run android` / `npm run ios` veya `yarn android` / `yarn ios`).

## API Dökümantasyonu

API endpoint'leri ve kullanımı hakkında detaylı bilgi için lütfen [`web/API_DOCUMENTATION.md`](web/API_DOCUMENTATION.md) dosyasına bakın.

## Geliştirme Notları ve İyileştirmeler

Mobil uygulama için potansiyel iyileştirme alanları ve geliştirme notları [`mobile/GELİŞTİRME.md`](mobile/GELİŞTİRME.md) dosyasında detaylandırılmıştır. Bu notlar, projenin mevcut durumunu ve gelecekteki olası geliştirme yönlerini anlamak için faydalı olabilir.