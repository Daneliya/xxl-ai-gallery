@echo off
chcp 65001 >nul
echo.
echo   ✦ AI 绘画作品集 - 本地预览 ✦
echo   ────────────────────────────────
echo.
echo   启动本地服务器...
echo   浏览器打开 http://localhost:8080/gallery.html
echo   按 Ctrl+C 停止服务器
echo.
cd /d "%~dp0"
python -m http.server 8080
pause
