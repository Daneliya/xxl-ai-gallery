#!/bin/bash

echo "========================================"
echo "   AI Gallery 本地预览服务器"
echo "========================================"
echo ""
echo "正在启动本地服务器..."
echo ""
echo "可用版本:"
echo "  1. http://localhost:8080/gallery-json.html  [推荐]"
echo "  2. http://localhost:8080/gallery-standalone.html  [单HTML版]"
echo ""
echo "重要提示:"
echo "  - 请使用 Chrome 或 Edge 浏览器访问"
echo "  - 首次使用时需要授权本地文件夹"
echo "  - 按 Ctrl+C 停止服务器"
echo ""
echo "========================================"

# 切换到项目根目录（scripts 的上级目录）
cd "$(dirname "$0")/.."

# 启动 HTTP 服务器
python3 -m http.server 8080
