#!/bin/bash

echo "🚀 ZappHaber Development Build Fixer"
echo "==================================="

echo "🔧 Hangi platformu düzeltmek istiyorsunuz?"
echo "1) Android Emulator"
echo "2) iOS Simulator" 
echo "3) Her ikisi"
echo "4) Expo Go ile test (en basit)"
echo ""

read -p "Seçiminiz (1-4): " choice

case $choice in
    1)
        echo "📱 Android development build başlatılıyor..."
        npx expo run:android
        ;;
    2)
        echo "🍎 iOS development build başlatılıyor..."
        ./build-ios-dev-simple.sh
        ;;
    3)
        echo "📱 Android development build başlatılıyor..."
        npx expo run:android
        echo ""
        echo "🍎 iOS development build başlatılıyor..."
        ./build-ios-dev-simple.sh
        ;;
    4)
        echo "📱 Expo Go ile test başlatılıyor..."
        echo ""
        echo "📋 Adımlar:"
        echo "1. Telefonunuza 'Expo Go' uygulamasını indirin"
        echo "2. QR kodu taratın"
        echo "3. Uygulama çalışacak"
        echo ""
        npx expo start --clear
        ;;
    *)
        echo "❌ Geçersiz seçim!"
        exit 1
        ;;
esac

echo ""
echo "✅ İşlem tamamlandı!"
