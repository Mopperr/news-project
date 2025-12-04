@echo off
echo ========================================
echo Starting Jerusalem Weather API Server
echo ========================================
echo.

cd /d "%~dp0"

python weather_api.py

pause
