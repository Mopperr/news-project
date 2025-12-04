@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting Israel News API Server...
python news_scraper.py

pause
