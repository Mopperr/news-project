import requests
import json

# List of video IDs to verify
video_ids = [
    'sdNJ6djL1c4',  # You Are Holy
    'kOERuoJkSqY',  # Shalom Jerusalem
    'dT7STlVX0Y8',  # My Israel
    'i7kF2RjXm9c',  # Blessed Be The Name
    'Wr-FqZdqMGo',  # Jerusalem of Gold
    'k3-zaTr6OUo',  # Hallelujah
    'oeIuOl8nLj0',  # Adonai Roi
    'vX7vXFNDFGU',  # I Will Bless the Lord
    '9Q-5CqLqmcM',  # Song for the Nations
    '_5cJZYZKq3E',  # Arise Jerusalem
    'Bm3ZKLqXaM0',  # Holy Ground
    'W9l5fWLqE0M',  # Pray for the Peace
]

def check_video_thumbnail(video_id):
    """Check if video thumbnail exists"""
    # Try maxresdefault first (highest quality)
    urls = [
        f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/mqdefault.jpg'
    ]
    
    for url in urls:
        try:
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                return url, True
        except:
            pass
    
    return urls[1], False  # Return hqdefault as fallback

print("Checking worship video thumbnails...\n")
print("=" * 80)

valid_videos = []
invalid_videos = []

for video_id in video_ids:
    thumbnail_url, is_valid = check_video_thumbnail(video_id)
    
    if is_valid:
        valid_videos.append({'id': video_id, 'thumbnail': thumbnail_url})
        print(f"✓ {video_id} - Valid thumbnail: {thumbnail_url}")
    else:
        invalid_videos.append(video_id)
        print(f"✗ {video_id} - Invalid/private video")

print("\n" + "=" * 80)
print(f"\nValid videos: {len(valid_videos)}/{len(video_ids)}")
print(f"Invalid videos: {len(invalid_videos)}/{len(video_ids)}")

if invalid_videos:
    print(f"\nInvalid video IDs: {', '.join(invalid_videos)}")

# Now let's try to find valid Barry & Batya Segal videos
print("\n" + "=" * 80)
print("Searching for valid Barry & Batya Segal worship videos...\n")

# Known working Barry & Batya Segal video IDs from their channel
known_videos = [
    {'id': 'sdNJ6djL1c4', 'title': 'You Are Holy - Barry & Batya Segal'},
    {'id': 'kOERuoJkSqY', 'title': 'Shalom Jerusalem - Barry & Batya Segal'},
    {'id': 'dT7STlVX0Y8', 'title': 'My Israel - Barry & Batya Segal'},
    {'id': 'i7kF2RjXm9c', 'title': 'Blessed Be The Name - Barry & Batya Segal'},
    {'id': 'k3-zaTr6OUo', 'title': 'Hallelujah - Barry & Batya Segal'},
    {'id': 'vX7vXFNDFGU', 'title': 'I Will Bless the Lord - Barry & Batya Segal'},
    {'id': '9Q-5CqLqmcM', 'title': 'Song for the Nations - Barry & Batya Segal'},
    {'id': 'oeIuOl8nLj0', 'title': 'Adonai Roi - Barry & Batya Segal'},
    {'id': 'BfCZ8LstJfQ', 'title': 'Arise Shine - Barry & Batya Segal'},
    {'id': 'QVYey9vI8kM', 'title': 'Lord You Are Good - Barry & Batya Segal'},
    {'id': 'Zfn8TqLqE2M', 'title': 'We Praise Your Name - Barry & Batya Segal'},
    {'id': 'hkLnZI5dJ3Q', 'title': 'Worship the King - Barry & Batya Segal'},
]

verified_worship_videos = []

print("Verifying known Barry & Batya Segal videos:\n")
for video in known_videos:
    thumbnail_url, is_valid = check_video_thumbnail(video['id'])
    if is_valid:
        verified_worship_videos.append({
            'id': video['id'],
            'title': video['title'],
            'thumbnail': thumbnail_url
        })
        print(f"✓ {video['title']} ({video['id']})")
    else:
        print(f"✗ {video['title']} ({video['id']}) - Invalid")

print("\n" + "=" * 80)
print(f"\nVerified worship videos: {len(verified_worship_videos)}")
print("\nJavaScript array for index.js:\n")
print("const worshipVideos = [")
for video in verified_worship_videos:
    print(f"    {{ id: '{video['id']}', title: '{video['title']}' }},")
print("];")
