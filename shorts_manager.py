"""
VFI YouTube Shorts Manager
Fetches YouTube shorts from Vision for Israel channel, verifies thumbnails work,
and creates a rotating catalog for the website
"""

import requests
import json
import time
from datetime import datetime
import os

# Configuration
SHORTS_FILE = 'vfi_shorts_catalog.json'
CHANNEL_HANDLE = '@VisionforIsrael'
UPDATE_INTERVAL = 3600  # Update every hour
MAX_SHORTS = 20  # Keep catalog of 20 working shorts

# YouTube API Configuration (using scraping method as backup)
def fetch_youtube_shorts_feed():
    """Fetch shorts from VFI YouTube channel by scraping shorts page"""
    try:
        # Access the shorts page directly
        url = 'https://www.youtube.com/@VisionforIsrael/shorts'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Extract video IDs from the page HTML
        import re
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', response.text)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_ids = []
        for vid in video_ids:
            if vid not in seen:
                seen.add(vid)
                unique_ids.append(vid)
        
        videos = []
        for video_id in unique_ids[:30]:  # Get first 30 unique shorts
            videos.append({
                'id': video_id,
                'title': f'VFI Short {video_id}',
                'published': datetime.now().isoformat()
            })
        
        print(f"✓ Found {len(videos)} shorts from VFI channel")
        return videos
        
    except Exception as e:
        print(f"✗ Error fetching YouTube shorts: {e}")
        return []

def verify_thumbnail(video_id):
    """Verify that a thumbnail URL is accessible"""
    thumbnail_urls = [
        f'https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg',
        f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg',
        f'https://i.ytimg.com/vi/{video_id}/mqdefault.jpg',
        f'https://i.ytimg.com/vi/{video_id}/sddefault.jpg',
    ]
    
    for url in thumbnail_urls:
        try:
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                return url
        except:
            continue
    
    return None

def is_likely_short(video_id):
    """Check if video is likely a short by attempting to access shorts URL"""
    try:
        # Shorts have specific URL pattern
        shorts_url = f'https://www.youtube.com/shorts/{video_id}'
        response = requests.head(shorts_url, timeout=5, allow_redirects=True)
        # If it doesn't redirect away from shorts URL, it's likely a short
        return 'shorts' in response.url
    except:
        return False

