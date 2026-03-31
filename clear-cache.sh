#!/bin/bash
# 清除所有缓存并重启服务

echo "正在清除构建缓存... (≧∇≦) ﾉ"
cd /root/tangyuan-games

# 清除 node_modules/.vite 缓存
rm -rf node_modules/.vite

# 清除 dist 目录
rm -rf dist

# 重新构建
echo "正在重新构建... (｡･ω･｡)"
npm run build

# 重启 PM2 服务
echo "正在重启服务... (^ ̳ට ̫ ට ̳^)"
pm2 restart tangyuan-frontend --update-env
pm2 restart tangyuan-server --update-env

sleep 2

echo ""
echo "完成！请按 Ctrl+Shift+R 强制刷新浏览器喵～ (≧∇≦) ﾉ"
pm2 status
