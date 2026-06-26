# 图标制作指南

本指南将帮助您为 AI Gallery 应用创建不同平台的图标。

## 📋 图标要求

### Windows (.ico)
- **尺寸**: 256x256 像素（包含多种尺寸：16x16, 32x32, 48x48, 64x64, 128x128, 256x256）
- **格式**: ICO
- **颜色**: 支持透明背景

### macOS (.icns)
- **尺寸**: 512x512 像素（包含多种尺寸：16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024）
- **格式**: ICNS
- **颜色**: 支持透明背景

### Linux (.png)
- **尺寸**: 512x512 像素
- **格式**: PNG
- **颜色**: 支持透明背景

## 🎨 创建图标

### 方法一：使用在线工具（推荐）

1. **准备 SVG 图标**
   - 使用 `images/icon.svg` 作为基础
   - 或者使用其他 SVG 编辑工具（如 Inkscape、Adobe Illustrator）

2. **转换为 ICO 格式**
   - 访问 [ICO Convert](https://icoconvert.com/)
   - 上传 SVG 文件
   - 选择尺寸（256x256）
   - 下载 ICO 文件

3. **转换为 ICNS 格式**
   - 访问 [Image2Icon](https://www.img2icnsapp.com/)
   - 上传 SVG 或 PNG 文件
   - 下载 ICNS 文件

4. **转换为 PNG 格式**
   - 使用在线工具或图像编辑软件
   - 调整尺寸为 512x512 像素
   - 保存为 PNG 格式

### 方法二：使用命令行工具

#### 安装 ImageMagick

```bash
# Windows (使用 Chocolatey)
choco install imagemagick

# macOS (使用 Homebrew)
brew install imagemagick

# Linux (Ubuntu/Debian)
sudo apt-get install imagemagick
```

#### 转换图标

```bash
# 将 SVG 转换为不同尺寸的 PNG
convert images/icon.svg -resize 16x16 images/icon-16.png
convert images/icon.svg -resize 32x32 images/icon-32.png
convert images/icon.svg -resize 48x48 images/icon-48.png
convert images/icon.svg -resize 64x64 images/icon-64.png
convert images/icon.svg -resize 128x128 images/icon-128.png
convert images/icon.svg -resize 256x256 images/icon-256.png
convert images/icon.svg -resize 512x512 images/icon-512.png

# 创建 ICO 文件（Windows）
convert images/icon-16.png images/icon-32.png images/icon-48.png images/icon-64.png images/icon-128.png images/icon-256.png images/icon.ico

# 创建 ICNS 文件（macOS）
# 需要使用 iconutil 或第三方工具
```

### 方法三：使用专业软件

#### Adobe Illustrator
1. 打开 SVG 文件
2. 调整画板尺寸
3. 导出为不同格式

#### Inkscape（免费）
1. 打开 SVG 文件
2. 调整画布尺寸
3. 导出为 PNG

#### GIMP（免费）
1. 打开 SVG 文件
2. 调整图像尺寸
3. 导出为不同格式

## 📁 文件放置

将转换后的图标文件放在 `images` 目录中：

```
images/
├── icon.svg          # 源文件（可选）
├── icon.ico          # Windows 图标
├── icon.icns         # macOS 图标
├── icon.png          # Linux 图标（512x512）
└── default/          # 默认图片目录
```

## 🎯 图标设计建议

1. **简洁明了**: 图标应该简单易识别
2. **颜色鲜明**: 使用对比色，确保在不同背景下可见
3. **避免文字**: 图标中的文字在小尺寸下难以辨认
4. **保持一致性**: 所有平台的图标应该保持一致的视觉风格
5. **测试效果**: 在不同尺寸和背景下测试图标效果

## 🔧 常见问题

### 问题：图标在任务栏中显示不清晰
**解决方案**: 确保图标包含多种尺寸，特别是 16x16 和 32x32 像素

### 问题：macOS 图标无法显示
**解决方案**: 确保 ICNS 文件包含所有必需的尺寸

### 问题：Linux 图标不显示
**解决方案**: 确保 PNG 文件是 512x512 像素，且没有透明背景问题

## 📚 相关资源

- [Electron 图标文档](https://www.electronjs.org/docs/latest/tutorial/application-distribution#application-icon)
- [Windows 图标规范](https://learn.microsoft.com/en-us/windows/win32/uxguide/vis-icons)
- [macOS 图标规范](https://developer.apple.com/design/human-interface-guidelines/icons)
- [Linux 图标规范](https://specifications.freedesktop.org/icon-theme-spec/latest/)

## 🎨 示例图标

项目中已包含一个示例 SVG 图标：`images/icon.svg`

您可以：
1. 直接使用这个图标
2. 基于这个图标进行修改
3. 创建全新的图标设计

## 📝 注意事项

1. **版权问题**: 确保您有权使用图标设计
2. **文件大小**: 图标文件应该尽可能小，避免影响应用启动速度
3. **测试**: 在打包前测试图标是否正确显示
4. **备份**: 保留原始设计文件，方便后续修改