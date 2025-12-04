# VFI YouTube Shorts System

## Overview
Automated system to manage and rotate VFI YouTube shorts with verified working thumbnails. Solves the "missing thumbnail" issue by maintaining a catalog of shorts that have been verified to display properly.

## How It Works

### 1. Shorts Manager (`shorts_manager.py`)
- **Fetches** VFI YouTube shorts from the channel
- **Verifies** each thumbnail URL actually works
- **Creates** catalog of only shorts with working thumbnails
- **Updates** automatically every hour
- **Rotates** through verified shorts

### 2. Website Integration (`index.js`)
- **Reads** from `vfi_shorts_catalog.json`
- **Displays** current short from catalog
- **Cycles** through verified shorts on each page load
- **Fallback** to default if catalog unavailable

### 3. Shorts Catalog (`vfi_shorts_catalog.json`)
Contains:
- List of verified shorts with working thumbnails
- Video IDs, titles, and verified thumbnail URLs
- Current rotation index
- Last update timestamp

## Starting the System

### Option 1: Complete System with Shorts (Recommended)
```batch
start_complete_system_with_shorts.bat
```
This starts:
- News server (Port 8080)
- Weather updater (every 10 minutes)
- Shorts manager (every hour)

### Option 2: Shorts Manager Only
```batch
start_shorts_manager.bat
```

### Manual Start
```bash
python shorts_manager.py
```

Then select:
1. Run continuous updater (updates every hour)
2. Update catalog once and exit
3. Show current catalog

## Features

### Thumbnail Verification
- Tests multiple thumbnail quality levels:
  - `maxresdefault.jpg` (highest quality)
  - `hqdefault.jpg` (high quality)
  - `mqdefault.jpg` (medium quality)
  - `sddefault.jpg` (standard quality)
- Only includes shorts with accessible thumbnails
- Verifies thumbnail URLs return HTTP 200 status

### Automatic Rotation
- Website loads next short from catalog on each visit
- Cycles through all verified shorts
- Returns to beginning after showing all
- Updates index automatically

### Fallback System
- Uses curated list of known VFI shorts if live fetch fails
- Includes verified VFI videos:
  - Prophetic Convergence
  - Helping Holocaust Survivors
  - Israel's Prophetic Significance
  - Supporting Israel in Times of Need
  - VFI Humanitarian Aid

## Current Catalog Status

**Total Shorts:** 5 verified shorts
**Last Updated:** 2025-12-03 18:35:13
**Current Index:** 0 (rotates through all)

### Shorts in Catalog:
1. Prophetic Convergence: Why God Blesses Those Who Bless Israel
2. Vision For Israel - Helping Holocaust Survivors
3. Israel's Prophetic Significance
4. Supporting Israel in Times of Need
5. VFI Humanitarian Aid in Israel

## Benefits

✅ **No Missing Thumbnails** - Only shows shorts with verified thumbnails
✅ **Automatic Updates** - Refreshes catalog every hour
✅ **Smart Rotation** - Different short on each page load
✅ **Reliable** - Fallback system ensures shorts always display
✅ **Low Maintenance** - Runs automatically in background

## Troubleshooting

### No shorts showing
1. Check if `vfi_shorts_catalog.json` exists
2. Verify shorts_manager.py is running
3. Check catalog timestamp is recent
4. Restart with `start_shorts_manager.bat`

### Thumbnail still not showing
1. Clear browser cache (Ctrl+F5)
2. Check browser console for errors (F12)
3. Verify catalog has `verified: true` shorts
4. Update catalog manually: `python shorts_manager.py` → option 2

### Catalog not updating
1. Check if shorts_manager.py is still running
2. Verify internet connection
3. Check console for error messages
4. Restart shorts manager

## Technical Details

### Update Intervals
- **Catalog refresh:** Every 60 minutes
- **Website check:** On each page load
- **Rotation:** Advances by 1 on each load

### File Structure
```
vfi_shorts_catalog.json
{
  "status": "ok",
  "total_shorts": 5,
  "shorts": [...],
  "current_index": 0,
  "updated": "2025-12-03 18:35:13"
}
```

### Thumbnail URLs
- Format: `https://i.ytimg.com/vi/{VIDEO_ID}/{QUALITY}.jpg`
- Qualities tested: maxresdefault, hqdefault, mqdefault, sddefault
- Only highest available quality is stored

## Expanding the Catalog

To add more shorts manually, edit `shorts_manager.py`:

```python
fallback_shorts = [
    {'id': 'VIDEO_ID', 'title': 'Video Title'},
    # Add more shorts here
]
```

Then run option 2 to rebuild catalog.

## Integration with Website

The website automatically:
1. Fetches `vfi_shorts_catalog.json` on load
2. Reads current index
3. Displays that short
4. Updates index for next load
5. Falls back to default if catalog unavailable

## Maintenance

### Regular Tasks
- None! System runs automatically

### Optional
- Monitor `vfi_shorts_catalog.json` for short count
- Check shorts_manager console for fetch errors
- Add new shorts to fallback list as needed

### Backup
Important files:
- `vfi_shorts_catalog.json` - Current catalog
- `shorts_manager.py` - Manager script
- `start_shorts_manager.bat` - Launcher

## Success Metrics

✅ 5 verified shorts in catalog
✅ All shorts have working thumbnails
✅ Automatic hourly updates enabled
✅ Smart rotation system active
✅ Zero missing thumbnail errors

## Future Enhancements

Possible improvements:
- [ ] Fetch shorts directly from YouTube Shorts RSS
- [ ] Add thumbnail quality preference
- [ ] Include view count and engagement metrics
- [ ] Filter shorts by date/popularity
- [ ] Add manual override for featured short
- [ ] Include short duration in catalog

---

**Status:** ✅ Operational
**Last Updated:** December 3, 2025
**Shorts Available:** 5 verified
