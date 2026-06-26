# AI Gallery 快速开始指南

本指南将帮助您快速开始使用 AI Gallery 应用程序。

## 🚀 5 分钟快速开始

### 方式一：使用预编译版本（最简单）

1. **下载应用**
   - 访问 [GitHub Releases](https://github.com/your-username/xxl-ai-gallery/releases)
   - 下载适合您操作系统的安装包

2. **安装应用**
   - Windows: 双击 `AI Gallery Setup.exe`
   - macOS: 打开 `.dmg` 文件，拖到 Applications
   - Linux: 给 `.AppImage` 文件添加执行权限

3. **启动应用**
   - 双击应用图标启动
   - 开始使用！

### 方式二：从源码运行

#### 前提条件
- Node.js 16+（下载地址：https://nodejs.org/）

#### 步骤

1. **下载项目**
   ```bash
   # 克隆项目
   git clone https://github.com/your-username/xxl-ai-gallery.git
   cd xxl-ai-gallery
   
   # 或者下载 ZIP 文件并解压
   ```

2. **安装依赖**
   ```bash
   # Windows 用户可以双击 scripts/test.bat
   npm install
   ```

   > **注意**：如果脚本中出现中文乱码，请确保使用 Windows PowerShell 或 CMD 运行，脚本已设置 UTF-8 编码。

3. **运行应用**
   ```bash
   # 开发模式运行
   npm start
   ```

4. **打包应用**（可选）
   ```bash
   # 打包当前平台版本
   npm run build
   
   # 或者使用 Windows 批处理脚本
   scripts/build.bat
   ```

### 方式三：使用网页版本

1. **启动 HTTP 服务器**
   ```bash
   # 使用 Python
   python -m http.server 8080
   
   # 或者使用 Node.js
   npx http-server -p 8080
   ```

2. **访问应用**
   - 打开浏览器访问：http://localhost:8080/gallery-json.html

## 🎯 主要功能

### 1. 查看作品
- 浏览所有 AI 绘画作品
- 按标签筛选作品
- 搜索标题、提示词、模型或标签

### 2. 查看详情
- 点击作品卡片查看大图
- 查看完整提示词
- 一键复制提示词

### 3. 添加新作品
- 点击右上角 `+` 按钮
- 填写作品信息
- 选择图片文件
- 保存作品

### 4. 管理作品
- 编辑作品信息
- 删除作品
- 导出数据

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `←` / `→` | 切换上/下一个作品 |
| `Esc` | 关闭弹窗 |
| `Ctrl+C` | 复制当前提示词 |
| `Ctrl+Enter` | 保存表单 |

## 🎨 主题切换

- 支持深色/浅色主题
- 自动保存主题偏好
- 点击右上角主题切换按钮

## 📁 数据管理

### 数据存储位置

#### 桌面应用版本
- **Windows**: `%APPDATA%/xxl-ai-gallery/`
- **macOS**: `~/Library/Application Support/xxl-ai-gallery/`
- **Linux**: `~/.config/xxl-ai-gallery/`

#### 网页版本
- **授权模式**: 数据存储在您选择的本地文件夹中
- **非授权模式**: 数据存储在浏览器 localStorage 中

### 数据备份

1. **导出数据**
   - 点击顶部 💾 按钮
   - 导出当前所有数据为 `data.json` 文件

2. **导入数据**
   - 使用"打开数据文件"功能
   - 选择之前导出的 `data.json` 文件

## 🔧 常见问题

### 问题：应用无法启动
**解决方案**：
- 检查系统是否满足要求
- 以管理员身份运行（Windows）
- 检查杀毒软件是否阻止

### 问题：数据丢失
**解决方案**：
- 检查数据文件是否存在
- 从备份恢复数据
- 检查浏览器 localStorage

### 问题：图片无法显示
**解决方案**：
- 检查图片文件是否存在
- 检查图片路径是否正确
- 重新导入图片

## 📚 更多资源

- [完整文档](./README.md) - 项目概述和详细说明
- [安装指南](./INSTALL.md) - 详细安装说明
- [打包指南](./BUILD.md) - 如何打包成桌面应用
- [图标制作](./ICONS.md) - 如何创建应用图标
- [技术调研](./TECH_RESEARCH.md) - 技术细节和方案对比

## 🆘 获取帮助

### 文档资源
- 查看上述文档获取详细信息
- 搜索 GitHub Issues 中的类似问题

### 问题反馈
如果遇到问题，请：
1. 查看本文档的常见问题部分
2. 搜索 GitHub Issues
3. 提交新的 Issue，包含详细信息

### 社区支持
- GitHub Discussions: [链接]
- 邮箱：[your-email@example.com]

## 🎉 开始使用

现在您已经了解了基本使用方法，可以开始使用 AI Gallery 了！

1. **浏览作品**：查看所有 AI 绘画作品
2. **添加作品**：添加您自己的 AI 绘画作品
3. **分享作品**：导出数据分享给朋友
4. **探索功能**：发现更多实用功能

祝您使用愉快！