@echo off
setlocal enabledelayedexpansion

:: Get the root directory (two levels up from eng/scripts)
set "ROOT_DIR=%~dp0..\.."
pushd "%ROOT_DIR%"
set "ROOT_DIR=%CD%"
popd

echo ============================================
echo   HairPop Admin - Starting Services
echo ============================================
echo.

:: Create a directory for logs
if not exist "%ROOT_DIR%\logs" mkdir "%ROOT_DIR%\logs"

:: Start API Gateway (port 5000)
echo [1/5] Starting API Gateway (port 5000)...
cd /d "%ROOT_DIR%\src\ApiGateway"
start /B "ApiGateway" cmd /c "dotnet run --urls=http://localhost:5000 > "%ROOT_DIR%\logs\apigateway.log" 2>&1"
timeout /t 2 /nobreak > nul

:: Start Identity API (port 5200)
echo [2/5] Starting Identity API (port 5200)...
cd /d "%ROOT_DIR%\src\Identity\Identity.Api"
start /B "IdentityApi" cmd /c "dotnet run --urls=http://localhost:5200 > "%ROOT_DIR%\logs\identity.log" 2>&1"
timeout /t 2 /nobreak > nul

:: Start Braiders API (port 5201)
echo [3/5] Starting Braiders API (port 5201)...
cd /d "%ROOT_DIR%\src\Braiders\Braiders.Api"
start /B "BraidersApi" cmd /c "dotnet run --urls=http://localhost:5201 > "%ROOT_DIR%\logs\braiders.log" 2>&1"
timeout /t 2 /nobreak > nul

:: Start Users API (port 5202)
echo [4/5] Starting Users API (port 5202)...
cd /d "%ROOT_DIR%\src\Users\Users.Api"
start /B "UsersApi" cmd /c "dotnet run --urls=http://localhost:5202 > "%ROOT_DIR%\logs\users.log" 2>&1"
timeout /t 2 /nobreak > nul

:: Build admin-components library and start Admin Frontend (port 4201)
echo [5/5] Starting Admin Frontend (port 4201)...
cd /d "%ROOT_DIR%\src\WebApp"
echo       Building admin-components library...
call npx ng build admin-components > "%ROOT_DIR%\logs\admin-components-build.log" 2>&1
echo       Starting Angular dev server...
start /B "AdminFrontend" cmd /c "npm run start:admin -- --port 4201 > "%ROOT_DIR%\logs\admin-frontend.log" 2>&1"

echo.
echo ============================================
echo   All services starting...
echo ============================================
echo.
echo   Backend Services:
echo     - API Gateway:    http://localhost:5000
echo     - Identity API:   http://localhost:5200
echo     - Braiders API:   http://localhost:5201
echo     - Users API:      http://localhost:5202
echo.
echo   Frontend:
echo     - Admin App:      http://localhost:4201
echo.
echo   Logs are available in: %ROOT_DIR%\logs\
echo.
echo   Use admin-down.bat to stop all services
echo ============================================
echo.

:: Wait for services to be ready
echo Waiting for services to initialize...
timeout /t 10 /nobreak > nul

:: Check if services are running
echo.
echo Checking service health...
echo.

curl -s http://localhost:5000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] API Gateway is running
) else (
    echo   [--] API Gateway is starting...
)

curl -s http://localhost:5200/health > nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Identity API is running
) else (
    echo   [--] Identity API is starting...
)

curl -s http://localhost:5201/health > nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Braiders API is running
) else (
    echo   [--] Braiders API is starting...
)

curl -s http://localhost:5202/health > nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Users API is running
) else (
    echo   [--] Users API is starting...
)

echo.
echo Press any key to exit (services will continue running)...
pause > nul
