# AI Gallery Electron 打包指南

本指南将帮助您将 AI Gallery 项目打包成独立的桌面应用程序（Windows、macOS、Linux）。

## 📋 前提条件

在开始之前，请确保您的系统已安装以下软件：

### 1. Node.js
- **版本要求**：Node.js 16 或更高版本
- **下载地址**：https://nodejs.org/
- **验证安装**：
  ```bash
  node --version
  npm --version
  ```

### 2. Git（可选）
- **下载地址**：https://git-scm.com/
- **用途**：克隆项目仓库

## 🚀 快速开始

### Windows 用户（最简单）

1. **双击运行 `scripts/build.bat`**
   - 脚本会自动检查环境、安装依赖并打包应用
   - 打包完成后，安装程序位于 `dist` 目录

### 手动打包（所有平台）

#### 步骤 1：安装依赖

```bash
# 进入项目目录
cd xxl-ai-gallery

# 安装项目依赖
npm install
```

#### 步骤 2：打包应用

```bash
# 打包当前平台版本
npm run build

# 或者指定平台打包
npm run build:win      # Windows
npm run build:mac      # macOS
npm run build:linux    # Linux
```

#### 步骤 3：查找打包结果

打包完成后，在 `dist` 目录中可以找到：

- **Windows**: `AI Gallery Setup.exe`（安装程序）
- **macOS**: `AI Gallery.dmg`（磁盘映像）
- **Linux**: `AI Gallery.AppImage`（可执行文件）

## 📁 打包后的文件结构

```
dist/
├── win-unpacked/          # Windows 未打包版本
│   ├── AI Gallery.exe     # 可执行文件
│   └── resources/         # 应用资源
├── AI Gallery Setup.exe   # Windows 安装程序
├── AI Gallery Setup.exe.blockmap  # 增量更新文件
└── builder-effective-config.yaml  # 构建配置
```

## ⚙️ 配置选项

### 修改应用信息

编辑 `package.json` 文件中的 `build` 部分：

```json
{
  "build": {
    "appId": "com.yourcompany.ai-gallery",  // 应用 ID
    "productName": "Your App Name",          // 应用名称
    "directories": {
      "output": "dist"                       // 输出目录
    }
  }
}
```

### 自定义图标

将图标文件放在 `images` 目录中：

- **Windows**: `icon.ico`（256x256 像素，包含 16x16 ~ 256x256 多种尺寸）
- **macOS**: `icon.icns`（512x512 像素，包含 16x16 ~ 1024x1024 多种尺寸）
- **Linux**: `icon.png`（512x512 像素）

**在线转换工具**：
- [ICO Convert](https://icoconvert.com/) - SVG/PNG 转 ICO
- [Image2Icon](https://www.img2icnsapp.com/) - SVG/PNG 转 ICNS
- [ConvertICO](https://convertico.com/) - 在线 ICO 转换

**命令行方式（ImageMagick）**：
```bash
# 安装 ImageMagick
brew install imagemagick        # macOS
choco install imagemagick       # Windows
sudo apt-get install imagemagick # Linux

# 将 SVG 转换为不同尺寸的 PNG
convert images/icon.svg -resize 256x256 images/icon-256.png
convert images/icon.svg -resize 512x512 images/icon-512.png

# 创建 ICO 文件（Windows）
convert images/icon-{16,32,48,64,128,256}.png images/icon.ico
```

**图标设计建议**：简洁明了、颜色鲜明、避免文字、保持一致性。项目中已包含示例 SVG 图标：`images/icon.svg`。

### 修改安装程序行为

在 `package.json` 的 `build.nsis` 部分配置：

```json
{
  "nsis": {
    "oneClick": false,                    // 是否单击安装
    "allowToChangeInstallationDirectory": true,  // 允许更改安装目录
    "createDesktopShortcut": true,        // 创建桌面快捷方式
    "createStartMenuShortcut": true,      // 创建开始菜单快捷方式
    "shortcutName": "AI Gallery"          // 快捷方式名称
  }
}
```

## 🔧 开发模式

### 启动开发模式

```bash
# 启动 Electron 应用（开发模式）
npm start
```

### 开发模式特性

- **热重载**：修改代码后按 `Ctrl+R` 重新加载
- **开发者工具**：按 `F12` 打开 Chrome 开发者工具
- **调试**：可以设置断点、查看控制台输出

## 🐛 常见问题与解决方案

### 1. 依赖安装失败

**问题**：`npm install` 报错

**解决方案**：
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 目录
rm -rf node_modules

# 重新安装
npm install
```

### 2. 打包速度慢

**问题**：打包过程非常缓慢

**解决方案**：
- 使用国内镜像源：
  ```bash
  npm config set registry https://registry.npmmirror.com
  ```
- 确保网络连接稳定

### 3. 杀毒软件误报

**问题**：打包后的程序被杀毒软件误报为病毒

**解决方案**：
- 在杀毒软件中添加信任目录
- 使用代码签名证书（高级）
- 提交到杀毒软件厂商进行白名单申请

### 4. macOS 应用无法打开

**问题**：macOS 提示"无法打开，因为无法验证开发者"

**解决方案**：
1. 打开"系统偏好设置" → "安全性与隐私"
2. 在"通用"选项卡中，点击"仍要打开"
3. 或者使用以下命令移除隔离属性：
   ```bash
   xattr -cr /Applications/AI\ Gallery.app
   ```

### 5. Linux 应用无法运行

**问题**：AppImage 文件无法运行

**解决方案**：
```bash
# 添加执行权限
chmod +x AI\ Gallery.AppImage

# 运行应用
./AI\ Gallery.AppImage
```

## 📦 高级打包选项

### 1. 代码签名（Windows）

对于正式发布的应用，建议进行代码签名：

1. **获取代码签名证书**
   - 从 CA 机构购买（如 DigiCert、Sectigo）
   - 或使用自签名证书（仅用于测试）

2. **配置签名**
   ```json
   {
     "win": {
       "signingHashAlgorithms": ["sha256"],
       "sign": "./sign.js"
     }
   }
   ```

### 2. 自动更新

配置自动更新功能：

```json
{
   "publish": {
     "provider": "github",
     "owner": "your-username",
     "repo": "ai-gallery"
   }
}
```

### 3. 多平台交叉编译

在 Windows 上打包 macOS 应用需要：

1. **安装 macOS 构建工具**（需要 macOS 系统）
2. **或者使用 CI/CD 服务**：
   - GitHub Actions
   - Travis CI
   - CircleCI

## 🧪 测试打包应用

### 功能测试清单

- [ ] 应用能正常启动
- [ ] 界面显示正常
- [ ] 数据加载正常
- [ ] 文件操作功能正常
- [ ] 主题切换正常
- [ ] 快捷键功能正常
- [ ] 窗口大小调整正常
- [ ] 应用能正常关闭

### 性能测试

- 启动时间：应小于 3 秒
- 内存占用：应小于 200MB
- CPU 使用率：空闲时应小于 5%

## 📚 相关资源

- [Electron 官方文档](https://www.electronjs.org/)
- [Electron Builder 文档](https://www.electron.build/)
- [Electron 应用分发指南](https://www.electronjs.org/docs/latest/tutorial/application-distribution)

## 🆘 获取帮助

如果遇到问题：

1. **查看错误日志**：检查控制台输出
2. **搜索问题**：在 GitHub Issues 中搜索类似问题
3. **提交问题**：提供详细的错误信息和系统环境

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。