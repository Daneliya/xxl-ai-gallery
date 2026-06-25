# AI 绘画作品集 (Prompt Gallery)

用来展示 AI 绘画作品及其提示词的静态画廊页面。

## 快速开始

1. 双击 `start.bat` 启动本地服务器
2. 浏览器打开 `http://localhost:8080/gallery.html`

或者手动启动：

```bash
# 在 ai_gallery 目录下
python -m http.server 8080
# 然后访问 http://localhost:8080/gallery.html
```

## 目录结构

```
ai_gallery/
├── gallery.html      # 主页面（画廊展示 + 搜索 + 详情弹窗）
├── data.js           # 作品配置（图片路径、标题、标签、提示词等）
├── data.json         # 作品配置（JSON 格式，备用）
├── start.bat         # Windows 一键启动脚本
└── images/           # 存放 AI 生成的图片
```

## 如何添加新作品

**推荐方式：** 使用页面右上角的 `+` 按钮，通过表单添加作品（支持图片自动保存）。

**手动方式：**

1. 把生成的图片放入 `images/` 目录
2. 在 `data.js` 中添加一条记录：

```javascript
{
    "id": 7,
    "images": ["images/你的图片1.jpg", "images/你的图片2.jpg"],
    "prompt": "你的完整提示词内容",
    "promptLang": "en", // "en" 表示英文，"zh" 表示中文
    "title": "作品标题",
    "tags": ["标签1", "标签2"],
    "model": "Midjourney v6",
    "date": "2026-03-01"
}
```

## 前期技术调研

在实现数据持久化方案时，我们考虑了以下三种技术路线：

| 方案 | 直接保存 | 双击HTML可用 | 浏览器兼容性 | 说明 |
|------|---------|-------------|-------------|------|
| **当前方案：data.js + 手动导出** | ❌ | ✅ | 所有浏览器 | 编辑后需手动导出并替换 data.js 文件 |
| **推荐方案：data.js + File System Access API** | ✅ | ✅ | Chrome/Edge | 使用浏览器原生 API 直接读写本地文件，编辑后自动保存 |
| **备选方案：data.json + fetch** | ✅ | ❌ | 所有浏览器 | 需要 HTTP 服务器，无法双击 HTML 直接使用 |

### 推荐方案详情：data.js + File System Access API

**技术原理：**
- 使用浏览器的 `showOpenFilePicker()` 和 `FileSystemWritableFileStream` API
- 首次使用时让用户选择 data.js 文件，文件句柄通过 `indexedDB` 持久化存储
- 每次新增/编辑/删除数据后，自动将完整数据重写写入 data.js

**工作流程：**
1. 页面加载时检查是否有持久化的文件句柄
2. 若无，显示"选择数据文件"按钮让用户选择 data.js
3. 文件句柄存储到 indexedDB，刷新页面不丢失
4. 数据变更时自动写入文件，无需手动导出

**优点：**
- ✅ 编辑后自动保存到 data.js，零手动操作
- ✅ 保持双击 HTML 即可使用的特性
- ✅ 文件句柄持久化，一次选择永久生效
- ✅ 与现有图片保存功能（showDirectoryPicker）技术统一

**限制：**
- ⚠️ 仅支持 Chrome/Edge（Safari/Firefox 不支持 File System Access API）
- ⚠️ 首次使用需要用户授权选择文件

**兼容性处理：**
- 对于不支持 File System Access API 的浏览器，保留手动导出功能作为降级方案

## 功能说明

- 瀑布流网格展示所有作品
- 按标签筛选
- 按提示词语言筛选（中文/英文）
- 关键词搜索（标题、提示词、模型、标签）
- 点击卡片查看大图和完整提示词
- 多图作品支持图片切换导航
- 一键复制提示词
- 键盘快捷键：← → 切换作品，Esc 关闭，Ctrl+C 复制提示词
- 响应式布局，适配手机端
- 支持新增、编辑、删除作品
- 数据本地持久化（localStorage）
- 支持 File System Access API，可直接保存到 data.js 文件（Chrome/Edge）

## 数据结构

每个作品的数据结构如下：

```javascript
{
    "id": 1,                    // 唯一标识符
    "images": ["images/1.png"], // 图片路径数组（支持多图）
    "prompt": "提示词内容",       // 直接存储的提示词
    "promptLang": "en",         // 提示词语言："en" 英文，"zh" 中文
    "title": "作品标题",         // 作品标题
    "tags": ["标签1", "标签2"],  // 标签数组
    "model": "Midjourney v6",   // AI 模型名称
    "date": "2025-12-15"        // 创作日期
}
```