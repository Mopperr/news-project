# Israel Up to Date News Website

A news aggregation website that displays the latest Israel news from trusted sources and YouTube videos.

## Features
- 📰 Real-time news from trusted Israeli news sources (Times of Israel, Jerusalem Post, i24News, etc.)
- 🎥 Latest YouTube videos from Vision For Israel channel
- 🔍 Search functionality
- 📱 Fully responsive design
- 🚫 No API quota limits (uses RSS feeds)

## Setup Instructions

### Step 1: Install Python
Make sure you have Python 3.7+ installed. You can download it from [python.org](https://www.python.org/downloads/)

### Step 2: Install Dependencies
Double-click `start_server.bat` - this will:
1. Install all required Python packages
2. Start the local news server

**OR** manually run:
```bash
pip install -r requirements.txt
python news_scraper.py
```

### Step 3: Open Website
Once the server is running (you'll see "Running on http://127.0.0.1:5000"), open `index.html` in your web browser.

## Files Overview

- `index.html` - Main website page
- `styles.css` - Website styling
- `index.js` - Frontend JavaScript logic
- `news_scraper.py` - Python backend that scrapes news from RSS feeds
- `requirements.txt` - Python dependencies
- `start_server.bat` - Easy server startup script

## Trusted News Sources

The website aggregates news from:
- Times of Israel
- Jerusalem Post
- Haaretz
- i24News
- Ynet News

## Configuration

In `index.js`, you can switch between local scraper and Currents API:
```javascript
const USE_LOCAL_API = true; // Set to false to use Currents API
```

## Troubleshooting

**"Could not connect to local news server"**
- Make sure `start_server.bat` is running
- Check if Python is installed correctly
- Verify the server is running on http://127.0.0.1:5000

**No news appearing**
- Check browser console (F12) for errors
- Ensure the Python server is running without errors
- Try refreshing the page

**Videos not loading**
- Check your YouTube API key is valid
- Verify the channel ID is correct

## API Endpoints

The Python backend provides these endpoints:

- `GET /api/news` - Get all latest Israel news
- `GET /api/news/search?q=keyword` - Search news by keyword
- `GET /api/health` - Health check

## License

Free to use and modify.
