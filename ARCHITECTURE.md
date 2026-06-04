# Cordova + UE5 混合架构云端打包方案

## 一、架构概述

本方案采用 **Cordova + Unreal Engine 5 混合架构**，结合 **Bitrise 云端打包**，实现跨平台游戏开发与自动化构建。

### 架构层次

```
┌─────────────────────────────────────────────────────────────┐
│                    用户层 (User Layer)                      │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │   iOS App       │  │            UI层                 │  │
│  │  (Cordova外壳)  │  │  Cordova WebView + Native UI    │  │
│  └────────┬────────┘  └──────────────┬──────────────────┘  │
└───────────┼───────────────────────────┼─────────────────────┘
            │                           │
            ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  桥接层 (Bridge Layer)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Cordova-UE5 Bridge Plugin                           │  │
│  │   • 生命周期管理 • 资源加载 • 消息通信 • 性能监控      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   核心引擎层 (Engine Layer)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Unreal Engine 5 Runtime                     │  │
│  │  • Nanite 渲染 • Lumen 光照 • Niagara 粒子            │  │
│  │  • 开放世界 • 物理引擎 • AI系统                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 核心组件

| 组件 | 职责 | 技术栈 |
|------|------|--------|
| Cordova Shell | 原生外壳、生命周期、权限管理 | Cordova 12.x |
| UE5 Runtime | 游戏核心引擎、渲染、物理、AI | Unreal Engine 5.4 |
| Bridge Plugin | 通信桥接、资源管理 | Objective-C/Swift + C++ |
| UI层 | 菜单、HUD、设置界面 | HTML5 + CSS3 + JavaScript |

---

## 二、项目结构

```
LongevityGame/
├── .gitignore                      # Git忽略配置
├── ARCHITECTURE.md                 # 架构文档
├── bitrise.yml                     # Bitrise CI/CD配置
├── package.json                    # Node依赖配置
├── README.md                       # 项目说明
├── Scripts/                        # 构建脚本
│   ├── build-all.sh                # 完整构建流程
│   ├── build-cordova.sh            # Cordova构建
│   ├── build-ue5.sh                # UE5构建
│   ├── generate-assets.sh          # 资源生成
│   └── sync-assets.sh              # 资源同步
├── Cordova/                        # Cordova项目
│   ├── config.xml                  # Cordova配置
│   ├── package.json                # Cordova依赖
│   ├── platforms/                  # 平台目录
│   │   └── ios/                    # iOS平台
│   ├── plugins/                    # Cordova插件
│   │   └── cordova-plugin-ue5/     # UE5桥接插件
│   └── www/                        # Web资源
├── UE5Project/                     # UE5项目
│   ├── LongevityUE5.uproject       # UE5项目文件
│   ├── Source/                     # C++源码
│   ├── Content/                    # 游戏资源
│   ├── Config/                     # UE5配置
│   └── Build/                      # 构建输出
└── Shared/                         # 共享资源
    ├── Assets/                     # 游戏资源
    ├── Scripts/                    # 共享脚本
    └── Config/                     # 共享配置
```

---

## 三、云端打包流程

### 3.1 Bitrise工作流设计

```
┌─────────────────────────────────────────────────────────────────┐
│                        Bitrise Pipeline                         │
├─────────────────────────────────────────────────────────────────┤
│  [Trigger] → [Checkout] → [Install Dependencies]               │
│       │              │                    │                    │
│       ▼              ▼                    ▼                    │
│  [UE5 Build] → [Cordova Build] → [Merge Assets]                │
│       │              │                    │                    │
│       ▼              ▼                    ▼                    │
│  [Archive] → [Sign] → [Export IPA] → [Deploy]                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 工作流步骤详解

| 阶段 | 步骤 | 说明 |
|------|------|------|
| 1. 初始化 | Git Clone | 克隆代码仓库 |
| 2. 环境准备 | Install Node/npm | 安装Node.js环境 |
| 3. UE5构建 | Build UE5 Project | 编译UE5运行时 |
| 4. Cordova构建 | Build Cordova | 编译Cordova外壳 |
| 5. 资源合并 | Merge Assets | 合并UE5资源到Cordova |
| 6. 归档 | Xcode Archive | 创建IPA归档 |
| 7. 签名 | Code Sign | 代码签名 |
| 8. 部署 | Deploy | 部署到测试/商店 |

