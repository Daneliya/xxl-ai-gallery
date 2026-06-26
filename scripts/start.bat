@echo off
chcp 65001 >nul
echo.
echo   [AI Gallery] AI 作品集本地预览
echo   ================================
echo.
echo   作者: 程序员小龙
echo   GitHub: https://github.com/Daneliya
echo.
echo   启动本地服务器...
echo.
echo   可用版本:
echo     1. http://localhost:8080/gallery-json.html  [推荐]
echo     2. http://localhost:8080/gallery-standalone.html  [单HTML版]
echo.
echo   按 Ctrl+C 停止服务器
echo.
cd /d "%~dp0"
cd ..
python -m http.server 8080
pause
