# AI Gallery 云服务器部署指南

本指南将帮助你将 AI Gallery 部署到云服务器，并解决 File System Access API 的安全上下文问题。

## 📋 部署前准备

### 1. 理解安全上下文要求

`window.showDirectoryPicker` (File System Access API) 在 Chrome/Edge 中**必须在安全上下文下才能使用**：

- **安全上下文**：`localhost`、`127.0.0.1`、`HTTPS`
- **非安全上下文**：`HTTP`（通过 IP 或域名访问）

**错误现象**：通过 `http://服务器IP:端口` 访问时，会提示"浏览器不支持文件夹选择功能"。

### 2. 选择部署方案

| 方案 | 需要域名 | 复杂度 | 效果 | 适用场景 |
|------|---------|--------|------|----------|
| HTTPS + SSL 证书 | 可选 | 中 | ✅ 完整功能 | 正式部署 |
| Cloudflare Tunnel | ❌ | 低 | ✅ 完整功能 | 快速测试、临时分享 |
| Electron 桌面应用 | ❌ | 低 | ✅ 完整功能 | 本地使用、分发 |
| HTTP 降级模式 | ❌ | 低 | ⚠️ 部分功能 | 仅浏览，不编辑 |

## 🚀 方案一：HTTPS + SSL 证书（推荐）

### 步骤 1：获取 SSL 证书

**选项 A：免费证书（Let's Encrypt）**
```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书并配置 Nginx
sudo certbot --nginx -d your-domain.com
```

**选项 B：自签名证书（仅测试）**
```bash
# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt
```

### 步骤 2：配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /www/sites/xxl-ai-gallery/index;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 步骤 3：上传项目文件

```bash
# 上传项目到服务器
scp -r /path/to/xxl-ai-gallery user@server:/www/sites/

# 设置权限
chmod -R 755 /www/sites/xxl-ai-gallery
```

## 🌐 方案二：Cloudflare Tunnel（无需域名）

### 步骤 1：安装 cloudflared

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/
```

### 步骤 2：启动隧道

```bash
# 在项目目录下启动 HTTP 服务器
cd /www/sites/xxl-ai-gallery
python3 -m http.server 8081 &

# 创建隧道（会生成一个临时 HTTPS 链接）
cloudflared tunnel --url http://localhost:8081
```

### 步骤 3：使用生成的链接

终端会显示类似这样的链接：
```
https://random-name.trycloudflare.com
```

使用这个 HTTPS 链接访问，File System Access API 就能正常工作了。

## 💻 方案三：打包成桌面应用

### 步骤 1：安装依赖

```bash
cd /path/to/xxl-ai-gallery
npm install
```

### 步骤 2：打包应用

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

### 步骤 3：分发应用

打包后的文件位于 `dist` 目录：
- **macOS**: `AI Gallery.dmg`
- **Windows**: `AI Gallery Setup.exe`
- **Linux**: `AI Gallery.AppImage`

## ⚠️ 方案四：HTTP 降级模式

如果不需要文件系统访问功能，可以只使用默认数据浏览：

### 配置 Nginx

```nginx
server {
    listen 8081;
    server_name 127.0.0.1;
    
    root /www/sites/xxl-ai-gallery/index;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 使用说明

1. 访问 `http://服务器IP:8081/gallery-json.html`
2. 点击"跳过授权"使用默认数据
3. 可以浏览作品，但无法编辑保存

## 🔧 常见问题

### 1. 为什么 Chrome 提示"浏览器不支持"？

**原因**：通过 HTTP 访问非 localhost 地址，File System Access API 被浏览器禁用。

**解决**：
- 配置 HTTPS（推荐）
- 使用 Cloudflare Tunnel
- 打包成桌面应用
- 点击"跳过"使用默认数据

### 2. 自签名证书 Chrome 不信任怎么办？

**解决**：
1. 在 Chrome 中访问 `chrome://flags/#allow-insecure-localhost`
2. 启用 "Allow invalid certificates for resources loaded from localhost"
3. 或者使用 Let's Encrypt 免费证书

### 3. 云服务器防火墙配置

确保开放相关端口：
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 4. 项目文件权限问题

```bash
# 设置正确的所有者
sudo chown -R www-data:www-data /www/sites/xxl-ai-gallery

# 设置目录权限
find /www/sites/xxl-ai-gallery -type d -exec chmod 755 {} \;
find /www/sites/xxl-ai-gallery -type f -exec chmod 644 {} \;
```

## 📊 方案对比

| 特性 | HTTPS | Cloudflare Tunnel | 桌面应用 | HTTP 降级 |
|------|-------|-------------------|----------|-----------|
| 文件系统访问 | ✅ | ✅ | ✅ | ❌ |
| 自动保存 | ✅ | ✅ | ✅ | ❌ |
| 编辑功能 | ✅ | ✅ | ✅ | ❌ |
| 需要域名 | 可选 | ❌ | ❌ | ❌ |
| 需要证书 | 是 | 否 | 否 | 否 |
| 部署复杂度 | 中 | 低 | 低 | 低 |

## 🎯 推荐方案

### 个人使用
- **本地开发**：直接 `npm start` 或使用启动脚本
- **分发给他人**：打包成桌面应用

### 团队/公司使用
- **正式部署**：配置 HTTPS + SSL 证书
- **快速测试**：使用 Cloudflare Tunnel

### 临时分享
- **无需安装**：使用 Cloudflare Tunnel
- **离线使用**：打包成桌面应用

## 📚 相关文档

- [README.md](../README.md) - 项目概述和快速开始
- [BUILD.md](./BUILD.md) - 详细打包指南
- [INSTALL.md](./INSTALL.md) - 安装和运行说明
- [TECH_RESEARCH.md](./TECH_RESEARCH.md) - 技术调研文档

## 🆘 获取帮助

如果遇到问题：

1. 查看本文档的常见问题部分
2. 检查浏览器控制台错误信息
3. 确认服务器防火墙配置
4. 验证文件权限设置