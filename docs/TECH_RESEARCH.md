# 技术调研文档

## 数据持久化方案对比

在实现数据持久化方案时，我们考虑了以下三种技术路线：

| 方案 | 直接保存 | 双击HTML可用 | 浏览器兼容性 | 说明 |
|------|---------|-------------|-------------|------|
| **方案一：data.js + 手动导出** | ❌ | ✅ | 所有浏览器 | 编辑后需手动导出并替换 data.js 文件；当使用 file:// 协议时，fetch 请求会被浏览器安全策略阻止 |
| **方案二：data.js + File System Access API** | ✅ | ✅ | Chrome/Edge | 使用浏览器原生 API 直接读写本地文件，编辑后自动保存 |
| **方案三：data.json + fetch** | ✅ | ❌ | 所有浏览器 | 需要 HTTP 服务器，无法双击 HTML 直接使用；对应 `gallery-json.html` |

### 方案一缺点详解：file:// 协议下 fetch 被阻止

**问题描述**：
当用户直接双击 `gallery.html` 文件（使用 `file://` 协议）打开时，页面中的 `fetch` 请求会被浏览器安全策略阻止。

**技术原因**：
```javascript
// 当使用 file:// 协议时
baseUrl = file:///D:/path/to/gallery.html
fullUrl = file:///D:/path/to/images/default/xxx.png

// 浏览器会阻止 fetch 请求，因为安全策略限制从 file:// 协议发起网络请求
var response = await fetch(fullUrl); // 报错：Failed to fetch
```

**解决方案**：
1. **使用 HTTP 服务器**（推荐）：
   - 运行 `scripts/start.bat` 启动本地服务器
   - 通过 `http://localhost:8080/gallery.html` 访问
   - 或使用其他 HTTP 服务器（如 Python `http.server`、Node.js `http-server`）

2. **使用 File System Access API**（方案二）：
   - 通过 `showDirectoryPicker()` 直接访问本地文件系统
   - 不依赖 `fetch` 请求，绕过 `file://` 协议限制
   - 当前项目已采用此方案

---

## 方案二详情：data.js + File System Access API（当前采用）

### 技术原理

- 使用浏览器的 `showOpenFilePicker()` 和 `FileSystemWritableFileStream` API
- 首次使用时让用户选择 data.js 文件，文件句柄通过 `indexedDB` 持久化存储
- 每次新增/编辑/删除数据后，自动将完整数据重写写入 data.js

### 工作流程

1. 页面加载时检查是否有持久化的文件句柄
2. 若无，显示"选择数据文件"按钮让用户选择 data.js
3. 文件句柄存储到 indexedDB，刷新页面不丢失
4. 数据变更时自动写入文件，无需手动导出

### 优点

- ✅ 编辑后自动保存到 data.js，零手动操作
- ✅ 保持双击 HTML 即可使用的特性
- ✅ 文件句柄持久化，一次选择永久生效
- ✅ 与现有图片保存功能（showDirectoryPicker）技术统一

### 限制

- ⚠️ 仅支持 Chrome/Edge（Safari/Firefox 不支持 File System Access API）
- ⚠️ 首次使用需要用户授权选择文件
- ⚠️ **需要安全上下文**：File System Access API 在 Chrome/Edge 中必须通过 HTTPS 或 localhost 访问，通过 HTTP 访问远程服务器时功能受限

### 兼容性处理

对于不支持 File System Access API 的浏览器，保留手动导出功能作为降级方案

---

## 技术栈

- **前端**：纯 HTML/CSS/JavaScript，无框架依赖
- **存储**：
  - localStorage（浏览器本地持久化）
  - File System Access API（直接读写本地文件）
  - IndexedDB（文件句柄持久化）
- **图片管理**：showDirectoryPicker API（自动保存图片到目录）

---

## 文件版本说明

项目提供三个 HTML 文件，对应不同的使用场景：

| 文件 | 方案 | 使用方式 | 数据格式 | 图片加载 |
|------|------|---------|----------|----------|
| `gallery.html` | 方案二 | 双击打开或 HTTP 服务器 | data.js（File System Access API） | 从授权目录读取 |
| `gallery-standalone.html` | 方案二 | 双击打开 | data.js（File System Access API） | 从授权目录读取 |
| `gallery-json.html` | 方案三 | HTTP 服务器 | data.json（fetch） | HTTP 路径 |

### 使用建议

1. **日常使用**：推荐 `gallery.html`，支持双击打开，数据自动保存
2. **服务器部署**：推荐 `gallery-json.html`，兼容性最好，支持所有浏览器
3. **单文件分发**：推荐 `gallery-standalone.html`，与 `gallery.html` 功能相同

---

---

## 技术实现细节

### 1. 文件系统 API (File System Access API)

