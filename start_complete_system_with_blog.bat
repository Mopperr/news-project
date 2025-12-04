@echo off
title Complete VFI News System
echo ================================================
echo    VFI NEWS - COMPLETE SYSTEM LAUNCHER
echo ================================================
echo.
echo Starting all services...
echo.

REM Start Python HTTP Server for the website
echo [1/3] Starting Web Server on http://127.0.0.1:8080...
start "VFI Web Server" cmd /k "cd /d "%~dp0" && python -m http.server 8080"
timeout /t 2 /nobreak >nul

REM Start Weather Updater
echo [2/3] Starting Weather Updater...
start "Weather Updater" cmd /k "cd /d "%~dp0" && echo 1 | python weather_updater.py"
timeout /t 2 /nobreak >nul

REM Start Blog Scraper
echo [3/3] Starting Blog Scraper...
start "Blog Scraper" cmd /k "cd /d "%~dp0" && echo 1 | python blog_scraper.py"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    ALL SERVICES STARTED!
echo ================================================
echo.
echo Web Server:      http://127.0.0.1:8080
echo Weather Updates: Every 10 minutes
echo Blog Updates:    Every hour
echo.
echo Press any key to open the website...
pause >nul

start http://127.0.0.1:8080
