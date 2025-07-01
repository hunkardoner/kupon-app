#!/bin/bash

echo "🍎 KuponCepte iOS Archive Build (IPA)"
echo "===================================="

# Archive build için gereksinimler
echo "📋 Gereksinimler kontrol ediliyor..."

# Apple Developer hesabı gerekli
echo "⚠️  UYARI: Bu işlem için Apple Developer hesabı gereklidir"
echo "💰 Apple Developer Program: $99/yıl"
echo ""

read -p "Apple Developer hesabınız var mı? (y/n): " has_dev_account

if [ "$has_dev_account" != "y" ]; then
    echo ""
    echo "📱 Apple Developer hesabı olmadan alternatifler:"
    echo "1. iOS Simulator kullanın (ücretsiz)"
    echo "2. Expo Go uygulaması ile test edin (ücretsiz)"
    echo "3. EAS Build kullanın (sınırlı ücretsiz)"
    echo ""
    echo "Alternatif komutlar:"
    echo "• iOS Simulator: npx expo run:ios"
    echo "• EAS Build: eas build --platform ios --profile preview"
    exit 0
fi

# Team ID'yi kullanıcıdan al
echo "📱 Apple Developer Team ID'nizi girin:"
echo "💡 Bu bilgiyi Apple Developer Portal > Membership sayfasında bulabilirsiniz"
read -p "Team ID: " TEAM_ID

if [ -z "$TEAM_ID" ]; then
    echo "❌ Team ID gereklidir"
    exit 1
fi

# iOS dependencies
echo "📦 iOS dependencies yükleniyor..."
cd ios
pod install --repo-update
cd ..

# Prebuild
echo "🔧 iOS projesi hazırlanıyor..."
npx expo prebuild --platform ios --clean

# Archive oluştur
echo "📦 iOS Archive oluşturuluyor..."
cd ios

# App name'i app.json'dan al
APP_NAME=$(node -p "require('../app.json').expo.name.replace(/\s+/g, '')")
echo "📱 App Name: $APP_NAME"

# Release scheme ile build
xcodebuild -workspace "${APP_NAME}.xcworkspace" \
           -scheme "$APP_NAME" \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath "${APP_NAME}.xcarchive" \
           archive \
           DEVELOPMENT_TEAM="$TEAM_ID" \
           CODE_SIGN_STYLE=Automatic

if [ $? -eq 0 ]; then
    echo "✅ Archive başarıyla oluşturuldu"
    
    # IPA export
    echo "📤 IPA dosyası export ediliyor..."
    
    # Export options plist oluştur
    cat > ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
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
    
    xcodebuild -exportArchive \
               -archivePath "${APP_NAME}.xcarchive" \
               -exportPath ./export \
               -exportOptionsPlist ExportOptions.plist
    
    if [ $? -eq 0 ]; then
        # IPA dosyasını ana dizine taşı
        TIMESTAMP=$(date "+%Y%m%d_%H%M%S")
        IPA_NAME="${APP_NAME}_ios_${TIMESTAMP}.ipa"
        
        # Export klasöründeki IPA'yı bul
        IPA_FILE=$(find ./export -name "*.ipa" | head -n 1)
        
        if [ -f "$IPA_FILE" ]; then
            mv "$IPA_FILE" "../$IPA_NAME"
            SIZE=$(ls -lh "../$IPA_NAME" | awk '{print $5}')
            
            echo "✅ IPA başarıyla oluşturuldu: $IPA_NAME"
            echo "📏 Dosya boyutu: $SIZE"
            echo ""
            echo "🎉 iOS IPA kullanmaya hazır!"
            echo "💡 Not: Development build - registered devices'da test edebilirsiniz."
        else
            echo "❌ IPA dosyası bulunamadı: ./export/"
            ls -la ./export/
        fi
    else
        echo "❌ IPA export işlemi başarısız"
    fi
else
    echo "❌ Archive oluşturma işlemi başarısız"
fi

cd ..
