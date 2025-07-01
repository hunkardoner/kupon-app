#!/bin/bash

# ZappHaber Basit APK Builder
# Sadece lokal build için basitleştirilmiş script

set -e

echo "🚀 ZappHaber APK Builder (Basit Versiyon)"
echo "========================================"

# Mevcut dizini kontrol et
if [ ! -f "package.json" ]; then
    echo "❌ Hata: package.json bulunamadı. Lütfen mobile dizininde çalıştırın."
    exit 1
fi

# Dependencies yükle
echo "📦 Dependencies yükleniyor..."
npm install

# Cache temizle
echo "🧹 Cache temizleniyor..."
rm -rf node_modules/.cache/
rm -rf android/app/build/
rm -rf android/.gradle/

# Prebuild
echo "🔧 Android projesi hazırlanıyor..."
npx expo prebuild --platform android --clean

# APK build
echo "📱 APK oluşturuluyor..."
cd android
./gradlew assembleRelease
cd ..

# APK'yı kopyala
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
APK_SOURCE="android/app/build/outputs/apk/release/app-release.apk"
APK_OUTPUT="ZappHaber_${TIMESTAMP}.apk"

if [ -f "$APK_SOURCE" ]; then
    cp "$APK_SOURCE" "./$APK_OUTPUT"
    echo "✅ APK başarıyla oluşturuldu: $APK_OUTPUT"
    
    # Dosya boyutu
    FILE_SIZE=$(ls -lh "$APK_OUTPUT" | awk '{print $5}')
    echo "📏 Dosya boyutu: $FILE_SIZE"
    
    echo ""
    echo "🎉 Hazır! APK dosyanızı arkadaşlarınızla paylaşabilirsiniz."
    echo "💡 Not: Cihazlarda 'Bilinmeyen kaynaklar'dan yüklemeyi aktifleştirmeleri gerekiyor."
else
    echo "❌ APK dosyası oluşturulamadı!"
    exit 1
fi
