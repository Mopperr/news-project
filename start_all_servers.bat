@echo off
title VFI Website - All Servers

echo ================================================================
echo              VFI WEBSITE - STARTING ALL SERVERS
echo ================================================================
echo.
echo Starting the following services:
echo   - Web Server (Port 8080)
echo   - News API (Port 5500)
echo   - Weather Updater
echo   - Blog Updater
echo.
echo Press Ctrl+C in any window to stop that server
echo ================================================================
echo.

cd /d "%~dp0"

:: Start Web Server in new window
start "VFI Web Server (Port 8080)" cmd /k "python -m http.server 8080"

:: Wait a bit
timeout /t 2 /nobreak >nul

:: Start News API in new window
start "Israel News API (Port 5500)" cmd /k "python news_scraper.py"

:: Wait a bit
timeout /t 2 /nobreak >nul

:: Start Weather Updater in new window
start "Jerusalem Weather Updater" cmd /k "python weather_updater.py"

:: Wait a bit
timeout /t 2 /nobreak >nul

:: Start Blog Updater in new window
start "VFI Blog Updater" cmd /k "echo 1 | python blog_scraper.py"

echo.
echo ================================================================
echo All servers started!
echo.
echo Website: http://127.0.0.1:8080
echo News API: http://127.0.0.1:5500/api/news
echo.
echo Weather, News, and Blog data will update automatically
echo ================================================================
echo.

pause
