"""
Comprehensive YouTube Channel Scraper for VFI News
Fetches complete video catalogs from multiple YouTube channels
Runs automatically every 24 hours to check for new videos

Channels:
1. Vision for Israel (VFI News): @VisionforIsrael
2. Roots & Reflections: @RootsReflections
"""

import requests
import json
import feedparser
from datetime import datetime, timedelta
import time
import os
import schedule
from typing import List, Dict, Optional

# YouTube API Configuration
YOUTUBE_API_KEY = 'AIzaSyBelWh3h-9xBSHXKN8oKMY3ieWpM6WaB0M'

# Channel Configurations
CHANNELS = {
    'vfi_news': {
        'name': 'Vision for Israel',
        'handle': '@VisionforIsrael',
        'channel_id': 'UCgbcHAR6wp5mtxZltb3xVZQ',
        'output_file': 'vfi_news_videos_catalog.json',
        'description': 'VFI News videos about Israel, prophecy, and ministry work'
    },
    'roots_reflections': {
        'name': 'Roots & Reflections',
        'handle': '@RootsReflections',
        'channel_id': None,  # Will be fetched using handle
        'output_file': 'roots_reflections_videos_catalog.json',
        'description': 'Biblical teachings and reflections'
    },
    'barry_batya_music': {
        'name': 'Barry & Batya Segal',
        'handle': '@BarryBatyaSegal',
        'channel_id': None,  # Will be fetched using handle
        'output_file': 'barry_batya_music_catalog.json',
        'description': 'Worship music and songs from Barry and Batya Segal'
    }
}

