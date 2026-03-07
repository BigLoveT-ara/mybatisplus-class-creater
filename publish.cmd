@echo off
chcp 65001 >nul
echo ========================================
echo MyBatis-Plus Class Creater - Build & Push to Git
echo ========================================
echo.

echo [1/4] Cleaning dist folder...
call npm run clean
if %ERRORLEVEL% NEQ 0 (
    echo Error: Clean failed
    exit /b 1
)

echo.
echo [2/4] Building TypeScript project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed
    exit /b 1
)

echo.
echo [3/4] Adding dist files to git...
git add dist/
git add -u
git commit -m "build: update dist files"
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git commit failed (or no changes to commit)
)

echo.
echo [4/4] Pushing to GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git push failed
    exit /b 1
)

echo.
echo ========================================
echo Push completed successfully!
echo ========================================
echo.
echo Install command for users:
echo   npm install -g https://github.com/BigLoveT-ara/mybatisplus-class-creater/archive/refs/heads/main.tar.gz
echo.
