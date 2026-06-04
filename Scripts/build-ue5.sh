#!/bin/bash

UE5_PATH="/Applications/Epic Games/UE_5.4/Engine/Binaries/Mac/UnrealEditor"
PROJECT_PATH="$UE5_PROJECT_PATH"
BUILD_CONFIG="Development"
PLATFORM="IOS"

echo "检查UE5引擎..."

if [ ! -f "$UE5_PATH" ]; then
    echo "警告: UE5引擎未安装在预期路径"
    echo "请从Epic Games Launcher安装UE5.4"
    echo "路径: $UE5_PATH"
    exit 0
fi

echo "开始构建UE5项目..."
echo "项目路径: $PROJECT_PATH"
echo "构建配置: $BUILD_CONFIG"
echo "目标平台: $PLATFORM"

if [ ! -f "$PROJECT_PATH" ]; then
    echo "警告: UE5项目文件不存在"
    echo "路径: $PROJECT_PATH"
    exit 0
fi

"$UE5_PATH" "$PROJECT_PATH" \
    -run=cook -targetplatform=$PLATFORM \
    -cookall -mapsonly -skipeditorcontent \
    -compress -multiprocess \
    -NoP4 -NoHotReload \
    -log="$BUILD_DIR/ue5-build.log"

"$UE5_PATH" "$PROJECT_PATH" \
    -run=BuildCookRun \
    -project="$PROJECT_PATH" \
    -noP4 \
    -platform=$PLATFORM \
    -config=$BUILD_CONFIG \
    -cook \
    -build \
    -stage \
    -pak \
    -archive \
    -archivedirectory="$BUILD_DIR/UE5" \
    -log="$BUILD_DIR/ue5-package.log"

echo "UE5构建完成!"