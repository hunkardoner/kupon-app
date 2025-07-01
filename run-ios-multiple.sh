#!/bin/bash

# Hedef simülatör isimleri
SIMULATORS=("iPhone SE (3rd generation)" "iPhone 13 Pro Max" "iPhone 15 Pro")

# Xcode Simulator'ı başlat
open -a Simulator

# Her bir simülatörü başlat
for SIM in "${SIMULATORS[@]}"
do
  UDID=$(xcrun simctl list devices | grep "$SIM" | grep -v "unavailable" | awk -F '[()]' '{print $2}' | head -n 1)
  if [[ -n "$UDID" ]]; then
    echo "Booting $SIM ($UDID)..."
    xcrun simctl boot "$UDID" > /dev/null 2>&1
  else
    echo "Simülatör bulunamadı: $SIM"
  fi
done

# Metro bundler başlat
echo "Expo geliştirici sunucusu başlatılıyor..."
npx expo start --tunnel