#### 核心功能
- **目录选择器**：使用 `window.showDirectoryPicker({ mode: 'readwrite' })` 让用户选择本地文件夹
- **文件操作**：
  - `getFileHandle()`：获取文件句柄（支持 `{ create: true }` 创建新文件）
  - `getDirectoryHandle()`：获取目录句柄（支持创建子目录）
  - `createWritable()`：创建可写流用于写入文件
  - `removeEntry()`：删除文件或目录
- **权限管理**：
  - `queryPermission()`：检查目录访问权限
  - 将目录句柄存储在 IndexedDB 中以持久化访问权限

#### 安全上下文要求
File System Access API 在 Chrome/Edge 中**必须在安全上下文下才能使用**：

| 访问方式 | localhost | HTTP 远程 | HTTPS 远程 |
|---------|-----------|-----------|------------|
| Chrome  | ✅ | ❌ | ✅ |
| Edge    | ✅ | ❌ | ✅ |
| Safari  | ❌ | ❌ | ❌ |

**解决方案**：
1. **配置 HTTPS**（推荐）
2. **使用 Cloudflare Tunnel**（无需域名）
3. **打包成桌面应用**（Electron）
4. **使用 localhost 访问**

详细部署指南请参考 [云服务器部署指南](./DEPLOY.md)。

#### 关键代码示例
```javascript
// 选择目录
const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
await storeDirectoryHandle(dirHandle);

// 写入文件
const fileHandle = await directoryHandle.getFileHandle('data.json', { create: true });
const writable = await fileHandle.createWritable();
await writable.write(JSON.stringify(data, null, 2));
await writable.close();
```

---

### 2. 数据存储机制

#### localStorage
- **用户数据存储**：使用键 `ai_gallery_userdata` 存储用户添加的项目、编辑和删除记录
- **主题偏好**：使用键 `ai_gallery_theme` 存储主题设置
- **数据结构**：
  ```javascript
  var userData = {
      items: [],      // 用户添加的新作品
      edits: {},      // 用户对默认数据的修改（key: id, value: 修改内容）
      deleted: []     // 用户删除的默认数据 id
  };
  ```

#### IndexedDB
- **数据库名称**：`ai_gallery_fs`
- **对象存储**：`file_handles`
- **用途**：持久化存储目录句柄（FileSystemHandle），以便在页面重新加载后恢复文件系统访问权限

#### 数据分离策略
- **默认数据**：只读，来自 `data_default.js`（或 `data_default.json`）
- **用户数据**：可读写，存储在 localStorage 中
- **合并逻辑**：将默认数据与用户修改（edits）、删除（deleted）和新增（items）合并

---

### 3. 图片处理技术

#### FileReader + Base64
```javascript
// 将文件转换为 base64 data URL
const dataUrl = await new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = function() { reject(reader.error); };
    reader.readAsDataURL(file);
});
```

#### Blob URL
- **创建预览**：使用 `URL.createObjectURL(file)` 创建临时 URL 用于图片预览
- **导出功能**：创建 Blob 对象并生成下载链接
- **内存管理**：使用 `URL.revokeObjectURL(url)` 释放内存

#### 图片加载优化
- **懒加载**：使用 `loading="lazy"` 属性
- **错误处理**：`onerror` 事件处理图片加载失败，显示占位符
- **缓存机制**：使用 `imageUrlCache` 对象缓存已转换的 base64 data URL

---

### 4. 事件处理和 DOM 操作

#### 事件监听器
- **点击事件**：按钮、卡片、模态框关闭等
- **输入事件**：搜索框、表单字段变化
- **键盘事件**：快捷键支持（Escape、ArrowLeft/Right、Ctrl+C）
- **文件选择**：`change` 事件处理文件上传
- **生命周期**：`beforeunload` 事件清理对象 URL

#### DOM 操作技术
- **元素选择**：`getElementById()`、`querySelector()`、`querySelectorAll()`
- **内容修改**：`innerHTML`、`textContent`
- **类操作**：`classList.add()`、`classList.remove()`、`classList.toggle()`
- **属性操作**：`setAttribute()`、`getAttribute()`
- **元素创建**：`createElement()` 动态创建元素

#### 动态内容生成
- 使用模板字符串和数组方法生成 HTML 内容
- 事件委托和内联事件处理（`onclick`、`onerror`）

---

### 5. 异步操作和错误处理

#### 异步编程模式
- **async/await**：广泛使用，使异步代码更易读
- **Promise**：用于封装回调式 API（如 FileReader、IndexedDB）
- **Promise 链**：`.then()` 和 `.catch()` 处理异步结果

#### 错误处理策略
- **try/catch 块**：包裹可能出错的代码
- **AbortError 处理**：专门处理用户取消操作（如文件选择器）
- **降级方案**：当 File System Access API 不可用时，回退到 HTTP 路径
- **用户反馈**：使用 `showToast()` 显示错误信息
- **日志记录**：`console.error()`、`console.warn()` 记录详细错误

