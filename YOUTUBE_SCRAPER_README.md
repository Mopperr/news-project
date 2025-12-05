# YouTube Video Scraper System

## Overview

This system automatically scrapes and catalogs videos from multiple YouTube channels, checking for new content every 24 hours.

## Configured Channels

### 1. Vision for Israel (VFI News)
- **Handle**: @VisionforIsrael
- **Channel ID**: UCgbcHAR6wp5mtxZltb3xVZQ
- **URL**: https://www.youtube.com/@VisionforIsrael
- **Catalog File**: `vfi_news_videos_catalog.json`
- **Current Videos**: 500 videos
- **Latest Video**: "Israel Eliminates Top Hezbollah Commander | VFI News" (Dec 3, 2025)

### 2. Roots & Reflections
- **Handle**: @RootsReflections
- **Channel ID**: UCBl0vL9lwgASJIZ_H7USD8Q
- **URL**: https://www.youtube.com/@RootsReflections
- **Catalog File**: `roots_reflections_videos_catalog.json`
- **Current Videos**: 57 episodes
- **Latest Video**: "The Road to Eilat—Episode 45" (May 3, 2021)
- **Content**: Biblical teachings with Barry Segal

### 3. Barry & Batya Segal Music
- **Handle**: @BarryBatyaSegal
- **Channel ID**: UC9Nj8CTAGFJZUVvSL-7iBBg
- **URL**: https://www.youtube.com/@BarryBatyaSegal
- **Catalog File**: `barry_batya_music_catalog.json`
- **Current Videos**: 71 worship songs
- **Latest Video**: "O Lord God of Israel | Barry & Batya Segal Music" (Dec 4, 2025)
- **Content**: Messianic worship music and praise songs

## How It Works

### Video Data Structure

Each video catalog (`*_videos_catalog.json`) contains:

```json
{
  "channel": {
    "name": "Channel Name",
    "channel_id": "UCxxx...",
    "url": "https://www.youtube.com/channel/UCxxx..."
  },
  "last_updated": "2025-12-04T12:00:00",
  "total_videos": 500,
  "videos": [
    {
      "videoId": "abc123",
      "title": "Video Title",
      "description": "Video description...",
      "publishedAt": "2025-12-03T00:00:00Z",
      "thumbnails": {
        "default": {"url": "..."},
        "medium": {"url": "..."},
        "high": {"url": "..."},
        "maxres": {"url": "..."}
      },
      "channelTitle": "Channel Name",
      "videoUrl": "https://www.youtube.com/watch?v=abc123"
    }
  ]
}
```

### Scraping Methods

The system uses two methods to fetch videos:

1. **YouTube Data API v3** (Primary)
   - Fetches complete video metadata
   - Can retrieve up to 500 videos per channel
   - Uses API quota (limited free tier)
   - More detailed information

2. **RSS Feed** (Fallback/Quick Check)
   - No API quota required
   - Limited to 15 most recent videos
   - Used for quick new video checks
   - Faster but less detailed

## Usage

### 1. Initial Full Scrape

Fetch the complete video catalog for all channels:

```powershell
python youtube_channel_scraper.py --initial
```

**What it does:**
- Fetches up to 500 videos from VFI News
- Fetches all videos from Roots & Reflections
- Creates/updates catalog JSON files
- Shows summary of fetched videos

**Output:**
```
============================================================
CATALOG SUMMARY
============================================================
Channel: Vision for Israel
Total Videos: 500

Latest Videos:
  1. [2025-12-03] Israel Eliminates Top Hezbollah Commander...
  2. [2025-12-02] The Prophecy That Launched Vision for Israel...
  ...
```

### 2. Quick Check for New Videos

Check if any new videos have been published:

```powershell
python youtube_channel_scraper.py --check
```

**What it does:**
- Compares latest videos with existing catalog
- Reports any new videos found
- Updates catalog if new content detected
- Uses RSS feed for speed (no API quota)

**Output:**
```
Checking for new videos: Vision for Israel
  Existing catalog: 500 videos
  Last updated: 2025-12-03T12:00:00
  ✓ Found 2 new video(s)!
    - New Video Title 1...
    - New Video Title 2...
```

