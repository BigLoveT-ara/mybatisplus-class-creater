@echo off
echo ========================================
echo MyBatis-Plus Class Creater - 构建和发布
echo ========================================
echo.

echo [1/4] 清理旧的构建文件...
npm run clean
if %ERRORLEVEL% NEQ 0 (
    echo 错误：清理失败
    exit /b 1
)

echo.
echo [2/4] 构建 TypeScript 项目...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo 错误：构建失败
    exit /b 1
)

echo.
echo [3/4] 测试本地打包...
npm pack
if %ERRORLEVEL% NEQ 0 (
    echo 错误：打包失败
    exit /b 1
)

echo.
echo [4/4] 发布到 npm...
echo 提示：请确保已执行 npm login 登录
echo.
set /p confirm=是否发布到 npm? (y/n):
if /i "%confirm%"=="y" (
    npm publish
    if %ERRORLEVEL% NEQ 0 (
        echo 错误：发布失败
        exit /b 1
    )
    echo.
    echo 发布成功！
) else (
    echo.
    echo 跳过发布，构建完成。
    echo 包文件已生成：mybatisplus-class-creater-*.tgz
    echo.
    echo 手动发布命令：npm publish
    echo 安装测试命令：npm install -g mybatisplus-class-creater-1.0.2.tgz
)

echo.
echo ========================================
echo 完成
echo ========================================