class YouTubeChannelScraper:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://www.googleapis.com/youtube/v3'
        
    def get_channel_id_from_handle(self, handle: str) -> Optional[str]:
        """Convert YouTube handle (@username) to channel ID"""
        print(f"Looking up channel ID for {handle}...")
        
        # Try search API
        url = f"{self.base_url}/search"
        params = {
            'key': self.api_key,
            'q': handle,
            'part': 'snippet',
            'type': 'channel',
            'maxResults': 1
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('items'):
                channel_id = data['items'][0]['id']['channelId']
                print(f"  ✓ Found channel ID: {channel_id}")
                return channel_id
            else:
                print(f"  ✗ Channel not found")
                return None
                
        except Exception as e:
            print(f"  ✗ Error: {e}")
            return None
    
    def get_channel_uploads_playlist(self, channel_id: str) -> Optional[str]:
        """Get the uploads playlist ID for a channel"""
        url = f"{self.base_url}/channels"
        params = {
            'key': self.api_key,
            'id': channel_id,
            'part': 'contentDetails'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('items'):
                uploads_playlist = data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
                return uploads_playlist
            return None
            
        except Exception as e:
            print(f"Error getting uploads playlist: {e}")
            return None
    
    def fetch_playlist_videos(self, playlist_id: str, max_results: int = 50) -> List[Dict]:
        """Fetch all videos from a playlist (paginated)"""
        videos = []
        next_page_token = None
        total_fetched = 0
        
        while True:
            url = f"{self.base_url}/playlistItems"
            params = {
                'key': self.api_key,
                'playlistId': playlist_id,
                'part': 'snippet,contentDetails',
                'maxResults': min(50, max_results - total_fetched),  # API max is 50
            }
            
            if next_page_token:
                params['pageToken'] = next_page_token
            
            try:
                response = requests.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                # Process videos
                for item in data.get('items', []):
                    video = {
                        'videoId': item['snippet']['resourceId']['videoId'],
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'],
                        'publishedAt': item['snippet']['publishedAt'],
                        'thumbnails': {
                            'default': item['snippet']['thumbnails'].get('default', {}),
                            'medium': item['snippet']['thumbnails'].get('medium', {}),
                            'high': item['snippet']['thumbnails'].get('high', {}),
                            'maxres': item['snippet']['thumbnails'].get('maxres', {
                                'url': f"https://img.youtube.com/vi/{item['snippet']['resourceId']['videoId']}/maxresdefault.jpg"
                            })
                        },
                        'channelTitle': item['snippet']['channelTitle'],
                        'videoUrl': f"https://www.youtube.com/watch?v={item['snippet']['resourceId']['videoId']}"
                    }
                    videos.append(video)
                    total_fetched += 1
                
                # Check if we have more pages
                next_page_token = data.get('nextPageToken')
                
                if not next_page_token or total_fetched >= max_results:
                    break
                    
                # Small delay to respect rate limits
                time.sleep(0.5)
                
            except Exception as e:
                print(f"Error fetching playlist videos: {e}")
                break
        
        return videos
    
    def fetch_channel_videos_rss(self, channel_id: str) -> List[Dict]:
        """Fetch videos using RSS feed (no API quota, but limited to 15 videos)"""
        print(f"Fetching videos via RSS feed...")
        
        rss_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
        
        try:
            feed = feedparser.parse(rss_url)
            videos = []
            
            for entry in feed.entries:
                video = {
                    'videoId': entry.yt_videoid,
                    'title': entry.title,
                    'description': entry.get('summary', ''),
                    'publishedAt': entry.published,
                    'thumbnails': {
                        'default': {'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/default.jpg'},
                        'medium': {'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/mqdefault.jpg'},
                        'high': {'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/hqdefault.jpg'},
                        'maxres': {'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/maxresdefault.jpg'}
                    },
                    'channelTitle': entry.author,
                    'videoUrl': entry.link
                }
                videos.append(video)
            
            print(f"  ✓ Fetched {len(videos)} videos from RSS")
            return videos
            
        except Exception as e:
            print(f"  ✗ RSS fetch error: {e}")
            return []
    
    def get_full_channel_catalog(self, channel_id: str, channel_name: str, max_videos: int = 500) -> Dict:
        """Get complete catalog of channel videos"""
        print(f"\n{'='*60}")
        print(f"Fetching complete catalog for: {channel_name}")
        print(f"Channel ID: {channel_id}")
        print(f"{'='*60}\n")
        
        # Get uploads playlist
        uploads_playlist = self.get_channel_uploads_playlist(channel_id)
        
        if not uploads_playlist:
            print("Could not find uploads playlist, trying RSS feed...")
            videos = self.fetch_channel_videos_rss(channel_id)
        else:
            print(f"Uploads playlist ID: {uploads_playlist}")
            print(f"Fetching videos (max {max_videos})...\n")
            videos = self.fetch_playlist_videos(uploads_playlist, max_results=max_videos)
        
        # Create catalog
        catalog = {
            'channel': {
                'name': channel_name,
                'channel_id': channel_id,
                'url': f'https://www.youtube.com/channel/{channel_id}'
            },
            'last_updated': datetime.now().isoformat(),
            'total_videos': len(videos),
            'videos': videos
        }
        
        # Print summary
        print(f"\n{'='*60}")
        print(f"CATALOG SUMMARY")
        print(f"{'='*60}")
        print(f"Channel: {channel_name}")
        print(f"Total Videos: {len(videos)}")
        
        if videos:
            print(f"\nLatest Videos:")
            for i, video in enumerate(videos[:5], 1):
                pub_date = video['publishedAt'][:10]
                print(f"  {i}. [{pub_date}] {video['title'][:60]}...")
        
        print(f"{'='*60}\n")
        
        return catalog
    
    def save_catalog(self, catalog: Dict, filename: str):
        """Save catalog to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(catalog, f, indent=2, ensure_ascii=False)
            print(f"✓ Catalog saved to: {filename}")
            return True
        except Exception as e:
            print(f"✗ Error saving catalog: {e}")
            return False
    
    def load_catalog(self, filename: str) -> Optional[Dict]:
        """Load existing catalog"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return None
        except Exception as e:
            print(f"Error loading catalog: {e}")
            return None
    
    def check_for_new_videos(self, channel_key: str, channel_config: Dict) -> int:
        """Check for new videos and update catalog"""
        print(f"\nChecking for new videos: {channel_config['name']}")
        
        # Load existing catalog
        existing_catalog = self.load_catalog(channel_config['output_file'])
        
        if existing_catalog:
            print(f"  Existing catalog: {existing_catalog['total_videos']} videos")
            print(f"  Last updated: {existing_catalog['last_updated']}")
            existing_video_ids = {v['videoId'] for v in existing_catalog['videos']}
        else:
            print(f"  No existing catalog found")
            existing_video_ids = set()
        
        # Get channel ID if needed
        channel_id = channel_config['channel_id']
        if not channel_id:
            channel_id = self.get_channel_id_from_handle(channel_config['handle'])
            if not channel_id:
                print(f"  ✗ Could not get channel ID")
                return 0
            # Update config
            CHANNELS[channel_key]['channel_id'] = channel_id
        
        # Fetch latest videos (RSS for quick check)
        latest_videos = self.fetch_channel_videos_rss(channel_id)
        
        # Find new videos
        new_videos = [v for v in latest_videos if v['videoId'] not in existing_video_ids]
        
        if new_videos:
            print(f"  ✓ Found {len(new_videos)} new video(s)!")
            for video in new_videos:
                print(f"    - {video['title'][:60]}...")
            
            # Fetch full catalog to update
            full_catalog = self.get_full_channel_catalog(
                channel_id, 
                channel_config['name'],
                max_videos=500
            )
            self.save_catalog(full_catalog, channel_config['output_file'])
            
            return len(new_videos)
        else:
            print(f"  ℹ No new videos found")
            return 0

def scrape_all_channels():
    """Scrape all configured channels"""
    print(f"\n{'='*70}")
    print(f"YouTube Channel Scraper - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}\n")
    
    scraper = YouTubeChannelScraper(YOUTUBE_API_KEY)
    
    for channel_key, config in CHANNELS.items():
        try:
            # Get channel ID if not set
            if not config['channel_id']:
                channel_id = scraper.get_channel_id_from_handle(config['handle'])
                if channel_id:
                    CHANNELS[channel_key]['channel_id'] = channel_id
                else:
                    print(f"✗ Could not find channel: {config['handle']}")
                    continue
            
            # Check for new videos
            new_count = scraper.check_for_new_videos(channel_key, config)
            
            print()  # Blank line between channels
            
        except Exception as e:
            print(f"✗ Error processing {config['name']}: {e}\n")
    
    print(f"{'='*70}")
    print(f"Scraping complete!")
    print(f"{'='*70}\n")

def initial_full_scrape():
    """Perform initial full scrape of all channels"""
    print(f"\n{'='*70}")
    print(f"INITIAL FULL SCRAPE - Creating Complete Video Catalogs")
    print(f"{'='*70}\n")
    
    scraper = YouTubeChannelScraper(YOUTUBE_API_KEY)
    
    for channel_key, config in CHANNELS.items():
        try:
            # Get channel ID if not set
            channel_id = config['channel_id']
            if not channel_id:
                channel_id = scraper.get_channel_id_from_handle(config['handle'])
                if not channel_id:
                    print(f"✗ Could not find channel: {config['handle']}\n")
                    continue
                CHANNELS[channel_key]['channel_id'] = channel_id
            
            # Fetch full catalog
            catalog = scraper.get_full_channel_catalog(
                channel_id,
                config['name'],
                max_videos=500  # Get up to 500 videos
            )
            
            # Save catalog
            scraper.save_catalog(catalog, config['output_file'])
            
            print()  # Blank line between channels
            
        except Exception as e:
            print(f"✗ Error processing {config['name']}: {e}\n")
    
    print(f"{'='*70}")
    print(f"Initial scrape complete!")
    print(f"{'='*70}\n")

def run_scheduler():
    """Run the scheduler to check for new videos every 24 hours"""
    print(f"\n{'='*70}")
    print(f"YouTube Video Scheduler Started")
    print(f"{'='*70}")
    print(f"Checking for new videos every 24 hours")
    print(f"Press Ctrl+C to stop\n")
    
    # Schedule daily checks at 3 AM
    schedule.every().day.at("03:00").do(scrape_all_channels)
    
    # Also run immediately on start
    scrape_all_channels()
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--initial':
            # Run initial full scrape
            initial_full_scrape()
        elif sys.argv[1] == '--check':
            # Quick check for new videos
            scrape_all_channels()
        elif sys.argv[1] == '--schedule':
            # Run scheduler
            run_scheduler()
        else:
            print("Usage:")
            print("  python youtube_channel_scraper.py --initial    # Initial full scrape")
            print("  python youtube_channel_scraper.py --check      # Quick check for new videos")
            print("  python youtube_channel_scraper.py --schedule   # Run 24-hour scheduler")
    else:
        print("YouTube Channel Scraper")
        print("\nUsage:")
        print("  python youtube_channel_scraper.py --initial    # Initial full scrape of all channels")
        print("  python youtube_channel_scraper.py --check      # Quick check for new videos")
        print("  python youtube_channel_scraper.py --schedule   # Run automated 24-hour scheduler")
        print("\nConfigured Channels:")
        for key, config in CHANNELS.items():
            print(f"  - {config['name']} ({config['handle']})")
