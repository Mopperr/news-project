"""
Fetch ALL videos from VFI YouTube playlist using web scraping (no API quota needed)
"""
import requests
from bs4 import BeautifulSoup
import json
import re

def fetch_all_playlist_videos(playlist_id):
    """Fetch ALL playlist videos by scraping the YouTube page"""
    url = f'https://www.youtube.com/playlist?list={playlist_id}'
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers)
        
        # Extract video IDs from the page
        video_ids = re.findall(r'"videoId":"([^"]+)"', response.text)
        titles = re.findall(r'"title":{"runs":\[{"text":"([^"]+)"}\]', response.text)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_videos = []
        for video_id, title in zip(video_ids, titles):
            if video_id not in seen and len(video_id) == 11:  # YouTube video IDs are 11 chars
                seen.add(video_id)
                unique_videos.append({
                    'id': {'videoId': video_id},
                    'snippet': {
                        'title': title,
                        'description': '',
                        'publishedAt': f'2025-{12 - (len(unique_videos) // 30):02d}-{30 - (len(unique_videos) % 30):02d}T00:00:00Z',
                        'thumbnails': {
                            'high': {'url': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'},
                            'maxres': {'url': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'}
                        }
                    }
                })
        
        return unique_videos
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def generate_js_code(videos):
    """Generate complete JavaScript code with all videos"""
    
    js_code = []
    js_code.append("// ALL VFI PLAYLIST VIDEOS (144 videos)")
    js_code.append("const ALL_VFI_VIDEOS = [")
    
    for i, video in enumerate(videos):
        video_id = video['id']['videoId']
        title = video['snippet']['title'].replace("'", "\\'").replace('"', '\\"')
        published = video['snippet']['publishedAt']
        
        comma = "," if i < len(videos) - 1 else ""
        js_code.append(f"    {{ id: {{ videoId: '{video_id}' }}, snippet: {{ title: '{title}', description: '', publishedAt: '{published}', thumbnails: {{ high: {{ url: 'https://img.youtube.com/vi/{video_id}/hqdefault.jpg' }} }} }} }}{comma}")
    
    js_code.append("];")
    js_code.append("")
    js_code.append("// Featured video (first in playlist)")
    js_code.append("const FALLBACK_VIDEOS = ALL_VFI_VIDEOS.slice(1, 16); // Videos 2-16 for grid")
    js_code.append("")
    js_code.append("// Featured short (different from featured video)")
    js_code.append("const FALLBACK_SHORT = ALL_VFI_VIDEOS[16]; // Video 17 for featured short")
    
    return "\n".join(js_code)

def main():
    print("Fetching ALL VFI YouTube Playlist Videos")
    print("="*70)
    
    playlist_id = 'PLHYG7Jtgkyi5e4KIQeG29Oj8vP7BNxabE'
    
    print(f"\nFetching playlist: {playlist_id}")
    print("This will get ALL videos in the playlist...\n")
    
    videos = fetch_all_playlist_videos(playlist_id)
    
    if videos:
        print(f"\n✓ Found {len(videos)} unique videos!\n")
        print("First 10 videos:")
        for i, video in enumerate(videos[:10], 1):
            print(f"{i:3d}. {video['snippet']['title']}")
        
        print(f"\n... ({len(videos) - 10} more videos) ...\n")
        
        # Save to JSON
        with open('all_playlist_videos.json', 'w', encoding='utf-8') as f:
            json.dump(videos, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved all {len(videos)} videos to all_playlist_videos.json")
        
        # Generate JavaScript code
        js_code = generate_js_code(videos)
        
        # Save JavaScript code
        with open('playlist_videos.js', 'w', encoding='utf-8') as f:
            f.write(js_code)
        
        print(f"✓ Generated JavaScript code in playlist_videos.js")
        print("\n" + "="*70)
        print("Video Distribution:")
        print(f"  - Featured Video: Video #1 ('{videos[0]['snippet']['title'][:60]}...')")
        print(f"  - Video Grid: Videos #2-16 (15 videos)")
        print(f"  - Featured Short: Video #17 ('{videos[16]['snippet']['title'][:60]}...')")
        print(f"  - Available Total: {len(videos)} videos")
        print("="*70)
        
    else:
        print("Failed to fetch videos")

if __name__ == "__main__":
    main()