#### 异步操作示例
```javascript
async function loadDataFromAuthorizedDir(dirHandle) {
    try {
        const fileHandle = await dirHandle.getFileHandle('data.json');
        const file = await fileHandle.getFile();
        const content = await file.text();
        let data = JSON.parse(content);
        // 处理数据...
    } catch (e) {
        console.error('加载数据失败:', e);
        showToast('加载数据失败: ' + e.message);
    }
}
```

---

### 6. 其他重要的技术实现

#### 剪贴板 API
```javascript
navigator.clipboard.writeText(text).then(function() {
    showToast('提示词已复制到剪贴板');
}).catch(function() {
    showToast('复制失败，请手动选择文本');
});
```

#### 主题系统
- 使用 `data-theme` 属性控制主题（light/dark）
- CSS 变量实现主题切换
- 持久化用户主题偏好到 localStorage

#### 响应式设计
- 使用 `@media` 查询适配不同屏幕尺寸
- 移动端友好的布局和交互

#### 键盘快捷键
- Escape：关闭模态框/表单
- 左右箭头：导航图片
- Ctrl+C：复制提示词

#### 数据迁移
- 自动检测并迁移旧格式数据（如从 `images/default/` 迁移到 `images/user/{itemId}/`）
- 统一字段名（如 `prompt` → `promptEn`）

#### 欢迎界面
- 首次使用时显示引导界面
- 提供授权和跳过选项
- 错误状态显示和处理

#### 性能优化
- 图片懒加载
- 对象 URL 缓存
- DOM 操作优化（批量更新、避免重排重绘）
- 内存管理（及时释放对象 URL）

#### 安全考虑
- 文件类型验证（只接受图片文件）
- 权限检查（File System Access API 权限）
- 错误边界处理

---

---

## 桌面应用打包方案

将项目打包成独立的桌面应用程序，无需浏览器即可运行。以下是三种可行的打包方案对比：

### 方案一：Electron（推荐）✅

**优点：**
- 最成熟，文档丰富
- 可以直接使用现有代码，无需修改
- 支持所有平台（Windows/Mac/Linux）
- 可以完全访问文件系统
- 打包过程简单

**缺点：**
- 体积较大（约 100-200MB）
- 内存占用较高

**适用场景：**
- 需要快速打包现有 Web 项目
- 团队熟悉 JavaScript/Node.js
- 需要完整的桌面应用功能

**技术栈：**
- 主进程：Node.js
- 渲染进程：Chromium
- 打包工具：electron-builder

### 方案二：Tauri

**优点：**
- 体积小（约 5-10MB）
- 内存占用低，性能好

**缺点：**
- 需要学习 Rust
- 生态相对较小

**适用场景：**
- 对应用体积和性能有较高要求
- 团队愿意学习 Rust
- 需要更安全的沙箱环境

**技术栈：**
- 后端：Rust
- 前端：系统 WebView（Windows: WebView2, macOS: WKWebView, Linux: WebKitGTK）
- 打包工具：tauri-cli

### 方案三：Wails

**优点：**
- 类似 Tauri，体积小
- 使用 Go 作为后端

**缺点：**
- 需要学习 Go
- 生态相对较小

**适用场景：**
- 团队熟悉 Go 语言
- 需要轻量级桌面应用
- 希望使用 Go 的并发特性

**技术栈：**
- 后端：Go
- 前端：系统 WebView
- 打包工具：wails-cli

### 方案对比总结

| 特性 | Electron | Tauri | Wails |
|------|----------|-------|-------|
| 应用体积 | 大（100-200MB） | 小（5-10MB） | 小（5-10MB） |
| 内存占用 | 高 | 低 | 低 |
| 学习成本 | 低（JavaScript） | 高（Rust） | 中（Go） |
| 跨平台支持 | ✅ 全平台 | ✅ 全平台 | ✅ 全平台 |
| 生态成熟度 | 高 | 中 | 中 |
| 打包复杂度 | 简单 | 中等 | 中等 |

### 推荐选择

**选择 Electron 如果：**
- 需要快速打包现有 Web 项目
- 团队主要使用 JavaScript
- 需要丰富的社区资源和文档

**选择 Tauri 如果：**
- 对应用体积和性能有严格要求
- 团队愿意学习 Rust
- 需要更高的安全性

**选择 Wails 如果：**
- 团队熟悉 Go 语言
- 需要轻量级解决方案
- 希望利用 Go 的并发特性

### 本项目选择

本项目选择 **Electron** 作为打包方案，原因：
1. 现有代码无需修改，直接使用
2. 打包过程简单，只需添加配置文件
3. 文档丰富，社区支持好
4. 支持完整的桌面应用功能

详细打包说明请参考 [打包指南](./BUILD.md)。

---

## 相关 API 参考

- [File System Access API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [FileReader API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Clipboard API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

## 相关文档

- [云服务器部署指南](./DEPLOY.md) - 云服务器部署、HTTPS 配置和 File System Access API 问题解决
