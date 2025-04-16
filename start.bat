@echo off
chcp 65001 >nul
title 機器人管理腳本

echo ===============================
echo 啟動 Discord 機器人中...
echo ===============================

:: 切換到本腳本所在目錄
cd /d "%~dp0"

:: 檢查 node_modules 是否存在
if not exist node_modules (
    echo 檢測到缺少依賴模組，正在自動安裝...
    npm install
    echo 模組安裝完成。
)

echo ===============================
echo 正在執行主程式 main.js...
echo ===============================
node main.js

echo ===============================
echo 主程式已結束。
pause
