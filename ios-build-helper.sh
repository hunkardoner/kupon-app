#!/bin/bash

echo "🧹 KuponCepte - Temiz iOS Build"
echo "=============================="

# Renkli çıktı
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  Local iOS build sorunları tespit edildi.${NC}"
echo -e "${BLUE}💡 Önerilen çözümler:${NC}"
echo ""
echo "1️⃣  EAS Cloud Build (Önerilen - Hızlı ve güvenilir)"
echo "2️⃣  Kapsamlı manuel temizlik"
echo "3️⃣  iOS Simulator test (Apple Developer hesabı gerekmez)"

read -p "Seçiminiz (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        echo -e "${GREEN}✅ EAS Cloud Build başlatılıyor...${NC}"
        
        # EAS CLI kontrol
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}📦 EAS CLI yükleniyor...${NC}"
            npm install -g @expo/eas-cli
        fi
        
        # Login kontrol
        if ! eas whoami &> /dev/null; then
            echo -e "${BLUE}🔐 Expo hesabına giriş yapın:${NC}"
            eas login
        fi
        
        # Build başlat
        echo -e "${BLUE}🚀 iOS Preview build başlatılıyor...${NC}"
        eas build --platform ios --profile preview
        
        echo -e "${GREEN}✅ Build başlatıldı! EAS dashboard'tan takip edebilirsiniz.${NC}"
        ;;
        
    2)
        echo -e "${YELLOW}🧹 Kapsamlı manuel temizlik başlatılıyor...${NC}"
        
        # Global temizlik
        echo "📁 Global cache temizleniyor..."
        rm -rf ~/.expo
        rm -rf ~/.npm/_cacache
        rm -rf ~/Library/Developer/Xcode/DerivedData
        rm -rf ~/Library/Caches/CocoaPods
        
        # Proje temizlik
        echo "📁 Proje cache temizleniyor..."
        rm -rf .expo/
        rm -rf node_modules/
        rm -rf ios/
        rm -rf android/
        
        # Dependencies
        echo "📦 Dependencies yeniden yükleniyor..."
        npm ci
        
        echo -e "${GREEN}✅ Temizlik tamamlandı. Şimdi tekrar build deneyebilirsiniz.${NC}"
        echo -e "${BLUE}💡 Sonraki adım: ./build-ios-archive.sh${NC}"
        ;;
        
    3)
        echo -e "${GREEN}✅ iOS Simulator build başlatılıyor...${NC}"
        
        # Cache temizle
        rm -rf .expo/ ios/ node_modules/.cache/
        npm install
        
        # Simulator build
        echo -e "${BLUE}📱 iOS Simulator için build hazırlanıyor...${NC}"
        npx expo run:ios
        
        ;;
        
    *)
        echo -e "${RED}❌ Geçersiz seçim${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📋 iOS Build Yardımcısı Tamamlandı${NC}"
echo -e "${BLUE}⏰ $(date)${NC}"