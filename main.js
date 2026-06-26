const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// 保持对窗口对象的全局引用，避免被垃圾回收
let mainWindow

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'images/icon.png'), // 应用图标
    show: false // 先不显示，等加载完成后再显示
  })

  // 加载 gallery-json.html 文件
  mainWindow.loadFile('gallery-json.html')

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 创建应用菜单
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开数据文件',
          accelerator: 'CmdOrCtrl+O',
          click: () => openDataFile()
        },
        {
          label: '导出数据',
          accelerator: 'CmdOrCtrl+S',
          click: () => exportData()
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectall', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forcereload', label: '强制重新加载' },
        { role: 'toggledevtools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetzoom', label: '重置缩放' },
        { role: 'zoomin', label: '放大' },
        { role: 'zoomout', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => showAbout()
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function openDataFile() {
  dialog.showOpenDialog(mainWindow, {
    title: '打开数据文件',
    defaultPath: app.getPath('userData'),
    filters: [
      { name: 'JSON 文件', extensions: ['json'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0]
      // 通知渲染进程加载文件
      mainWindow.webContents.send('load-data-file', filePath)
    }
  })
}

function exportData() {
  dialog.showSaveDialog(mainWindow, {
    title: '导出数据',
    defaultPath: path.join(app.getPath('desktop'), 'ai-gallery-data.json'),
    filters: [
      { name: 'JSON 文件', extensions: ['json'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      // 通知渲染进程导出数据
      mainWindow.webContents.send('export-data', result.filePath)
    }
  })
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '关于 AI Gallery',
    message: 'AI 绘画作品集 (Prompt Gallery)',
    detail: '一个用于展示 AI 绘画作品及其提示词的静态画廊页面。\n\n版本：1.0.0\n作者：XXL\n许可证：MIT',
    buttons: ['确定']
  })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow)

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // 在 macOS 上，应用和菜单栏通常会保持活跃，直到用户使用 Cmd + Q 退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在 macOS 上，当点击 dock 图标且没有其他窗口打开时，通常会重新创建一个窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 在这个文件中，你可以包含应用程序的其余主进程代码
// 你也可以将它们放在单独的文件中，然后在这里导入