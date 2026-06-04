#!/usr/bin/env bash
# 同步资源 → 生成图标 → Cordova prepare/build（需完整 Xcode）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

chmod +x Scripts/*.sh
./Scripts/generate-ios-assets.sh
./Scripts/sync-ios-www.sh

cd ios-app

if ! xcodebuild -version 2>/dev/null | grep -q "Xcode"; then
  echo ""
  echo "[阻塞] 未检测到完整 Xcode（当前可能只有 Command Line Tools）"
  echo "请从 App Store 安装 Xcode 15.4，然后执行:"
  echo "  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  echo "  cd ${ROOT}/ios-app && cordova build ios"
  echo ""
  cordova prepare ios 2>/dev/null || true
  exit 1
fi

cordova plugin rm cordova-plugin-wkwebview-engine 2>/dev/null || true
cordova prepare ios
cordova build ios "$@"

echo ""
echo "真机安装: cd ios-app && cordova run ios --device"
