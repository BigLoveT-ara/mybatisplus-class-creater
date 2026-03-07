@echo off
chcp 65001 >nul
echo ========================================
echo MyBatis-Plus Class Creater - Build & Publish
echo ========================================
echo.

echo [1/3] Cleaning dist folder...
call npm run clean
if %ERRORLEVEL% NEQ 0 (
    echo Error: Clean failed
    exit /b 1
)

echo.
echo [2/3] Building TypeScript project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed
    exit /b 1
)

echo.
echo [3/3] Packing package...
call npm pack
if %ERRORLEVEL% NEQ 0 (
    echo Error: Pack failed
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Package file: mybatisplus-class-creater-*.tgz
echo.
echo To publish to npm, run: npm publish
echo To install locally, run: npm install -g mybatisplus-class-creater-1.0.2.tgz
echo.
