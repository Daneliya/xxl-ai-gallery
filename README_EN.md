<div align="center">

# AI Gallery (Prompt Gallery)

[**English**](./README_EN.md) | [简体中文](./README.md) | [繁體中文](./README_TW.md)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-47848f?logo=electron)](https://www.electronjs.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()

A static gallery page for showcasing AI-generated artwork and prompts. Supports artwork management, search filtering, and prompt copying. Simply double-click the HTML file to use.

</div>

## ✨ Features

- **Zero Dependencies**: Pure HTML/CSS/JavaScript, no frameworks required
- **Multi-version Support**: JSON version (recommended) and standalone HTML version
- **Local Storage**: Authorize a local folder to store data, everything stays on your machine (Chrome/Edge)
- **Auto Save**: Edits automatically save to data.json
- **Data Separation**: Default data and user data managed separately
- **Multi-image Support**: Each artwork can contain multiple images with navigation
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Theme switching with preference saved
- **Keyboard Shortcuts**: Quick actions with hotkeys

## 📸 Screenshots

![Auth](./docs/images/1_授权auth.png)

![Home](./docs/images/2_首页index.png)

![Add](./docs/images/3_新增add.png)

![Detail](./docs/images/4_详情detail.png)

## 🚀 Quick Start

### Method 1: Using Launch Script (Recommended)

```bash
# Windows
Double-click scripts/start.bat

# macOS / Linux
chmod +x scripts/start.sh
./scripts/start.sh

# Then open http://localhost:8080/gallery-json.html in your browser
```

### Method 2: Manual Start

```bash
# In the project directory
python -m http.server 8080

# Or using Node.js
npx http-server -p 8080

# Then visit http://localhost:8080/gallery-json.html
```

### Method 3: Direct Open (No Server Needed)

Double-click `gallery-standalone.html` to open in browser (some features limited)

## 📁 Directory Structure

```
xxl-ai-gallery/
├── gallery-json.html        # Recommended version (uses data.json, requires HTTP server)
├── gallery-standalone.html  # Single HTML version (double-click to use)
├── data_default.json        # Default sample data (read-only, for initialization)
├── data_default.js          # Default sample data (JS format, for standalone version)
├── data.json                # User artwork data (JSON, auto-created after authorization)
├── main.js                  # Electron main process
├── package.json             # Project configuration
├── images/                  # AI-generated images
├── docs/                    # Documentation
└── scripts/                 # Scripts
```

## 📖 Usage

### Local Folder Authorization

On first open, an authorization dialog appears:

1. **Authorize Folder**: Click to select a folder, all data will be stored there
2. **Skip**: Click "Skip for now", data will only be stored in browser localStorage
3. **Subsequent Visits**: Browser saves authorization state, no re-authorization needed

**Benefits of Authorization**:
- Data stored in your chosen folder, easy to backup or migrate
- Images saved in the same folder
- Data won't be lost when browser cache is cleared

**Note**: Requires Chrome or Edge browser.

### Data Management

The project uses a **dual-file data management** architecture:

- **`data_default.json`**: Default sample data (read-only)
- **`data.json`**: User data file (auto-created after authorization)

### Browse Artworks

- All artworks displayed as card grid
- Click tags to filter
- Search by title, prompt, model, or tags
- Filter by prompt language (Chinese/English)

### Add New Artwork

**Method 1: Page Form (Recommended)**

1. Click the `+` button in the top right
2. Fill in artwork info (title, prompts, tags, etc.)
3. Select image files (multi-select supported)
4. Click "Save"

**Method 2: Edit data.json Manually**

```javascript
{
    "id": 7,
    "images": ["images/your-image.png"],
    "promptEn": "English prompt",
    "promptZh": "Chinese prompt",
    "title": "Artwork Title",
    "tags": ["tag1", "tag2"],
    "model": "Midjourney v6",
    "date": "2026-03-01"
}
```

## ⌨️ Shortcuts

| Shortcut | Function |
|----------|----------|
| `←` / `→` | Previous/Next artwork |
| `Esc` | Close popup |
| `Ctrl+C` | Copy current prompt |
| `Ctrl+Enter` | Save form |

## 🎨 Data Structure

```javascript
{
    "id": 1,                      // Unique identifier
    "images": ["images/1.png"],   // Image paths array
    "promptEn": "English prompt", // English prompt
    "promptZh": "Chinese prompt", // Chinese prompt
    "title": "Artwork Title",     // Title
    "tags": ["tag1", "tag2"],     // Tags array
    "model": "Midjourney v6",     // AI model name
    "date": "2026-03-01"          // Creation date
}
```

## 🌐 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Basic Display | ✅ | ✅ | ✅ | ✅ |
| File System Access API | ✅ | ✅ | ❌ | ❌ |
| Manual Export | ✅ | ✅ | ✅ | ✅ |

> **Tip**: Chrome/Edge users can enjoy auto-save. Other browsers can use manual export.

## 🌐 Cloud Server Deployment

### Important: File System Access API Security Context

`window.showDirectoryPicker` (File System Access API) **requires a secure context** in Chrome/Edge:

| Access Method | localhost | HTTP Remote | HTTPS Remote |
|---------------|-----------|-------------|--------------|
| Chrome | ✅ | ❌ | ✅ |
| Edge | ✅ | ❌ | ✅ |
| Safari | ❌ | ❌ | ❌ |

### Solutions

#### Option 1: Configure HTTPS (Recommended)
- Configure SSL certificate, use HTTPS access
- Full File System Access API support

#### Option 2: Cloudflare Tunnel (No Domain Needed)
```bash
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:8081
```

#### Option 3: Desktop App (Best Solution)
```bash
npm install
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

For more details, see [Deployment Guide](./docs/DEPLOY.md).

## 🖥️ Desktop App Packaging

### Quick Pack (Windows)

1. Double-click `scripts/build.bat`
2. Wait for packaging to complete
3. Find `AI Gallery Setup.exe` in the `dist` directory

### Manual Pack (All Platforms)

```bash
npm install
npm run build        # Current platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### Post-packaging Features

- **Double-click to Run**: No HTTP server needed
- **Full File System Access**: Direct local file read/write
- **Native App Experience**: Native menus, shortcuts, system tray
- **Distributable**: Share the packaged app with others

For more details, see [Build Guide](./docs/BUILD.md).

## 📝 Documentation

- [Technical Research](./docs/TECH_RESEARCH.md) - Data persistence approaches and technical details
- [Installation Guide](./docs/INSTALL.md) - Detailed installation and running instructions
- [Deployment Guide](./docs/DEPLOY.md) - Cloud server deployment and HTTPS configuration

## License

MIT License
