@echo off
echo ====================================
echo Starting Jerusalem Weather Updater
echo ====================================
echo.
echo Weather will update every 10 minutes
echo Data saved to: weather_data.json
echo.
echo Press Ctrl+C to stop the updater
echo.

REM Start the Python weather updater
python weather_updater.py

pause