### 3. Automated 24-Hour Scheduler

Run continuous monitoring for new videos:

```powershell
python youtube_channel_scraper.py --schedule
```

**What it does:**
- Checks for new videos immediately on start
- Schedules automatic checks every 24 hours at 3 AM
- Runs indefinitely until stopped (Ctrl+C)
- Updates catalogs automatically when new videos found

**Output:**
```
======================================================================
YouTube Video Scheduler Started
======================================================================
Checking for new videos every 24 hours
Press Ctrl+C to stop

Next check scheduled: 2025-12-05 03:00:00
```

## Catalog Files

### VFI News Videos
**File**: `vfi_news_videos_catalog.json`
- Full video history from VFI News channel
- News updates, prophecy teachings, ministry stories
- Updated automatically when new videos published

### Roots & Reflections Videos
**File**: `roots_reflections_videos_catalog.json`
- Biblical teaching episodes with Barry Segal
- Episode-based content (numbered episodes)
- Deeper theological and historical teachings

### Barry & Batya Segal Music
**File**: `barry_batya_music_catalog.json`
- Complete catalog of worship music videos
- Messianic praise & worship songs
- Hebrew and English worship content
- Updated automatically when new songs published

## Website Integration

### Current Integration (VFI News)

The main website (`index.html`) displays VFI News videos:

- **Featured Video Section**: Latest video with large player
- **Video Grid**: 15+ recent videos in grid layout
- **Data Source**: Uses `all_playlist_videos.json` (older format)

**Files**:
- `index.html` - Main page with video sections
- `index.js` - JavaScript that loads and displays videos

### New Integration (Roots & Reflections)

Created dedicated page for Roots & Reflections:

- **New Page**: `roots-reflections.html`
- **JavaScript**: `roots-reflections.js`
- **Features**:
  - Search episodes by title/topic
  - Sort by newest, oldest, or title
  - Episode badges for numbered content
  - Video modal with YouTube player
  - Responsive grid layout
  - Channel statistics

**Access**: Navigate to `/roots-reflections.html` on your site

### Updated Integration (Worship Music)

The worship music section now displays Barry & Batya Segal music:

- **Location**: Main page (`index.html`) worship section
- **Data Source**: `barry_batya_music_catalog.json`
- **Features**:
  - Displays 12 latest worship songs
  - Auto-updates when catalog refreshed
  - Direct link to YouTube channel
  - Video modal player
  - Fallback to hardcoded videos if catalog unavailable

**Music Videos**: 71 worship songs from @BarryBatyaSegal channel

## Adding New Channels

To add another YouTube channel:

1. Open `youtube_channel_scraper.py`
2. Add new channel to `CHANNELS` dictionary:

```python
CHANNELS = {
    # ... existing channels ...
    
    'new_channel_key': {
        'name': 'Channel Display Name',
        'handle': '@YouTubeHandle',
        'channel_id': None,  # Will be auto-detected
        'output_file': 'channel_name_videos_catalog.json',
        'description': 'Description of channel content'
    }
}
```

3. Run initial scrape:
```powershell
python youtube_channel_scraper.py --initial
```

4. Create new HTML page (copy `roots-reflections.html` as template)

## API Quota Management

### YouTube Data API v3 Limits

**Free Tier**: 10,000 quota units per day

**Cost per Operation**:
- Search: 100 units
- Playlist items list: 1 unit per page (50 videos)
- Channel info: 1 unit

**Example Usage**:
- Initial scrape (500 videos): ~11 units
- Daily check (RSS): 0 units
- Weekly full refresh: ~11 units per channel

**Best Practices**:
1. Use RSS feed for daily checks (no quota)
2. Full API scrape only when needed
3. Run full scrape weekly or monthly
4. Monitor quota usage in Google Cloud Console

### Staying Under Quota

The scraper automatically:
- Uses RSS for quick checks (no quota)
- Only runs full API scrape when new videos detected
- Implements delays between requests
- Caches results in JSON files

## Automation Options

### Option 1: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 3:00 AM
4. Action: Start a program
   - Program: `python`
   - Arguments: `youtube_channel_scraper.py --check`
   - Start in: `C:\Users\and87\Desktop\FINAL PROJECT MODULE 4`

