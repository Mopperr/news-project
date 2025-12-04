# How to Run VFI Website

## Option 1: Using the Batch File (Recommended)
Simply double-click `start_all_servers.bat` which will start:
- Web Server on port 8080
- News API on port 5500
- Weather Updater
- Blog Updater

Then open: **http://127.0.0.1:8080** in your browser

## Option 2: Using VS Code Live Server
If you prefer to use Live Server in VS Code:

1. First, start the backend APIs manually:
   ```
   python news_scraper.py
   ```
   (This runs on port 5500)

2. Then right-click `index.html` and select "Open with Live Server"
   - Live Server will open on port 5050 or 5500 (whatever is available)
   - The page will automatically connect to the news API on port 5500

## Important Notes:
- The News API must be running on port 5500 for articles to load
- Weather data comes from local files updated by weather_updater.py
- Blog articles come from vfi_blog_catalog.json
- All APIs have CORS enabled so they work from any port

## Troubleshooting:
- If news doesn't load, make sure `news_scraper.py` is running
- If you see CORS errors, ensure all Python servers are running
- If port 5500 is busy, edit `news_scraper.py` line 282 to use a different port and update `index.js` line 6 accordingly
