# VFI News - Setup Instructions

## Quick Start

### Option 1: Start All Servers (Recommended)
Double-click `start_all_servers.bat` to start both the news server and weather API.

### Option 2: Start Servers Individually

1. **News Server** (Required for news articles)
   - Double-click `server.bat`
   - Runs on http://127.0.0.1:8080

2. **Weather API** (For live Jerusalem weather)
   - Double-click `start_weather_api.bat`
   - Runs on http://127.0.0.1:8082

## Viewing the Site

1. Make sure at least the News Server is running
2. Open `index.html` in your web browser
3. The site will automatically fetch:
   - Live Jerusalem weather (if weather API is running, otherwise shows fallback)
   - Video thumbnails from YouTube
   - News articles from the server

## Features

### Header Section (Uniform Layout)
- **Left**: VFI News Logo (280px width)
- **Center**: Jerusalem 24/7 Livestream (560px width, 16:9 aspect ratio)
- **Right**: Weather Widget & Clock (280px width)

All three sections are now uniform in height (160px) and properly aligned.

### Weather Widget
- Shows real-time Jerusalem weather
- Updates every 30 minutes
- Displays:
  - Current temperature (°C)
  - Weather description
  - Weather icon (changes based on conditions)
  
### Video Thumbnails
- Enhanced with multiple fallback options
- Automatically tries:
  1. High quality thumbnail
  2. Medium quality thumbnail
  3. Default thumbnail
  4. Direct YouTube image URLs
- Error handling prevents broken images

## Troubleshooting

### Weather Not Updating
- Make sure `weather_api.py` is running (port 8082)
- Check console for errors
- The site will show "20°C Partly Cloudy" as fallback if API is unavailable

### Video Thumbnails Not Showing
- Thumbnails are now loaded with multiple fallbacks
- If one URL fails, it automatically tries alternative sources
- Check browser console for any errors

### News Not Loading
- Make sure `server.bat` is running (port 8080)
- Red error message will appear if server is not available

## Technical Details

### Weather API
- **Endpoint**: http://127.0.0.1:8082/api/weather/jerusalem
- **Data Source**: OpenWeatherMap API
- **Location**: Jerusalem, Israel (31.7683°N, 35.2137°E)
- **Update Frequency**: Every 30 minutes
- **Response Format**: JSON with temperature, description, humidity, wind, etc.

### Ports Used
- 8080: News Server
- 8082: Weather API

## Files Overview

- `index.html` - Main homepage
- `about.html` - About VFI page
- `index.js` - JavaScript for news/videos/weather
- `styles.css` - Styling (includes uniform header layout)
- `weather_api.py` - Jerusalem weather API server
- `server.bat` - News server
- `start_weather_api.bat` - Weather API starter
- `start_all_servers.bat` - Starts both servers

## Dependencies

Python packages required:
- requests
- beautifulsoup4 (if using news scraper)

Install with:
```
pip install requests beautifulsoup4
```
