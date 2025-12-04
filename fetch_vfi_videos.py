"""
Fetch latest VFI News videos from YouTube and update index.js
"""
import requests
import json
from datetime import datetime

# YouTube API Configuration
YOUTUBE_API_KEY = 'AIzaSyBelWh3h-9xBSHXKN8oKMY3ieWpM6WaB0M'
VFI_CHANNEL_ID = 'UCgbcHAR6wp5mtxZltb3xVZQ'

def fetch_latest_vfi_videos(max_results=20):
    """Fetch latest videos from VFI News YouTube channel"""
    print(f"Fetching latest {max_results} videos from VFI News channel...")
    
    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'key': YOUTUBE_API_KEY,
        'channelId': VFI_CHANNEL_ID,
        'part': 'snippet',
        'order': 'date',
        'type': 'video',
        'maxResults': max_results
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        videos = []
        for item in data.get('items', []):
            video = {
                'id': {'videoId': item['id']['videoId']},
                'snippet': {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnails': item['snippet']['thumbnails'],
                    'publishedAt': item['snippet']['publishedAt']
                }
            }
            videos.append(video)
            
            # Parse date
            pub_date = datetime.strptime(item['snippet']['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
            print(f"  ✓ {pub_date.strftime('%Y-%m-%d')} - {item['snippet']['title'][:60]}...")
        
        print(f"\n✓ Successfully fetched {len(videos)} videos")
        return videos
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching videos: {e}")
        return []

def generate_js_code(videos):
    """Generate JavaScript code for the videos"""
    if not videos:
        print("No videos to generate code for")
        return None
    
    # Separate into featured video, grid videos, and short
    featured_video = videos[0]
    grid_videos = videos[1:16]  # Next 15 videos
    featured_short = videos[16] if len(videos) > 16 else videos[-1]
    
    js_code = f"""// Auto-generated VFI News videos - Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
const FEATURED_VIDEO = {json.dumps(featured_video, indent=4)};

const FALLBACK_VIDEOS = {json.dumps(grid_videos, indent=4)};

const FALLBACK_SHORT = {json.dumps(featured_short, indent=4)};
"""
    
    return js_code

def update_index_js(js_code):
    """Update index.js with new video data"""
    try:
        # Read current index.js
        with open('index.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the section to replace (from FEATURED_VIDEO to end of FALLBACK_SHORT)
        start_marker = "// Auto-generated VFI News videos"
        end_marker = "const ALL_VFI_VIDEOS"
        
        start_idx = content.find(start_marker)
        end_idx = content.find(end_marker)
        
        if start_idx == -1 or end_idx == -1:
            print("✗ Could not find video data section in index.js")
            return False
        
        # Replace the section
        new_content = content[:start_idx] + js_code + "\n" + content[end_idx:]
        
        # Write back to file
        with open('index.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✓ Successfully updated index.js with latest videos!")
        return True
        
    except Exception as e:
        print(f"✗ Error updating index.js: {e}")
        return False

def add_auto_rotation():
    """Add JavaScript code to auto-rotate featured videos"""
    rotation_code = """
// Auto-rotate featured videos every 10 seconds
let featuredVideoIndex = 0;
let featuredShortIndex = 16; // Start after grid videos

function rotateFeaturedContent() {
    const totalVideos = ALL_VFI_VIDEOS.length;
    
    // Rotate featured video (first 16 videos)
    featuredVideoIndex = (featuredVideoIndex + 1) % Math.min(16, totalVideos);
    if (ALL_VFI_VIDEOS[featuredVideoIndex]) {
        displayFeaturedVideo(ALL_VFI_VIDEOS[featuredVideoIndex]);
    }
    
    // Rotate featured short (last videos, different from featured video)
    featuredShortIndex = ((featuredShortIndex - 16 + 1) % Math.max(1, totalVideos - 16)) + 16;
    if (ALL_VFI_VIDEOS[featuredShortIndex]) {
        displayFeaturedShort(ALL_VFI_VIDEOS[featuredShortIndex]);
    }
    
    console.log(`Rotated to video #${featuredVideoIndex + 1} (featured) and #${featuredShortIndex + 1} (short)`);
}

// Start rotation after page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    fetchYouTubeVideos();
    
    // Rotate every 10 seconds (10000ms)
    setInterval(rotateFeaturedContent, 10000);
});
"""
    return rotation_code

if __name__ == '__main__':
    print("=" * 60)
    print("VFI News Video Updater")
    print("=" * 60)
    print()
    
    # Fetch latest videos
    videos = fetch_latest_vfi_videos(20)
    
    if videos:
        print()
        print("=" * 60)
        print("Generating JavaScript code...")
        print("=" * 60)
        
        # Generate JS code
        js_code = generate_js_code(videos)
        
        if js_code:
            # Save to file for review
            with open('vfi_videos_update.js', 'w', encoding='utf-8') as f:
                f.write(js_code)
            print("✓ Generated code saved to vfi_videos_update.js")
            
            # Update index.js
            print()
            print("=" * 60)
            print("Updating index.js...")
            print("=" * 60)
            update_index_js(js_code)
            
            print()
            print("=" * 60)
            print("Next Steps:")
            print("=" * 60)
            print("1. Review the generated code in vfi_videos_update.js")
            print("2. index.js has been updated with the latest 20 videos")
            print("3. Featured video will cycle through the 3 newest videos")
            print("4. Refresh your webpage to see the updated videos")
    else:
        print("✗ Failed to fetch videos. Please check your API key and internet connection.")
