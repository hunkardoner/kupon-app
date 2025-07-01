#!/bin/bash

# KuponCepte iOS Build Script
# Bu script iOS IPA dosyası oluşturur ve test için hazırlar

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
echo "║          KuponCepte iOS Builder       ║"
echo "║         Test Build Generator         ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# Mevcut dizini kontrol et
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Hata: package.json bulunamadı. Lütfen mobile dizininde çalıştırın.${NC}"
    exit 1
fi

# macOS kontrolü
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ iOS build sadece macOS'ta yapılabilir.${NC}"
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

# Xcode kontrol et
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Xcode yüklü değil. Lütfen Xcode'u App Store'dan yükleyin.${NC}"
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

# CocoaPods yükle/güncelle
if [ -f "ios/Podfile" ]; then
    echo -e "${YELLOW}🍫 CocoaPods güncelleniyor...${NC}"
    cd ios
    pod install --repo-update
    cd ..
fi

# Cache temizle
echo -e "${YELLOW}🧹 Cache temizleniyor...${NC}"
npm run clear || npx expo start --clear --no-dev &
sleep 2
pkill -f "expo start" || true

# Build klasörlerini temizle
echo -e "${YELLOW}🗑️  Eski build dosyları temizleniyor...${NC}"
rm -rf ios/build/
rm -rf ios/DerivedData/
rm -rf node_modules/.cache/

# Xcode derived data temizle
echo -e "${YELLOW}🧹 Xcode cache temizleniyor...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/KuponCepte-*

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
echo "2) Preview Build (AdHoc distribution, test için)"  
echo "3) Production Build (App Store için)"

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

# Build tipi seç
echo -e "${BLUE}📱 Build tipi seçin:${NC}"
echo "1) Simulator Build (M1/M2 Mac için, en hızlı)"
echo "2) Device Build (Gerçek cihaz için)"

read -p "Seçiminiz (1-2): " -n 1 -r
echo

case $REPLY in
    1)
        BUILD_TYPE="simulator"
        echo -e "${GREEN}✅ Simulator build seçildi${NC}"
        ;;
    2)
        BUILD_TYPE="device"
        echo -e "${GREEN}✅ Device build seçildi${NC}"
        ;;
    *)
        BUILD_TYPE="simulator"
        echo -e "${YELLOW}⚠️  Geçersiz seçim, Simulator build kullanılacak${NC}"
        ;;
esac

# IPA build yöntemi seçeneği (sadece device build için)
if [ "$BUILD_TYPE" = "device" ]; then
    echo -e "${BLUE}🔨 Build yöntemi seçin:${NC}"
    echo "1) Lokal build (Bilgisayarınızda, Xcode gerekli)"
    echo "2) EAS cloud build (Expo sunucularında, önerilen)"

    read -p "Seçiminiz (1-2): " -n 1 -r
    echo

    case $REPLY in
        1)
            BUILD_METHOD="local"
            echo -e "${GREEN}✅ Lokal build seçildi${NC}"
            
            # Apple Developer hesabı kontrol
            echo -e "${YELLOW}⚠️  Lokal build için Apple Developer hesabı ve sertifikalar gereklidir.${NC}"
            echo -e "${BLUE}💡 Xcode'da hesabınızı eklediğinizden emin olun.${NC}"
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
else
    BUILD_METHOD="local"  # Simulator için her zaman lokal
fi

# Build işlemini başlat
echo -e "${BLUE}🚀 iOS build işlemi başlatılıyor...${NC}"

