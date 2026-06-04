#!/bin/bash

CORDOVA_PATH="$CORDOVA_PATH"
BUILD_CONFIG="release"

echo "开始构建Cordova项目..."
echo "Cordova路径: $CORDOVA_PATH"

if [ ! -d "$CORDOVA_PATH" ]; then
    echo "错误: Cordova目录不存在"
    echo "路径: $CORDOVA_PATH"
    exit 1
fi

cd $CORDOVA_PATH

echo "安装npm依赖..."
npm install

echo "添加iOS平台..."
cordova platform add ios@7.0.1 --save

echo "安装插件..."
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-statusbar

echo "构建iOS项目..."
cordova build ios --$BUILD_CONFIG --device

echo "Cordova构建完成!"