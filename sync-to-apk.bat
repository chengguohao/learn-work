@echo off
chcp 65001 >nul
title 同步源码到 APK 项目

echo ========================================
echo  ⚡ 同步源码到 HBuilder APK 项目
echo ========================================
echo.
echo  源: workbuddy\  (PWA 版，一源)
echo  目标: workbuddy\workbuddy\  (APK 版，两配)
echo.
echo  同步文件:
echo    - index.html
echo    - sw.js
echo    - css/style.css
echo    - js/app.js
echo    - js/douyin.js
echo    - js/english.js
echo    - js/supabase.js
echo    - js/xiaohongshu.js
echo    - data/english-3.js
echo.
echo  不同步的文件（APK 专属配置）:
echo    - manifest.json (PWA → APK 格式不同，各自维护)
echo    - icons/ (各有独立图标集)
echo    - img/ (APK 项目专属)
echo    - unpackage/ (构建产物)
echo.

set "SRC=%~dp0"
set "DST=%~dp0workbuddy\"

if not exist "%DST%" (
    echo ❌ 错误：找不到目标目录 %DST%
    pause
    exit /b 1
)

echo  正在复制文件...
echo.

xcopy /Y /Q "%SRC%index.html" "%DST%" >nul 2>&1 && echo    ✓ index.html || echo    ✗ index.html
xcopy /Y /Q "%SRC%sw.js" "%DST%" >nul 2>&1 && echo    ✓ sw.js || echo    ✗ sw.js
xcopy /Y /Q "%SRC%css\style.css" "%DST%css\" >nul 2>&1 && echo    ✓ css/style.css || echo    ✗ css/style.css
xcopy /Y /Q "%SRC%js\app.js" "%DST%js\" >nul 2>&1 && echo    ✓ js/app.js || echo    ✗ js/app.js
xcopy /Y /Q "%SRC%js\douyin.js" "%DST%js\" >nul 2>&1 && echo    ✓ js/douyin.js || echo    ✗ js/douyin.js
xcopy /Y /Q "%SRC%js\english.js" "%DST%js\" >nul 2>&1 && echo    ✓ js/english.js || echo    ✗ js/english.js
xcopy /Y /Q "%SRC%js\supabase.js" "%DST%js\" >nul 2>&1 && echo    ✓ js/supabase.js || echo    ✗ js/supabase.js
xcopy /Y /Q "%SRC%js\xiaohongshu.js" "%DST%js\" >nul 2>&1 && echo    ✓ js/xiaohongshu.js || echo    ✗ js/xiaohongshu.js
xcopy /Y /Q "%SRC%data\english-3.js" "%DST%data\" >nul 2>&1 && echo    ✓ data/english-3.js || echo    ✗ data/english-3.js

echo.
echo ========================================
echo  ✅ 同步完成！可以直接用 HBuilder 打包 APK 了
echo ========================================
echo.
pause