def get_video_details(video_id):
    """Get video details including thumbnail verification"""
    try:
        # Verify thumbnail
        thumbnail_url = verify_thumbnail(video_id)
        
        if not thumbnail_url:
            return None
        
        # Check if it's a short
        is_short = is_likely_short(video_id)
        
        return {
            'video_id': video_id,
            'thumbnail_url': thumbnail_url,
            'is_short': is_short,
            'verified': True,
            'checked_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    except Exception as e:
        print(f"  ✗ Error verifying {video_id}: {e}")
        return None

def build_shorts_catalog():
    """Build catalog of VFI shorts with working thumbnails"""
    print("=" * 70)
    print("🎬 VFI YouTube Shorts Catalog Builder")
    print("=" * 70)
    print(f"Channel: {CHANNEL_HANDLE}")
    print(f"Max shorts in catalog: {MAX_SHORTS}")
    print("=" * 70)
    print()
    
    print("Fetching recent videos from VFI channel...")
    videos = fetch_youtube_shorts_feed()
    
    if not videos or len(videos) == 0:
        print("✗ Could not fetch videos from YouTube")
        return create_fallback_catalog()
    
    print(f"✓ Found {len(videos)} potential shorts")
    print()
    print("Verifying thumbnails for each video...")
    
    verified_shorts = []
    checked_count = 0
    
    for video in videos:
        if len(verified_shorts) >= MAX_SHORTS:
            break
        
        checked_count += 1
        video_id = video['id']
        
        print(f"[{checked_count}/{min(len(videos), MAX_SHORTS * 2)}] Checking video {video_id}...", end=' ')
        
        # Just verify thumbnail works - don't check if it's a short
        thumbnail_url = verify_thumbnail(video_id)
        
        if thumbnail_url:
            short_info = {
                'id': {'videoId': video_id},
                'snippet': {
                    'title': video.get('title', f'VFI Short {video_id}'),
                    'publishedAt': video.get('published', datetime.now().isoformat()),
                    'thumbnails': {
                        'high': {'url': thumbnail_url},
                        'medium': {'url': thumbnail_url},
                        'default': {'url': thumbnail_url}
                    }
                },
                'verified': True,
                'verified_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            verified_shorts.append(short_info)
            print(f"✓ Thumbnail OK")
        else:
            print(f"✗ No thumbnail")
        
        # Small delay to avoid rate limiting
        time.sleep(0.3)
        
        # Stop checking after reasonable amount
        if checked_count >= MAX_SHORTS * 2:
            break
    
    print()
    if len(verified_shorts) > 0:
        print(f"✓ Found {len(verified_shorts)} videos with working thumbnails")
        return verified_shorts
    else:
        print("⚠️  No videos with thumbnails found, using fallback")
        return create_fallback_catalog()
    
    return verified_shorts

def create_fallback_catalog():
    """Create fallback catalog with known working VFI videos"""
    print("Creating fallback catalog with verified VFI videos...")
    
    # Use videos from the main VFI list that we know have working thumbnails
    fallback_videos = [
        {'id': 'gjSpbJDkFKc', 'title': 'The Prophecy That Launched Vision for Israel'},
        {'id': 'WEStUv35fRE', 'title': 'Israel Update: IDF Strikes Hamas Commanders as Ceasefire Wavers'},
        {'id': 'JfxEqM4sMPw', 'title': 'Vision for Israel: The Incredible Story Behind 30 Years of Impact'},
        {'id': 'MIxbj-TdZow', 'title': 'NYC Elects a Mayor Calling to \'Globalize the Intifada\''},
        {'id': 'Dr76xIGIV6U', 'title': 'The Hidden Power Struggle Inside Palestine EXPOSED'},
        {'id': '9OdvT4MzrfE', 'title': 'What Hamas Hid for 11 Years — The Truth About Hadar Goldin'},
        {'id': 'XZiQKLlqiAo', 'title': 'Nationalism vs Pan-Arabism: The PLO\'s Internal War'},
        {'id': 'ER9HgrA6Fd0', 'title': 'Tehran Could Collapse — Iran\'s Crisis Exposed'},
        {'id': '1ldqh0FfUq4', 'title': 'How Britain and France Created the Modern Middle East'},
        {'id': '-vzHulaERYs', 'title': 'How the Reformation Sparked Christian Zionism'},
    ]
    
    catalog = []
    print("\nVerifying fallback videos...")
    
    for video in fallback_videos:
        video_id = video['id']
        
        # Verify thumbnail actually works
        thumbnail = verify_thumbnail(video_id)
        if thumbnail:
            catalog.append({
                'id': {'videoId': video_id},
                'snippet': {
                    'title': video['title'],
                    'publishedAt': datetime.now().isoformat(),
                    'thumbnails': {
                        'high': {'url': thumbnail},
                        'medium': {'url': thumbnail},
                        'default': {'url': thumbnail}
                    }
                },
                'verified': True,
                'verified_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'note': 'Fallback catalog - verified thumbnail'
            })
            print(f"  ✓ {video['title'][:60]}")
        else:
            print(f"  ✗ {video['title'][:60]} - thumbnail not available")
    
    print(f"\n✓ Created fallback catalog with {len(catalog)} verified videos")
    return catalog

def save_shorts_catalog(shorts):
    """Save shorts catalog to JSON file"""
    try:
        catalog_data = {
            'status': 'ok',
            'total_shorts': len(shorts),
            'shorts': shorts,
            'updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'timestamp': time.time(),
            'current_index': 0  # Track which short to show
        }
        
        with open(SHORTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(catalog_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Catalog saved to {SHORTS_FILE}")
        return True
    except Exception as e:
        print(f"✗ Error saving catalog: {e}")
        return False

def get_next_short():
    """Get next short in rotation"""
    try:
        if not os.path.exists(SHORTS_FILE):
            return None
        
        with open(SHORTS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if data['total_shorts'] == 0:
            return None
        
        # Get current short
        current_index = data.get('current_index', 0)
        current_short = data['shorts'][current_index]
        
        # Update index for next call
        data['current_index'] = (current_index + 1) % data['total_shorts']
        
        # Save updated index
        with open(SHORTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return current_short
        
    except Exception as e:
        print(f"✗ Error getting next short: {e}")
        return None

def run_catalog_updater():
    """Main loop to update shorts catalog"""
    print("Starting VFI Shorts Catalog Updater...")
    print(f"Update interval: {UPDATE_INTERVAL // 60} minutes")
    print()
    
    update_count = 0
    
    try:
        while True:
            update_count += 1
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            print(f"\n[{timestamp}] Update #{update_count}")
            print("-" * 70)
            
            # Build catalog
            shorts = build_shorts_catalog()
            
            # If no shorts found, use fallback
            if not shorts or len(shorts) == 0:
                print("\n⚠️  No shorts found, using fallback catalog")
                shorts = create_fallback_catalog()
            
            # Save catalog
            if save_shorts_catalog(shorts):
                print(f"\n✓ Successfully updated catalog with {len(shorts)} shorts")
            else:
                print("\n✗ Failed to save catalog")
            
            print(f"\nNext update in {UPDATE_INTERVAL // 60} minutes...")
            print("=" * 70)
            
            # Wait for next update
            time.sleep(UPDATE_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Catalog updater stopped by user")
        print(f"Total updates: {update_count}")
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        print(f"Updater stopped after {update_count} updates")

if __name__ == '__main__':
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("✗ Error: 'requests' library not installed")
        print("Install it with: pip install requests")
        exit(1)
    
    # Create initial catalog if it doesn't exist
    if not os.path.exists(SHORTS_FILE):
        print(f"Creating initial shorts catalog: {SHORTS_FILE}\n")
        shorts = build_shorts_catalog()
        if not shorts:
            shorts = create_fallback_catalog()
        save_shorts_catalog(shorts)
        print()
    
    # Ask user what to do
    print("\nOptions:")
    print("1. Run continuous updater (updates every hour)")
    print("2. Update catalog once and exit")
    print("3. Show current catalog")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == '1':
        run_catalog_updater()
    elif choice == '2':
        shorts = build_shorts_catalog()
        if not shorts:
            shorts = create_fallback_catalog()
        save_shorts_catalog(shorts)
        print("\n✓ Catalog updated successfully!")
    elif choice == '3':
        if os.path.exists(SHORTS_FILE):
            with open(SHORTS_FILE, 'r') as f:
                data = json.load(f)
            print(f"\nCatalog has {data['total_shorts']} shorts")
            print(f"Last updated: {data['updated']}")
            print(f"Current index: {data['current_index']}")
            print("\nShorts:")
            for i, short in enumerate(data['shorts'], 1):
                print(f"  {i}. {short['snippet']['title']}")
        else:
            print("✗ No catalog file found")
    else:
        print("Invalid choice")