---

## 四、构建脚本

### 4.1 完整构建脚本 (build-all.sh)

```bash
#!/bin/bash
set -e

echo "========================================"
echo "  LongevityGame 完整构建流程"
echo "========================================"

# 环境变量
export BUILD_NUMBER=$(date +%Y%m%d%H%M)
export BUILD_DIR=$(pwd)/Build
export UE5_PROJECT_PATH=$(pwd)/UE5Project/LongevityUE5.uproject
export CORDOVA_PATH=$(pwd)/Cordova

echo "构建版本: $BUILD_NUMBER"
echo "构建目录: $BUILD_DIR"

# 创建构建目录
mkdir -p $BUILD_DIR

# Step 1: UE5构建
echo "=== [1/4] 开始构建UE5项目 ==="
./Scripts/build-ue5.sh

# Step 2: 资源生成
echo "=== [2/4] 生成游戏资源 ==="
./Scripts/generate-assets.sh

# Step 3: Cordova构建
echo "=== [3/4] 构建Cordova项目 ==="
./Scripts/build-cordova.sh

# Step 4: 资源同步
echo "=== [4/4] 同步资源 ==="
./Scripts/sync-assets.sh

echo "========================================"
echo "  构建完成!"
echo "  输出目录: $BUILD_DIR"
echo "========================================"
```

### 4.2 UE5构建脚本 (build-ue5.sh)

```bash
#!/bin/bash
set -e

UE5_PATH="/Applications/Epic Games/UE_5.4/Engine/Binaries/Mac/UnrealEditor"
PROJECT_PATH="$UE5_PROJECT_PATH"
BUILD_CONFIG="Development"
PLATFORM="IOS"

echo "开始构建UE5项目..."
echo "项目路径: $PROJECT_PATH"
echo "构建配置: $BUILD_CONFIG"
echo "目标平台: $PLATFORM"

# 构建命令
"$UE5_PATH" "$PROJECT_PATH" \
    -run=cook -targetplatform=$PLATFORM \
    -cookall -mapsonly -skipeditorcontent \
    -compress -multiprocess \
    -NoP4 -NoHotReload \
    -log="$BUILD_DIR/ue5-build.log"

# 打包命令
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
```

### 4.3 Cordova构建脚本 (build-cordova.sh)

```bash
#!/bin/bash
set -e

CORDOVA_PATH="$CORDOVA_PATH"
BUILD_CONFIG="release"

echo "开始构建Cordova项目..."

cd $CORDOVA_PATH

# 安装依赖
npm install

# 添加iOS平台
cordova platform add ios@7.0.1 --save

# 安装插件
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-ue5

# 构建iOS项目
cordova build ios --$BUILD_CONFIG \
    --buildConfig=build.json \
    --device

echo "Cordova构建完成!"
```

### 4.4 资源同步脚本 (sync-assets.sh)

```bash
#!/bin/bash
set -e

UE5_OUTPUT="$BUILD_DIR/UE5"
CORDOVA_ASSETS="$CORDOVA_PATH/platforms/ios/App/Assets"

echo "同步UE5资源到Cordova..."

# 创建资源目录
mkdir -p $CORDOVA_ASSETS/UE5

# 复制UE5打包资源
cp -r "$UE5_OUTPUT/Payload/LongevityUE5.app" "$CORDOVA_ASSETS/UE5/"

# 复制游戏数据
cp -r "$UE5_OUTPUT/GameData" "$CORDOVA_ASSETS/UE5/"

# 更新构建版本号
sed -i '' "s/BUILD_NUMBER/$BUILD_NUMBER/g" "$CORDOVA_PATH/config.xml"

echo "资源同步完成!"
```

---

## 五、Bitrise配置优化

### 5.1 环境变量配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| UE5_PATH | UE5引擎路径 | `/Applications/Epic Games/UE_5.4` |
| BUILD_NUMBER | 构建版本号 | 自动生成 |
| APPLE_TEAM_ID | Apple团队ID | `XXXXXXXXXX` |
| APPLE_APP_ID | App Store应用ID | `com.example.game` |
| SIGNING_CERT | 签名证书名称 | `iPhone Developer` |
| PROVISIONING_PROFILE | 配置文件UUID | `xxxxxxx-xxxx-xxxx` |

