@echo off
chcp 65001 >nul
echo ========================================
echo    AI Gallery Electron 测试脚本
echo ========================================
echo.

echo [1/4] 检查 Node.js 环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js 版本: 
node --version

echo.
echo [2/4] 切换到项目根目录...
cd /d "%~dp0"
cd ..
echo 当前目录: %CD%

echo.
echo [3/4] 安装项目依赖...
echo 这可能需要几分钟时间，请耐心等待...
npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [3/3] 启动 Electron 应用...
echo 应用启动后，您可以:
echo 1. 测试所有功能是否正常
echo 2. 按 Ctrl+C 停止应用
echo 3. 关闭应用窗口
echo.
echo 正在启动应用...
npm start

echo.
echo 应用已关闭
pause