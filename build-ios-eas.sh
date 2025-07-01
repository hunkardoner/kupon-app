#!/bin/bash

echo "🍎 KuponCepte iOS EAS Build (IPA)"
echo "================================="

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
echo "║         EAS Cloud Build              ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# EAS CLI kontrolü
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}📦 EAS CLI yükleniyor...${NC}"
    npm install -g @expo/eas-cli
fi

# Expo CLI kontrolü
if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}📦 Expo CLI yükleniyor...${NC}"
    npm install -g @expo/cli
fi

# Login kontrol
echo -e "${BLUE}🔐 Expo hesabı kontrol ediliyor...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Expo hesabına giriş yapmanız gerekiyor.${NC}"
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
echo -e "${BLUE}🎯 iOS Build profili seçin:${NC}"
echo "1) Development (Test için, Apple Developer hesabı gerekmez)"
echo "2) Preview (Beta test, Apple Developer hesabı gerekli)"
echo "3) Production (App Store, Apple Developer hesabı gerekli)"

read -p "Seçiminiz (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        PROFILE="development"
        echo -e "${GREEN}✅ Development build seçildi${NC}"
        echo -e "${BLUE}💡 Bu build iOS Simulator'da çalışır${NC}"
        ;;
    2)
        PROFILE="preview"
        echo -e "${GREEN}✅ Preview build seçildi${NC}"
        echo -e "${BLUE}💡 Bu build fiziksel cihazlarda test için uygundur${NC}"
        ;;
    3)
        PROFILE="production"
        echo -e "${GREEN}✅ Production build seçildi${NC}"
        echo -e "${BLUE}💡 Bu build App Store'a yükleme için uygundur${NC}"
        ;;
    *)
        PROFILE="preview"
        echo -e "${YELLOW}⚠️  Geçersiz seçim, Preview build kullanılacak${NC}"
        ;;
esac

# Cache temizle
echo -e "${BLUE}🧹 Cache temizleniyor...${NC}"
rm -rf .expo/
rm -rf node_modules/.cache/

# Dependencies kontrol
echo -e "${YELLOW}📦 Dependencies kontrol ediliyor...${NC}"
npm install

echo -e "${BLUE}🚀 EAS iOS build başlatılıyor...${NC}"
echo -e "${YELLOW}📱 Profil: $PROFILE${NC}"
echo -e "${YELLOW}📱 Platform: iOS${NC}"

# EAS build başlat
if [ "$PROFILE" = "development" ]; then
    echo -e "${BLUE}💡 Development build iOS Simulator için hazırlanıyor...${NC}"
    eas build --platform ios --profile development
else
    echo -e "${BLUE}💡 Production build Apple Developer sertifikaları ile hazırlanıyor...${NC}"
    eas build --platform ios --profile $PROFILE
fi

# Build sonrası bilgilendirme
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║            BUILD BAŞLATILDI            ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}✅ EAS Build başarıyla başlatıldı!${NC}"
echo -e "${BLUE}🌐 Build durumunu takip etmek için: eas build:list${NC}"
echo -e "${BLUE}📧 Build tamamlandığında size e-posta gelecek${NC}"
echo -e "${BLUE}📱 IPA dosyasını EAS dashboard'tan indirebilirsiniz${NC}"

echo -e "${YELLOW}📋 Sonraki adımlar:${NC}"
case $PROFILE in
    "development")
        echo "• Build tamamlandığında IPA'yı indirin"
        echo "• iOS Simulator'da test edin"
        echo "• Expo Development Build uygulaması ile test edin"
        ;;
    "preview")
        echo "• Build tamamlandığında IPA'yı indirin"
        echo "• TestFlight'a yükleyebilirsiniz"
        echo "• Registered devices'a kurabilirsiniz"
        ;;
    "production")
        echo "• Build tamamlandığında IPA'yı indirin"
        echo "• App Store Connect'e yükleyin"
        echo "• App Review sürecine gönderin"
        ;;
esac

echo -e "${BLUE}🎉 İyi testler!${NC}"