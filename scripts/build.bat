@echo off
chcp 65001 >nul
echo ========================================
echo    AI Gallery Electron 打包脚本
echo ========================================
echo.

echo [1/3] 切换到项目根目录...
cd /d "%~dp0"
cd ..
echo 当前目录: %CD%
echo.

echo [2/3] 设置国内镜像源...
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
echo 已设置 Electron 镜像
echo.

echo [3/3] 开始打包（禁用代码签名）...
echo 正在构建 Windows 版本...
echo 这可能需要几分钟时间，请耐心等待...
echo.
npm run build:win
echo.

if exist "dist" (
    echo ========================================
    echo    打包完成！
    echo ========================================
    echo.
    echo 应用已打包到 dist 目录
    echo 安装程序: dist\AI Gallery Setup.exe
    echo.
    echo 您可以:
    echo 1. 运行安装程序安装应用
    echo 2. 将 dist 目录分享给其他人
) else (
    echo ========================================
    echo    打包失败
    echo ========================================
    echo.
    echo 未找到 dist 目录
    echo 请检查上面的错误信息
)
echo.
pause