import requests
import json

# YouTube Data API Configuration
API_KEY = 'AIzaSyBelWh3h-9xBSHXKN8oKMY3ieWpM6WaB0M'
PLAYLIST_ID = 'OLAK5uy_kaPKz7Wq1DtJXMMox_BurQpXZG-jLB-XU'

def fetch_playlist_videos():
    """Fetch all videos from the Barry & Batya Segal worship playlist"""
    url = 'https://www.googleapis.com/youtube/v3/playlistItems'
    
    params = {
        'part': 'snippet',
        'playlistId': PLAYLIST_ID,
        'maxResults': 50,
        'key': API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        videos = []
        for item in data.get('items', []):
            snippet = item['snippet']
            video_id = snippet['resourceId']['videoId']
            title = snippet['title']
            
            videos.append({
                'id': video_id,
                'title': title
            })
        
        print(f"\nFound {len(videos)} videos in Barry & Batya Segal worship playlist:\n")
        print("const worshipVideos = [")
        for video in videos:
            # Clean up title - remove extra info if present
            clean_title = video['title'].strip()
            print(f"    {{ id: '{video['id']}', title: '{clean_title}' }},")
        print("];")
        
        return videos
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching playlist: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return []

if __name__ == '__main__':
    videos = fetch_playlist_videos()
    print(f"\n\nTotal videos found: {len(videos)}")
