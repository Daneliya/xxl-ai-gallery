# AI Gallery 安装与运行指南

本指南将帮助您安装和运行 AI Gallery 应用程序。

## 📋 系统要求

### 桌面应用版本（Electron）

- **操作系统**：
  - Windows 10/11（64位）
  - macOS 10.15 或更高版本
  - Linux（Ubuntu 18.04+、Debian 10+、Fedora 32+ 等）

- **硬件要求**：
  - 处理器：Intel Core i3 或同等性能
  - 内存：4GB RAM（推荐 8GB）
  - 存储空间：500MB 可用空间

### 网页版本

- **浏览器**：
  - Chrome 80+（推荐）
  - Edge 80+
  - Firefox 70+
  - Safari 13+

- **功能限制**：
  - File System Access API 仅支持 Chrome/Edge
  - 其他浏览器需使用手动导出功能
  - **重要**：File System Access API 需要安全上下文（HTTPS 或 localhost），通过 HTTP 访问远程服务器时功能受限

## 🚀 安装方式

### 方式一：下载预编译版本（推荐）

1. 访问 [GitHub Releases](https://github.com/your-username/xxl-ai-gallery/releases) 页面
2. 下载适合您操作系统的安装包：
   - Windows: `AI Gallery Setup.exe`
   - macOS: `AI Gallery.dmg`
   - Linux: `AI Gallery.AppImage`

3. 运行安装程序：
   - **Windows**: 双击 `.exe` 文件，按提示安装
   - **macOS**: 打开 `.dmg` 文件，将应用拖到 Applications 文件夹
   - **Linux**: 给 `.AppImage` 文件添加执行权限，然后运行

### 方式二：从源码构建

#### 前提条件

1. **安装 Node.js**
   - 访问 https://nodejs.org/
   - 下载并安装 LTS 版本（推荐 18.x 或 20.x）
   - 验证安装：
     ```bash
     node --version
     npm --version
     ```

2. **安装 Git**（可选）
   - 访问 https://git-scm.com/
   - 下载并安装

#### 构建步骤

1. **克隆或下载项目**
   ```bash
   # 使用 Git 克隆
   git clone https://github.com/your-username/xxl-ai-gallery.git
   cd xxl-ai-gallery
   
   # 或者直接下载 ZIP 文件并解压
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **运行应用**
   ```bash
   # 开发模式运行
   npm start
   ```

4. **打包应用**
   ```bash
   # 打包当前平台版本
   npm run build
   
   # 或者使用 Windows 批处理脚本
   scripts/build.bat
   ```

### 方式三：直接使用网页版本

1. **使用启动脚本**（Windows）
   - 双击 `scripts/start.bat`
   - 浏览器打开 http://localhost:8080/gallery-json.html

2. **手动启动 HTTP 服务器**
   ```bash
   # 使用 Python
   python -m http.server 8080
   
   # 使用 Node.js
   npx http-server -p 8080
   ```

3. **直接打开单 HTML 版本**
   - 双击 `gallery-standalone.html` 文件
   - 部分功能受限（无法自动保存）

> **重要**：File System Access API（自动保存功能）需要安全上下文（HTTPS 或 localhost）。如果通过 HTTP 访问远程服务器，功能会受限。详细部署信息请参考 [云服务器部署指南](./DEPLOY.md)。

## ⚙️ 配置说明

### 数据存储位置

#### 桌面应用版本

- **Windows**: `%APPDATA%/xxl-ai-gallery/`
- **macOS**: `~/Library/Application Support/xxl-ai-gallery/`
- **Linux**: `~/.config/xxl-ai-gallery/`

#### 网页版本

- **授权模式**: 数据存储在您选择的本地文件夹中
- **非授权模式**: 数据存储在浏览器 localStorage 中

### 配置文件

应用会自动创建以下配置文件：

- `data.json`: 用户数据文件
- `config.json`: 应用配置（主题、语言等）

## 🔧 常见问题与解决方案

### 1. 应用无法启动

**问题**: 双击应用图标后没有反应

**解决方案**:
- 检查系统是否满足最低要求
- 以管理员身份运行（Windows）
- 检查杀毒软件是否阻止应用运行
- 查看错误日志（如果有）

### 2. File System Access API 不可用

**问题**: 提示"浏览器不支持文件夹选择功能"，但使用的是 Chrome/Edge

**解决方案**:
- **检查访问方式**：通过 `http://服务器IP:端口` 访问时，File System Access API 被浏览器禁用
- **配置 HTTPS**（推荐）：配置 SSL 证书，使用 HTTPS 访问
- **使用 Cloudflare Tunnel**：无需域名，创建免费 HTTPS 链接
- **打包成桌面应用**：使用 Electron 打包，完整功能可用
- **使用 localhost**：通过 `http://localhost:端口` 访问（仅本地开发）

详细部署指南请参考 [云服务器部署指南](./DEPLOY.md)。

### 2. 数据丢失

**问题**: 之前添加的数据不见了

**解决方案**:
- 检查数据文件是否存在（`data.json`）
- 检查浏览器 localStorage（网页版本）
- 从备份恢复数据（如果有）

### 3. 图片无法显示

**问题**: 图片显示为空白或占位符

**解决方案**:
- 检查图片文件是否存在
- 检查图片路径是否正确
- 重新导入图片

### 4. 保存失败

**问题**: 无法保存数据或设置

**解决方案**:
- 检查文件权限
- 检查磁盘空间
- 尝试以管理员身份运行

### 5. 性能问题

**问题**: 应用运行缓慢或卡顿

**解决方案**:
- 关闭其他占用资源的应用
- 减少同时显示的图片数量
- 清理浏览器缓存（网页版本）
- 增加系统内存

## 📦 卸载说明

### 桌面应用版本

#### Windows
1. 通过控制面板卸载
2. 删除数据目录：`%APPDATA%/xxl-ai-gallery/`

#### macOS
1. 将应用从 Applications 文件夹移到废纸篓
2. 删除数据目录：`~/Library/Application Support/xxl-ai-gallery/`

#### Linux
1. 删除 AppImage 文件
2. 删除数据目录：`~/.config/xxl-ai-gallery/`

### 网页版本
1. 删除项目文件夹
2. 清除浏览器 localStorage（如果使用非授权模式）

## 🔄 更新说明

### 桌面应用版本

1. 下载最新版本
2. 覆盖安装（数据会自动保留）
3. 或者导出数据后全新安装

### 网页版本

1. 下载最新版本
2. 替换项目文件
3. 数据文件（`data.json`）会自动保留

## 🆘 获取帮助

### 文档资源

- [README.md](../README.md) - 项目概述和快速开始
- [BUILD.md](./BUILD.md) - 详细打包指南
- [TECH_RESEARCH.md](./TECH_RESEARCH.md) - 技术调研文档
- [DEPLOY.md](./DEPLOY.md) - 云服务器部署指南

### 问题反馈

如果遇到问题，请：

1. 查看本文档的常见问题部分
2. 搜索 GitHub Issues 中的类似问题
3. 提交新的 Issue，包含以下信息：
   - 操作系统版本
   - 应用版本
   - 详细错误描述
   - 复现步骤
   - 截图（如果适用）

### 社区支持

- GitHub Discussions: [链接]
- 邮箱：[your-email@example.com]

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！