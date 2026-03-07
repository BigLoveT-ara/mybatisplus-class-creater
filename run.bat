@echo off
chcp 65001 >nul
echo ====================================
echo MyBatis-Plus Class Creater
echo ====================================
echo.

if "%1"=="" (
    echo 使用方法:
    echo   run.bat generate ^<输入文件/目录^> [选项]
    echo   run.bat parse ^<Java 文件^>
    echo.
    echo 示例:
    echo   run.bat generate ./examples/User.java -o ./output
    echo   run.bat parse ./examples/User.java
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [1/3] 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
    echo 依赖安装完成
)

if not exist "dist" (
    echo [2/3] 正在构建项目...
    call npm run build
    if errorlevel 1 (
        echo 构建失败！
        pause
        exit /b 1
    )
    echo 构建完成
)

echo [3/3] 正在执行命令...
echo.
node dist\cli.js %*

pause
