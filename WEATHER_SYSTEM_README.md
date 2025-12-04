# VFI News - Weather System Setup

## Overview
The VFI News website now uses a **local weather data file** system that updates automatically every 10 minutes. This eliminates the need for real-time API calls and improves website performance.

## How It Works

### 1. Weather Updater (`weather_updater.py`)
- **Fetches** live weather data for Jerusalem, Israel from wttr.in (free service, no API key needed)
- **Updates** every 10 minutes automatically
- **Saves** weather data to `weather_data.json`
- **Runs** continuously in the background

### 2. Website (`index.js`)
- **Reads** weather data from `weather_data.json` 
- **Refreshes** display every 60 seconds
- **Shows** temperature, weather conditions with dynamic icons

### 3. Weather Data File (`weather_data.json`)
Contains:
- Current temperature in Celsius
- "Feels like" temperature
- Weather description (Clear, Cloudy, Rain, etc.)
- Humidity percentage
- Wind speed
- Last update timestamp

## Starting the System

### Option 1: Complete System (Recommended)
```batch
start_complete_system.bat
```
This starts:
- News server (Port 8080)
- Weather updater (background process)

### Option 2: Weather Only
```batch
start_weather_updater.bat
```
Starts only the weather updater

### Manual Start
```bash
python weather_updater.py
```

## Logo Updates

The VFI News logo has been updated to:
- **Match** the YouTube video frame size (16:9 aspect ratio)
- **Scale** up to 560px width (same as livestream)
- **Remove** extra borders and shadows for cleaner appearance
- **Maintain** aspect ratio on all screen sizes

### CSS Changes
- Logo uses `aspect-ratio: 16/9` for consistent sizing
- Removed fixed height constraints
- Header grid uses flexible `1fr 1fr 1fr` columns
- Responsive breakpoints updated for all device sizes

## Responsive Design

The website is fully responsive:
- **Desktop**: Logo and video side-by-side, max 560px each
- **Tablet**: Stacked layout, logo up to 500px
- **Mobile**: Full-width logo, adapts to screen size
- **All devices**: Maintains 16:9 aspect ratio

## Weather Icons

Dynamic weather icons based on conditions:
- ☀️ `fa-sun` - Clear skies
- ⛅ `fa-cloud-sun` - Partly cloudy
- ☁️ `fa-cloud` - Cloudy
- 🌧️ `fa-cloud-rain` - Rain
- ⛈️ `fa-cloud-bolt` - Storms/Thunder
- ❄️ `fa-snowflake` - Snow
- 🌫️ `fa-smog` - Mist/Fog

## Troubleshooting

### Weather not updating
1. Check if `weather_updater.py` is running
2. Verify `weather_data.json` exists and has recent timestamp
3. Restart with `start_weather_updater.bat`

### Logo too small/large
- Logo automatically scales to match video frame
- Check browser zoom level (should be 100%)
- Clear browser cache and reload

### Weather shows old data
- Weather updates every 10 minutes
- Check the "updated" timestamp in `weather_data.json`
- Website refreshes weather display every 60 seconds

## Files Modified

### New Files
- `weather_updater.py` - Weather fetch script
- `weather_data.json` - Weather data storage
- `start_weather_updater.bat` - Weather launcher
- `start_complete_system.bat` - Complete system launcher

### Modified Files
- `styles.css` - Logo sizing and responsive updates
- `index.js` - Weather reading from JSON file

## Technical Details

### Weather Update Interval
- **Fetch**: Every 10 minutes (600 seconds)
- **Display refresh**: Every 60 seconds
- **Source**: wttr.in free weather API

### Logo Sizing
- **Max width**: 560px (matches video)
- **Aspect ratio**: 16:9
- **Grid layout**: Equal 3-column flex grid
- **Responsive**: Adapts to all screen sizes

### Browser Compatibility
- Chrome ✓
- Firefox ✓
- Edge ✓
- Safari ✓
- Mobile browsers ✓

## Benefits

1. **No API rate limits** - Uses free wttr.in service
2. **Fast loading** - Reads from local file
3. **Reliable** - Continues working even if weather service is down
4. **Efficient** - Updates only every 10 minutes
5. **Clean design** - Logo matches video frame perfectly

## Support

For issues or questions:
1. Check console for errors (F12 in browser)
2. Verify weather updater is running
3. Check `weather_data.json` has recent data
4. Restart the system with batch files
