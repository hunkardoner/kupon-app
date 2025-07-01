#!/bin/bash

# KuponCepte APK Build Script
# Bu script Android APK dosyası oluşturur ve test için hazırlar

set -e  # Hata durumunda script'i durdur

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logo ve başlık
echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║          KuponCepte APK Builder       ║"
echo "║         Test Build Generator         ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# Mevcut dizini kontrol et
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Hata: package.json bulunamadı. Lütfen mobile dizininde çalıştırın.${NC}"
    exit 1
fi

# Node.js ve npm kontrol et
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js yüklü değil. Lütfen Node.js'i yükleyin.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm yüklü değil. Lütfen npm'i yükleyin.${NC}"
    exit 1
fi

# EAS CLI kontrol et ve gerekirse yükle
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI bulunamadı. Yükleniyor...${NC}"
    npm install -g @expo/eas-cli
fi

# Expo CLI kontrol et
if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}⚠️  Expo CLI bulunamadı. Yükleniyor...${NC}"
    npm install -g @expo/cli
fi

echo -e "${BLUE}📋 Build öncesi kontroller...${NC}"

# Dependencies yükle
echo -e "${YELLOW}📦 Dependencies kontrol ediliyor...${NC}"
npm install

# Cache temizle
echo -e "${YELLOW}🧹 Cache temizleniyor...${NC}"
npm run clear || npx expo start --clear --no-dev &
sleep 2
pkill -f "expo start" || true

# Build klasörlerini temizle
echo -e "${YELLOW}🗑️  Eski build dosyları temizleniyor...${NC}"
rm -rf android/app/build/
rm -rf android/build/
rm -rf node_modules/.cache/

# EAS login kontrol et
echo -e "${BLUE}🔐 Expo hesabı kontrol ediliyor...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Expo hesabınıza giriş yapmanız gerekiyor.${NC}"
    echo -e "${BLUE}💡 'expo login' komutu ile giriş yapabilirsiniz.${NC}"
    read -p "Şimdi giriş yapmak ister misiniz? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        expo login
    else
        echo -e "${RED}❌ Build için Expo hesabına giriş gereklidir.${NC}"
        exit 1
    fi
fi

# EAS projesi kontrol et
if [ ! -f "eas.json" ]; then
    echo -e "${YELLOW}⚠️  eas.json bulunamadı. EAS projesi yapılandırılıyor...${NC}"
    eas init
fi

# Build profili seç
echo -e "${BLUE}🎯 Build profili seçin:${NC}"
echo "1) Development Build (Hızlı, test için)"
echo "2) Preview Build (Production benzeri, test için)"  
echo "3) Production Build (Yayın için)"

read -p "Seçiminiz (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        BUILD_PROFILE="development"
        echo -e "${GREEN}✅ Development build seçildi${NC}"
        ;;
    2)
        BUILD_PROFILE="preview" 
        echo -e "${GREEN}✅ Preview build seçildi${NC}"
        ;;
    3)
        BUILD_PROFILE="production"
        echo -e "${GREEN}✅ Production build seçildi${NC}"
        ;;
    *)
        BUILD_PROFILE="preview"
        echo -e "${YELLOW}⚠️  Geçersiz seçim, Preview build kullanılacak${NC}"
        ;;
esac

# APK lokal build seçeneği
echo -e "${BLUE}📲 Build yöntemi seçin:${NC}"
echo "1) Lokal build (Bilgisayarınızda, Android Studio gerekli)"
echo "2) EAS cloud build (Expo sunucularında, önerilen)"

read -p "Seçiminiz (1-2): " -n 1 -r
echo

case $REPLY in
    1)
        BUILD_METHOD="local"
        echo -e "${GREEN}✅ Lokal build seçildi${NC}"
        
        # Android Studio ve SDK kontrol
        if [ ! -d "$ANDROID_HOME" ]; then
            echo -e "${RED}❌ Android SDK bulunamadı. ANDROID_HOME değişkeni ayarlanmalı.${NC}"
            echo -e "${YELLOW}💡 Android Studio'yu yükleyin ve SDK path'ini ayarlayın.${NC}"
            exit 1
        fi
        ;;
    2)
        BUILD_METHOD="cloud"
        echo -e "${GREEN}✅ EAS cloud build seçildi${NC}"
        ;;
    *)
        BUILD_METHOD="cloud"
        echo -e "${YELLOW}⚠️  Geçersiz seçim, EAS cloud build kullanılacak${NC}"
        ;;
esac

# Build işlemini başlat
echo -e "${BLUE}🚀 APK build işlemi başlatılıyor...${NC}"

if [ "$BUILD_METHOD" = "local" ]; then
    # Lokal build
    echo -e "${YELLOW}🔨 Lokal Android build başlatılıyor...${NC}"
    
    # Prebuild işlemi
    npx expo prebuild --platform android --clean
    
    # Gradle build
    cd android
    ./gradlew assembleRelease
    cd ..
    
    # APK dosyasını bul ve kopyala
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        OUTPUT_NAME="KuponCepte_${BUILD_PROFILE}_${TIMESTAMP}.apk"
        cp "$APK_PATH" "./$OUTPUT_NAME"
        echo -e "${GREEN}✅ APK başarıyla oluşturuldu: $OUTPUT_NAME${NC}"
    else
        echo -e "${RED}❌ APK dosyası bulunamadı: $APK_PATH${NC}"
        exit 1
    fi
    
else
    # EAS cloud build
    echo -e "${YELLOW}☁️  EAS cloud build başlatılıyor...${NC}"
    
    if [ "$BUILD_PROFILE" = "development" ]; then
        eas build --platform android --profile development --local
    else
        eas build --platform android --profile $BUILD_PROFILE
    fi
fi

# Build tamamlandı
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║            BUILD TAMAMLANDI            ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

if [ "$BUILD_METHOD" = "local" ]; then
    echo -e "${GREEN}📱 APK dosyanız hazır: $OUTPUT_NAME${NC}"
    echo -e "${BLUE}💡 Bu APK'yı arkadaşlarınızla paylaşabilirsiniz.${NC}"
    
    # Dosya boyutunu göster
    if [ -f "$OUTPUT_NAME" ]; then
        FILE_SIZE=$(ls -lh "$OUTPUT_NAME" | awk '{print $5}')
        echo -e "${YELLOW}📏 Dosya boyutu: $FILE_SIZE${NC}"
    fi
    
    # QR kod için öneride bulun
    echo -e "${BLUE}💡 İpucu: APK'yı Google Drive, Dropbox veya WeTransfer ile paylaşabilirsiniz.${NC}"
    
else
    echo -e "${GREEN}📱 APK dosyanız EAS dashboard'ta hazır olacak.${NC}"
    echo -e "${BLUE}🌐 EAS dashboard'u açmak için: eas build:list${NC}"
    echo -e "${BLUE}💡 Build tamamlandığında size e-posta gelecek.${NC}"
fi

echo -e "${YELLOW}📋 Test için notlar:${NC}"
echo "• APK'yı kurmadan önce 'Bilinmeyen kaynaklardan yükleme'yi aktifleştirin"
echo "• Android 8+ cihazlarda çalışır"
echo "• Test sırasında feedback toplamayı unutmayın"

echo -e "${BLUE}🎉 İyi testler!${NC}"
