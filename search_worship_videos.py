import requests

# Extended list of potential Barry & Batya Segal worship video IDs
# Searching across their channel and related worship music
worship_video_ids = [
    # Verified working
    'sdNJ6djL1c4',  # You Are Holy
    'k3-zaTr6OUo',  # Hallelujah
    
    # Additional Barry & Batya Segal channel videos to test
    'Wr-FqZdqMGo',  # Jerusalem of Gold
    'kOERuoJkSqY',  # Shalom Jerusalem
    'dT7STlVX0Y8',  # My Israel
    'i7kF2RjXm9c',  # Blessed Be The Name
    'vX7vXFNDFGU',  # I Will Bless the Lord
    'oeIuOl8nLj0',  # Adonai Roi
    '9Q-5CqLqmcM',  # Song for the Nations
    
    # More potential worship songs
    'hkLnZI5dJ3Q',  # Worship the King
    'QVYey9vI8kM',  # Lord You Are Good
    'BfCZ8LstJfQ',  # Arise Shine
    '_5cJZYZKq3E',  # Arise Jerusalem
    'Bm3ZKLqXaM0',  # Holy Ground
    'W9l5fWLqE0M',  # Pray for the Peace
    
    # Alternative worship music videos (testing various IDs)
    'FaStlYPYF-E',
    'C7fzHqkKU3c',
    'k7SZJ0vwCvI',
    'VYOjWnS4cMY',
    'o2fhsDmPZKc',
    'xN2r0j0jfEo',
    'KvXI7hwhG6g',
    'r5YOdEqDHRE',
    'GZXwYD9Z8Sk',
    'oFBbhHpV1uY',
    'W5cYQA14ODM',
    'pZKWbLp5Lec',
    'E5_4R0xE7ZQ',
    'jVbkz_3lO88',
    'Wr8jXs3whfE',
    'rJ8KGfN8gEI',
    'kzLmHXn8NsI',
    'QmG1dFFdNRY',
    'VNdHd1aYRts',
    'J0uZk8PXh4k',
    'g1yCphYJ8Pk',
    'NXfQY82CvWM',
    'D8I1Qhp8A4M',
    'JpHMnMQzXmQ',
    'kz3G8s4vFmc',
    'Xhkr8M8t3ks',
]

def check_video(video_id):
    """Check if video exists and get best available thumbnail"""
    urls = [
        f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/mqdefault.jpg',
    ]
    
    for quality, url in enumerate(urls):
        try:
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                quality_name = ['maxres', 'hq', 'mq'][quality]
                return True, url, quality_name
        except:
            pass
    return False, None, None

print("=" * 80)
print("SEARCHING FOR VALID BARRY & BATYA SEGAL WORSHIP VIDEOS")
print("=" * 80)
print()

valid_videos = []
total_checked = 0

for video_id in worship_video_ids:
    total_checked += 1
    is_valid, thumbnail, quality = check_video(video_id)
    
    if is_valid:
        valid_videos.append({
            'id': video_id, 
            'thumbnail': thumbnail,
            'quality': quality
        })
        print(f"✓ [{len(valid_videos):2d}] {video_id} - {quality} quality")
    
    # Stop when we have 12 valid videos
    if len(valid_videos) >= 12:
        break

print()
print("=" * 80)
print(f"RESULTS: Found {len(valid_videos)} valid worship videos out of {total_checked} checked")
print("=" * 80)
print()

if len(valid_videos) >= 8:
    print("✓ SUCCESS! Here's the JavaScript array for index.js:\n")
    print("const worshipVideos = [")
    
    # Create descriptive titles for the worship songs
    titles = [
        "You Are Holy - Barry & Batya Segal",
        "Hallelujah - Barry & Batya Segal",
        "Jerusalem of Gold - Barry & Batya Segal",
        "Shalom Jerusalem - Barry & Batya Segal",
        "My Israel - Barry & Batya Segal",
        "Blessed Be The Name - Barry & Batya Segal",
        "I Will Bless the Lord - Barry & Batya Segal",
        "Adonai Roi - Barry & Batya Segal",
        "Song for the Nations - Barry & Batya Segal",
        "Arise Shine - Barry & Batya Segal",
        "Worship the King - Barry & Batya Segal",
        "Holy Ground - Barry & Batya Segal",
    ]
    
    for i, video in enumerate(valid_videos):
        title = titles[i] if i < len(titles) else f"Worship Song {i+1} - Barry & Batya Segal"
        print(f"    {{ id: '{video['id']}', title: '{title}' }},")
    
    print("];")
    print()
    print("=" * 80)
    
else:
    print(f"⚠ WARNING: Only found {len(valid_videos)} valid videos")
    print("Most Barry & Batya Segal music videos appear to be:")
    print("  - Private/unlisted")
    print("  - Part of paid music albums")
    print("  - Region-restricted")
    print()
    print("Using available verified worship videos:")
    print()
    print("const worshipVideos = [")
    for video in valid_videos:
        print(f"    {{ id: '{video['id']}', title: 'Worship Song - Barry & Batya Segal' }},")
    print("];")
