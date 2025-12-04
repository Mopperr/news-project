@echo off
echo Starting VFI News Services...
echo.
echo Starting News Scraper on port 8080...
start "News Scraper" cmd /k python news_scraper.py
timeout /t 2 /nobreak > nul

echo Starting YouTube Fetcher on port 8081...
start "YouTube Fetcher" cmd /k python youtube_fetcher.py
timeout /t 2 /nobreak > nul

echo.
echo Services started!
echo - News Scraper: http://127.0.0.1:8080/api/news
echo - YouTube Videos: http://127.0.0.1:8081/api/youtube/videos
echo.
echo Press any key to open the website...
pause > nul

start http://127.0.0.1:5500/index.html
