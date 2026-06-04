#!/usr/bin/env bash
# 将主项目 www 资源同步到 Cordova ios-app
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IOS_WWW="${ROOT}/ios-app/www"

mkdir -p "${IOS_WWW}"

cp "${ROOT}/index.html" "${IOS_WWW}/"
rsync -a --delete "${ROOT}/src/" "${IOS_WWW}/src/"

# 保留 Cordova 图标与启动图
if [[ -d "${IOS_WWW}/img" ]]; then
  echo "保留现有 ios-app/www/img"
fi

echo "已同步到 ${IOS_WWW}"
echo "下一步: cd ios-app && cordova prepare ios"