### 5.2 工作流配置

```yaml
workflows:
  primary:
    steps:
      - activate-ssh-key@4: {}
      - git-clone@6: {}
      - cache-pull@2: {}
      - npm@1:
          inputs:
            - command: "install"
      - script@1:
          inputs:
            - content: |
                # 设置环境变量
                export UE5_PATH="/Applications/Epic Games/UE_5.4"
                export PATH="$UE5_PATH/Engine/Binaries/Mac:$PATH"
                
                # 执行构建
                ./Scripts/build-all.sh
      - xcode-archive@4:
          inputs:
            - project_path: "Cordova/platforms/ios/App.xcworkspace"
            - scheme: "App"
            - configuration: "Release"
      - deploy-to-bitrise-io@2: {}
      - cache-push@2: {}
```

---

## 六、UE5桥接插件设计

### 6.1 插件架构

```
Cordova Plugin (Objective-C)
        │
        ▼
┌─────────────────┐
│  CDVUE5.h/m     │  ← Cordova插件接口
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UE5Bridge.h/m  │  ← 桥接层
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UE5Runtime     │  ← UE5运行时
└─────────────────┘
```

### 6.2 核心API

| 方法 | 功能 | 参数 | 返回值 |
|------|------|------|--------|
| `startUE5` | 启动UE5引擎 | 无 | void |
| `stopUE5` | 停止UE5引擎 | 无 | void |
| `sendMessage` | 发送消息到UE5 | message (string) | void |
| `addListener` | 添加消息监听器 | eventName, callback | void |
| `loadLevel` | 加载关卡 | levelName (string) | void |
| `getState` | 获取UE5状态 | 无 | state (object) |

---

## 七、iOS平台配置

### 7.1 Info.plist配置

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arm64</string>
</array>
```

### 7.2 构建配置

| 配置项 | 值 |
|--------|-----|
| 目标平台 | iOS 15.0+ |
| 架构 | arm64 |
| 优化级别 | -O2 |
| 位码 | 启用 |
| 符号表 | 保留 |

---

## 八、性能优化策略

### 8.1 UE5优化

- **Nanite**: 使用虚拟几何体技术
- **Lumen**: 使用动态全局光照
- **HLOD**: 层次细节优化
- **流式加载**: 按需加载资源

### 8.2 Cordova优化

- **WebView优化**: 使用WKWebView
- **内存管理**: 及时释放Web资源
- **线程管理**: 避免主线程阻塞

### 8.3 打包优化

- **资源压缩**: 压缩纹理和模型
- **代码混淆**: 保护代码安全
- **增量更新**: 支持热更新

---

## 九、安全策略

### 9.1 代码签名

- 使用Apple官方签名证书
- 定期轮换证书
- 保护签名私钥

### 9.2 数据加密

- 本地数据加密存储
- 网络传输TLS加密
- 敏感数据脱敏处理

### 9.3 反篡改

- 代码完整性校验
- 运行时自我保护
- 反调试检测

---

## 十、部署策略

### 10.1 测试环境

- 使用Ad Hoc分发
- 内部测试人员测试
- 收集反馈

### 10.2 生产环境

- App Store发布
- TestFlight测试
- 灰度发布

### 10.3 更新策略

- 定期版本更新
- 紧急修复快速响应
- 用户反馈及时处理

---

## 十一、故障排查

### 11.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| UE5构建失败 | 引擎路径错误 | 检查UE5_PATH环境变量 |
| 签名失败 | 证书配置错误 | 检查签名配置 |
| 资源缺失 | 同步脚本失败 | 检查sync-assets.sh |
| 性能问题 | 资源过大 | 优化资源大小 |

### 11.2 日志分析

- UE5构建日志: `Build/ue5-build.log`
- Cordova构建日志: `Build/cordova-build.log`
- Bitrise日志: 在Bitrise控制台查看

---

## 十二、扩展计划

### 12.1 多平台支持

- Android平台
- macOS平台
- Windows平台

### 12.2 功能扩展

- 多人联机
- 云存档
- DLC支持

### 12.3 工具链扩展

- 自动化测试
- 性能监控
- 错误追踪

---

**文档版本**: v1.0  
**创建日期**: 2026-06-04  
**适用项目**: LongevityGame / 洪荒长生 - 李长寿传