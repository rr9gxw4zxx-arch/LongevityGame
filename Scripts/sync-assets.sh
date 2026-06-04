#!/bin/bash

UE5_OUTPUT="$BUILD_DIR/UE5"
CORDOVA_ASSETS="$CORDOVA_PATH/platforms/ios/App/Assets"

echo "同步UE5资源到Cordova..."
echo "Cordova路径: $CORDOVA_PATH"

mkdir -p "$CORDOVA_ASSETS/UE5"

if [ -d "$UE5_OUTPUT/Payload" ]; then
    cp -r "$UE5_OUTPUT/Payload/LongevityUE5.app" "$CORDOVA_ASSETS/UE5/" 2>/dev/null || true
fi

if [ -d "$UE5_OUTPUT/GameData" ]; then
    cp -r "$UE5_OUTPUT/GameData" "$CORDOVA_ASSETS/UE5/" 2>/dev/null || true
fi

echo "资源同步完成!"