"""
Fetch videos from VFI YouTube playlists
"""
import requests
import json

# API Configuration
YOUTUBE_API_KEY = 'AIzaSyBelWh3h-9xBSHXKN8oKMY3ieWpM6WaB0M'

# Playlist IDs
VIDEOS_PLAYLIST = 'PLHYG7Jtgkyi5e4KIQeG29Oj8vP7BNxabE'
SHORTS_PLAYLIST = 'PLHYG7Jtgkyi5e4KIQeG29Oj8vP7BNxabE'  # You mentioned the same playlist twice, please provide shorts playlist ID

def fetch_playlist_videos(playlist_id, max_results=10):
    """Fetch videos from a YouTube playlist"""
    url = f'https://www.googleapis.com/youtube/v3/playlistItems'
    params = {
        'key': YOUTUBE_API_KEY,
        'playlistId': playlist_id,
        'part': 'snippet,contentDetails',
        'maxResults': max_results,
        'order': 'date'
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'error' in data:
            print(f"API Error: {data['error']['message']}")
            return None
        
        videos = []
        for item in data.get('items', []):
            video = {
                'id': {
                    'videoId': item['contentDetails']['videoId']
                },
                'snippet': {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'publishedAt': item['snippet']['publishedAt'],
                    'thumbnails': item['snippet']['thumbnails'],
                    'channelTitle': item['snippet']['channelTitle']
                }
            }
            videos.append(video)
        
        return videos
        
    except Exception as e:
        print(f"Error fetching playlist: {e}")
        return None

def generate_javascript_code(videos, playlist_name):
    """Generate JavaScript code for the videos"""
    print(f"\n// {playlist_name}")
    print("const FALLBACK_VIDEOS = [")
    
    for video in videos[:10]:  # Limit to 10 videos
        video_id = video['id']['videoId']
        title = video['snippet']['title'].replace("'", "\\'")
        description = video['snippet']['description'][:100].replace("'", "\\'") if video['snippet']['description'] else ''
        published = video['snippet']['publishedAt']
        
        print(f"    {{")
        print(f"        id: {{ videoId: '{video_id}' }},")
        print(f"        snippet: {{")
        print(f"            title: '{title}',")
        print(f"            description: '{description}',")
        print(f"            publishedAt: '{published}',")
        print(f"            thumbnails: {{")
        print(f"                high: {{ url: 'https://img.youtube.com/vi/{video_id}/hqdefault.jpg' }}")
        print(f"            }}")
        print(f"        }}")
        print(f"    }},")
    
    print("];")

def main():
    print("Fetching VFI YouTube Playlists...")
    print("="*60)
    
    # Fetch videos playlist
    print("\n1. Fetching Videos Playlist...")
    videos = fetch_playlist_videos(VIDEOS_PLAYLIST, 15)
    
    if videos:
        print(f"   Found {len(videos)} videos")
        print("\n   First 5 videos:")
        for i, video in enumerate(videos[:5], 1):
            print(f"   {i}. {video['snippet']['title']}")
            print(f"      ID: {video['id']['videoId']}")
        
        # Generate JavaScript code
        generate_javascript_code(videos, "VFI Videos Playlist")
        
        # Save to file
        with open('playlist_videos.json', 'w', encoding='utf-8') as f:
            json.dump(videos, f, indent=2, ensure_ascii=False)
        print(f"\nSaved {len(videos)} videos to playlist_videos.json")
    else:
        print("   Failed to fetch videos")
    
    print("\n" + "="*60)
    print("\nNote: Please provide the correct Shorts playlist ID")
    print("Both playlist URLs you provided are the same.")

if __name__ == "__main__":
    main()
