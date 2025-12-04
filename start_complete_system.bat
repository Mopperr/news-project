@echo off
title VFI News - Complete System

echo ================================================================
echo         VFI NEWS - STARTING COMPLETE SYSTEM
echo ================================================================
echo.
echo Starting the following services:
echo   - News Server (Port 8080)
echo   - Weather Updater (Updates every 10 minutes)
echo.
echo Press Ctrl+C in any window to stop that service
echo ================================================================
echo.

cd /d "%~dp0"

:: Start News Server in new window
start "VFI News Server (Port 8080)" cmd /k "python server.bat"

:: Wait a bit
timeout /t 2 /nobreak >nul

:: Start Weather Updater in new window
start "Jerusalem Weather Updater" cmd /k "python weather_updater.py"

echo.
echo ================================================================
echo All services started!
echo.
echo News Server: http://127.0.0.1:8080
echo Weather Data: weather_data.json (updates every 10 minutes)
echo.
echo Open http://127.0.0.1:8080 in your browser to view the site
echo ================================================================
echo.

pause
