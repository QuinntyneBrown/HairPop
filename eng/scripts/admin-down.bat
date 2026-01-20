@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   HairPop Admin - Stopping Services
echo ============================================
echo.

:: Kill .NET processes on specific ports
echo [1/5] Stopping API Gateway (port 5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo [2/5] Stopping Identity API (port 5200)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5200 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo [3/5] Stopping Braiders API (port 5201)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5201 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo [4/5] Stopping Users API (port 5202)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5202 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo [5/5] Stopping Admin Frontend (port 4201)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4201 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

:: Also kill any node processes running ng serve for admin
taskkill /F /FI "WINDOWTITLE eq AdminFrontend*" > nul 2>&1

echo.
echo ============================================
echo   All services stopped
echo ============================================
echo.

:: Verify ports are free
echo Verifying ports are released...
echo.

netstat -ano | findstr :5000 | findstr LISTENING > nul 2>&1
if %errorlevel% neq 0 (
    echo   [OK] Port 5000 is free
) else (
    echo   [!!] Port 5000 may still be in use
)

netstat -ano | findstr :5200 | findstr LISTENING > nul 2>&1
if %errorlevel% neq 0 (
    echo   [OK] Port 5200 is free
) else (
    echo   [!!] Port 5200 may still be in use
)

netstat -ano | findstr :5201 | findstr LISTENING > nul 2>&1
if %errorlevel% neq 0 (
    echo   [OK] Port 5201 is free
) else (
    echo   [!!] Port 5201 may still be in use
)

netstat -ano | findstr :5202 | findstr LISTENING > nul 2>&1
if %errorlevel% neq 0 (
    echo   [OK] Port 5202 is free
) else (
    echo   [!!] Port 5202 may still be in use
)

netstat -ano | findstr :4201 | findstr LISTENING > nul 2>&1
if %errorlevel% neq 0 (
    echo   [OK] Port 4201 is free
) else (
    echo   [!!] Port 4201 may still be in use
)

echo.
pause