### Option 2: Run as Background Service

Use the built-in scheduler:
```powershell
# Start in background
Start-Process python -ArgumentList "youtube_channel_scraper.py --schedule" -WindowStyle Hidden
```

### Option 3: Manual Scheduled Runs

Create a batch file `check_videos.bat`:
```batch
@echo off
cd "C:\Users\and87\Desktop\FINAL PROJECT MODULE 4"
python youtube_channel_scraper.py --check
pause
```

Double-click whenever you want to check for new videos.

## Troubleshooting

### No videos found
- Check channel ID is correct
- Verify channel is public
- Check internet connection
- Verify API key is valid

### API quota exceeded
- Use RSS feed method (`--check` instead of `--initial`)
- Wait 24 hours for quota reset
- Check quota usage in Google Cloud Console

### Catalog not updating
- Check file permissions
- Verify script has write access to directory
- Check for JSON syntax errors in existing catalog

### Videos not showing on website
- Clear browser cache
- Check JSON file exists and is valid
- Verify JavaScript is loading catalog file
- Check browser console for errors

## File Structure

```
FINAL PROJECT MODULE 4/
├── youtube_channel_scraper.py              # Main scraper script
├── vfi_news_videos_catalog.json            # VFI News video catalog (500 videos)
├── roots_reflections_videos_catalog.json   # Roots & Reflections catalog (57 episodes)
├── barry_batya_music_catalog.json          # Barry & Batya music catalog (71 songs)
├── roots-reflections.html                  # Roots & Reflections page
├── roots-reflections.js                    # Page JavaScript
├── index.html                              # Main site (includes worship section)
├── index.js                                # Main site JavaScript
└── YOUTUBE_SCRAPER_README.md              # This file
```

## Monitoring

### Check Scraper Status

```powershell
# View VFI News catalog info
python -c "import json; data=json.load(open('vfi_news_videos_catalog.json')); print(f'Videos: {data[\"total_videos\"]}, Updated: {data[\"last_updated\"]}')"

# View Roots & Reflections catalog info
python -c "import json; data=json.load(open('roots_reflections_videos_catalog.json')); print(f'Videos: {data[\"total_videos\"]}, Updated: {data[\"last_updated\"]}')"
```

### View Latest Videos

```powershell
# Show 5 latest VFI News videos
python -c "import json; data=json.load(open('vfi_news_videos_catalog.json')); [print(f'{v[\"publishedAt\"][:10]} - {v[\"title\"]}') for v in data['videos'][:5]]"
```

## Summary

### What You Have Now

✅ **Complete VFI News Catalog**: 500 videos cataloged  
✅ **Complete Roots & Reflections Catalog**: 57 episodes cataloged  
✅ **Complete Barry & Batya Music Catalog**: 71 worship songs cataloged  
✅ **Automated Checking**: Script to check for new videos  
✅ **24-Hour Scheduler**: Automatic daily monitoring  
✅ **Roots & Reflections Page**: Dedicated biblical teachings page  
✅ **Worship Music Section**: Updated with Barry & Batya Segal music  
✅ **Search & Sort**: Filter and organize episodes  
✅ **Video Player**: Modal with embedded YouTube player  

### Next Steps

1. **Test the new page**: Open `roots-reflections.html` in your browser
2. **Set up automation**: Run `python youtube_channel_scraper.py --schedule`
3. **Add to navigation**: Link to Roots & Reflections from other pages (already done!)
4. **Monitor catalogs**: Check for new videos weekly

### Commands Quick Reference

```powershell
# Get all videos from all channels
python youtube_channel_scraper.py --initial

# Check for new videos
python youtube_channel_scraper.py --check

# Run 24-hour automated checking
python youtube_channel_scraper.py --schedule
```

---

**Last Updated**: December 4, 2025  
**Total Videos Cataloged**: 628 videos across 3 channels  
**Status**: ✅ Fully Operational

**Channels**:
- VFI News: 500 videos
- Roots & Reflections: 57 episodes
- Barry & Batya Music: 71 worship songs