if [ "$BUILD_TYPE" = "simulator" ]; then
    # Simulator build (her zaman lokal)
    echo -e "${YELLOW}🔨 iOS Simulator build başlatılıyor...${NC}"
    
    # Prebuild işlemi
    npx expo prebuild --platform ios --clean
    
    # Team ID ayarla
    TEAM_ID="5GYC45NJT7"
    echo -e "${GREEN}✅ Team ID ayarlandı: $TEAM_ID${NC}"
    
    # Xcode build for simulator
    cd ios
    echo -e "${YELLOW}🔨 Simulator için build yapılıyor...${NC}"
    xcodebuild -workspace KuponCepte.xcworkspace \
               -scheme KuponCepte \
               -configuration Release \
               -sdk iphonesimulator \
               -derivedDataPath ./build \
               -allowProvisioningUpdates \
               DEVELOPMENT_TEAM=$TEAM_ID \
               -quiet
    cd ..
    
    # App dosyasını bul
    APP_PATH="ios/build/Build/Products/Release-iphonesimulator/KuponCepte.app"
    if [ -d "$APP_PATH" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        OUTPUT_NAME="KuponCepte_${BUILD_PROFILE}_simulator_${TIMESTAMP}.app"
        cp -r "$APP_PATH" "./$OUTPUT_NAME"
        echo -e "${GREEN}✅ Simulator app başarıyla oluşturuldu: $OUTPUT_NAME${NC}"
    else
        echo -e "${RED}❌ Simulator app dosyası bulunamadı: $APP_PATH${NC}"
        exit 1
    fi

elif [ "$BUILD_METHOD" = "local" ]; then
    # Lokal device build
    echo -e "${YELLOW}🔨 Lokal iOS device build başlatılıyor...${NC}"
    
    # Prebuild işlemi
    npx expo prebuild --platform ios --clean
    
    # Team ID statik olarak ayarla
    TEAM_ID="5GYC45NJT7"
    echo -e "${GREEN}✅ Team ID ayarlandı: $TEAM_ID${NC}"
    
    # Export method'unu profile'a göre ayarla
    if [ "$BUILD_PROFILE" = "production" ]; then
        EXPORT_METHOD="app-store"
    elif [ "$BUILD_PROFILE" = "preview" ]; then
        EXPORT_METHOD="ad-hoc"
    else
        EXPORT_METHOD="development"
    fi
    
    echo -e "${BLUE}📋 Export method: $EXPORT_METHOD${NC}"
    
    # ExportOptions.plist oluştur
    cat > ios/ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>$EXPORT_METHOD</string>
    <key>teamID</key>
    <string>$TEAM_ID</string>
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
</dict>
</plist>
EOF
    
    echo -e "${GREEN}✅ ExportOptions.plist oluşturuldu${NC}"
    
    # Archive oluştur
    cd ios
    echo -e "${YELLOW}🔨 Archive oluşturuluyor...${NC}"
    xcodebuild -workspace KuponCepte.xcworkspace \
               -scheme KuponCepte \
               -configuration Release \
               -archivePath ./build/KuponCepte.xcarchive \
               -allowProvisioningUpdates \
               -allowProvisioningDeviceRegistration \
               archive \
               DEVELOPMENT_TEAM=$TEAM_ID \
               -quiet
    
    # IPA export
    echo -e "${YELLOW}📦 IPA export ediliyor...${NC}"
    xcodebuild -exportArchive \
               -archivePath ./build/KuponCepte.xcarchive \
               -exportOptionsPlist ./ExportOptions.plist \
               -exportPath ./build/ \
               -allowProvisioningUpdates \
               -quiet
    cd ..
    
    # IPA dosyasını bul ve kopyala
    IPA_PATH="ios/build/KuponCepte.ipa"
    if [ -f "$IPA_PATH" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        OUTPUT_NAME="KuponCepte_${BUILD_PROFILE}_${TIMESTAMP}.ipa"
        cp "$IPA_PATH" "./$OUTPUT_NAME"
        echo -e "${GREEN}✅ IPA başarıyla oluşturuldu: $OUTPUT_NAME${NC}"
    else
        echo -e "${RED}❌ IPA dosyası bulunamadı: $IPA_PATH${NC}"
        exit 1
    fi
    
else
    # EAS cloud build
    echo -e "${YELLOW}☁️  EAS cloud build başlatılıyor...${NC}"
    
    if [ "$BUILD_PROFILE" = "development" ]; then
        eas build --platform ios --profile development
    else
        eas build --platform ios --profile $BUILD_PROFILE
    fi
fi

# Build tamamlandı
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║            BUILD TAMAMLANDI            ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

if [ "$BUILD_TYPE" = "simulator" ]; then
    echo -e "${GREEN}📱 Simulator app dosyanız hazır: $OUTPUT_NAME${NC}"
    echo -e "${BLUE}💡 Bu dosyayı iOS Simulator'da çalıştırabilirsiniz.${NC}"
    echo -e "${YELLOW}🔧 Simulator'da çalıştırmak için:${NC}"
    echo "   xcrun simctl install booted $OUTPUT_NAME"
    
elif [ "$BUILD_METHOD" = "local" ]; then
    echo -e "${GREEN}📱 IPA dosyanız hazır: $OUTPUT_NAME${NC}"
    echo -e "${BLUE}💡 Bu IPA'yı TestFlight veya AdHoc distribution ile paylaşabilirsiniz.${NC}"
    
    # Dosya boyutunu göster
    if [ -f "$OUTPUT_NAME" ]; then
        FILE_SIZE=$(ls -lh "$OUTPUT_NAME" | awk '{print $5}')
        echo -e "${YELLOW}📏 Dosya boyutu: $FILE_SIZE${NC}"
    fi
    
    # Distribution önerileri
    echo -e "${BLUE}💡 İpucu: IPA'yı TestFlight'a yükleyebilir veya AdHoc cihazlara yükleyebilirsiniz.${NC}"
    
else
    echo -e "${GREEN}📱 IPA dosyanız EAS dashboard'ta hazır olacak.${NC}"
    echo -e "${BLUE}🌐 EAS dashboard'u açmak için: eas build:list${NC}"
    echo -e "${BLUE}💡 Build tamamlandığında size e-posta gelecek.${NC}"
fi

echo -e "${YELLOW}📋 Test için notlar:${NC}"
if [ "$BUILD_TYPE" = "simulator" ]; then
    echo "• M1/M2 Mac'te iOS Simulator'da çalışır"
    echo "• Gerçek cihazda çalıştırmak için device build gerekir"
else
    echo "• IPA dosyası iOS 12+ cihazlarda çalışır"
    echo "• TestFlight veya AdHoc distribution gerekir"
    echo "• Cihazın UDID'sinin developer hesabına ekli olması gerekir"
fi
echo "• Test sırasında feedback toplamayı unutmayın"

echo -e "${BLUE}🎉 İyi testler!${NC}"
