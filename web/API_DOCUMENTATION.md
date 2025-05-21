# API Dökümantasyonu

Bu dökümantasyon, KuponSal uygulamasının API endpoint'lerini açıklamaktadır.

## Temel URL

Tüm API endpoint'leri aşağıdaki temel URL üzerinden erişilebilir:

`http://sizin-domaininiz.com/api`

## Kimlik Doğrulama

Şu anda, `/api/user` endpoint'i hariç, diğer endpoint'ler için açık bir kimlik doğrulama yöntemi belirtilmemiştir. `/api/user` endpoint'i Sanctum kimlik doğrulaması kullanmaktadır.

---

## API Endpoint'leri

### 1. Kategoriler (`/categories`)

Kategori verilerini yönetmek için kullanılır.

- **GET `/categories`**: Tüm kategorileri listeler.
- **POST `/categories`**: Yeni bir kategori oluşturur.
  - **Request Body**: Kategori detayları (örn: `name`, `description`, vb.)
- **GET `/categories/{id}`**: Belirli bir kategoriyi görüntüler.
- **PUT/PATCH `/categories/{id}`**: Belirli bir kategoriyi günceller.
  - **Request Body**: Güncellenecek kategori detayları.
- **DELETE `/categories/{id}`**: Belirli bir kategoriyi siler.

### 2. Markalar (`/brands`)

Marka verilerini yönetmek için kullanılır.

- **GET `/brands`**: Tüm markaları listeler.
- **POST `/brands`**: Yeni bir marka oluşturur.
  - **Request Body**: Marka detayları (örn: `name`, `logo`, vb.)
- **GET `/brands/{id}`**: Belirli bir markayı görüntüler.
- **PUT/PATCH `/brands/{id}`**: Belirli bir markayı günceller.
  - **Request Body**: Güncellenecek marka detayları.
- **DELETE `/brands/{id}`**: Belirli bir markayı siler.

### 3. Kupon Kodları (`/coupon-codes`)

Kupon kodu verilerini yönetmek için kullanılır.

- **GET `/coupon-codes`**: Tüm kupon kodlarını listeler.
- **POST `/coupon-codes`**: Yeni bir kupon kodu oluşturur.
  - **Request Body**: Kupon kodu detayları (örn: `code`, `description`, `discount_type`, `discount_value`, `brand_id`, vb.)
- **GET `/coupon-codes/{id}`**: Belirli bir kupon kodunu görüntüler.
- **PUT/PATCH `/coupon-codes/{id}`**: Belirli bir kupon kodunu günceller.
  - **Request Body**: Güncellenecek kupon kodu detayları.
- **DELETE `/coupon-codes/{id}`**: Belirli bir kupon kodunu siler.

### 4. Blog Yazıları (`/blogs`)

Blog yazısı verilerini yönetmek için kullanılır.

- **GET `/blogs`**: Tüm blog yazılarını listeler.
- **POST `/blogs`**: Yeni bir blog yazısı oluşturur.
  - **Request Body**: Blog yazısı detayları (örn: `title`, `content`, `author_id`, vb.)
- **GET `/blogs/{id}`**: Belirli bir blog yazısını görüntüler.
- **PUT/PATCH `/blogs/{id}`**: Belirli bir blog yazısını günceller.
  - **Request Body**: Güncellenecek blog yazısı detayları.
- **DELETE `/blogs/{id}`**: Belirli bir blog yazısını siler.

### 5. Sayfalar (`/pages`)

Statik sayfa verilerini yönetmek için kullanılır.

- **GET `/pages`**: Tüm sayfaları listeler.
- **POST `/pages`**: Yeni bir sayfa oluşturur.
  - **Request Body**: Sayfa detayları (örn: `title`, `slug`, `content`, vb.)
- **GET `/pages/{id}`**: Belirli bir sayfayı görüntüler.
- **PUT/PATCH `/pages/{id}`**: Belirli bir sayfayı günceller.
  - **Request Body**: Güncellenecek sayfa detayları.
- **DELETE `/pages/{id}`**: Belirli bir sayfayı siler.

### 6. Sliderlar (`/sliders`)

Anasayfa slider (kaydırıcı) verilerini yönetmek için kullanılır.

- **GET `/sliders`**: Tüm sliderları listeler.
- **POST `/sliders`**: Yeni bir slider oluşturur.
  - **Request Body**: Slider detayları (örn: `title`, `image`, `link`, vb.)
- **GET `/sliders/{id}`**: Belirli bir sliderı görüntüler.
- **PUT/PATCH `/sliders/{id}`**: Belirli bir sliderı günceller.
  - **Request Body**: Güncellenecek slider detayları.
- **DELETE `/sliders/{id}`**: Belirli bir sliderı siler.

### 7. Kullanıcı Bilgisi (`/user`)

Kimliği doğrulanmış kullanıcı bilgilerini almak için kullanılır.

- **GET `/user`**: Mevcut kimliği doğrulanmış kullanıcının bilgilerini döndürür.
  - **Kimlik Doğrulama**: Sanctum token gerektirir.

---

Bu dökümantasyon, `Route::apiResource` kullanılarak tanımlanan standart RESTful endpoint'leri varsaymaktadır. Her bir endpoint için beklenen request parametreleri ve response formatları, ilgili Controller (`CategoryController`, `BrandController`, vb.) ve Model (`Category`, `Brand`, vb.) tanımlarınıza bağlı olarak değişiklik gösterebilir. Daha detaylı bilgi için bu dosyaları inceleyebilirsiniz.