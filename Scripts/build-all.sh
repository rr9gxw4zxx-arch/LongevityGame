#!/bin/bash

echo "========================================"
echo "  LongevityGame 完整构建流程"
echo "========================================"

export BUILD_NUMBER=$(date +%Y%m%d%H%M)
export BUILD_DIR=$(pwd)/Build
export UE5_PROJECT_PATH=$(pwd)/UE5Project/LongevityUE5.uproject
export CORDOVA_PATH=$(pwd)/ios-app

echo "构建版本: $BUILD_NUMBER"
echo "构建目录: $BUILD_DIR"
echo "Cordova路径: $CORDOVA_PATH"

mkdir -p $BUILD_DIR

echo "=== [1/4] 开始构建UE5项目 ==="
./Scripts/build-ue5.sh || echo "UE5构建跳过（引擎未安装）"

echo "=== [2/4] 生成游戏资源 ==="
./Scripts/generate-assets.sh

echo "=== [3/4] 构建Cordova项目 ==="
./Scripts/build-cordova.sh || { echo "Cordova构建失败"; exit 1; }

echo "=== [4/4] 同步资源 ==="
./Scripts/sync-assets.sh

echo "========================================"
echo "  构建完成!"
echo "  输出目录: $BUILD_DIR"
echo "========================================"