# 技术调研文档

## 数据持久化方案对比

在实现数据持久化方案时，我们考虑了以下三种技术路线：

| 方案 | 直接保存 | 双击HTML可用 | 浏览器兼容性 | 说明 |
|------|---------|-------------|-------------|------|
| **方案一：data.js + 手动导出** | ❌ | ✅ | 所有浏览器 | 编辑后需手动导出并替换 data.js 文件 |
| **方案二：data.js + File System Access API** | ✅ | ✅ | Chrome/Edge | 使用浏览器原生 API 直接读写本地文件，编辑后自动保存 |
| **方案三：data.json + fetch** | ✅ | ❌ | 所有浏览器 | 需要 HTTP 服务器，无法双击 HTML 直接使用 |

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

## 相关 API 参考

- [File System Access API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
