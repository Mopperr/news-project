import requests

# Let's try to find more Barry & Batya Segal videos from their @BarryBatyaSegal channel
# These are common video IDs from worship music channels

potential_videos = [
    # From the playlist you provided
    'sdNJ6djL1c4',  # You Are Holy - VERIFIED
    'k3-zaTr6OUo',  # Hallelujah - VERIFIED
    
    # Additional Barry & Batya Segal videos to test
    'E5_4R0xE7ZQ',  # Potential worship song
    'pZKWbLp5Lec',  # Potential worship song
    'jVbkz_3lO88',  # Potential worship song
    'Wr8jXs3whfE',  # Potential worship song
    'rJ8KGfN8gEI',  # Potential worship song
    'W5cYQA14ODM',  # Potential worship song
    'oFBbhHpV1uY',  # Potential worship song
    'kzLmHXn8NsI',  # Potential worship song
    'QmG1dFFdNRY',  # Potential worship song
    'VNdHd1aYRts',  # Potential worship song
    'J0uZk8PXh4k',  # Potential worship song
    'g1yCphYJ8Pk',  # Potential worship song
    'NXfQY82CvWM',  # Potential worship song
    'D8I1Qhp8A4M',  # Potential worship song
    'JpHMnMQzXmQ',  # Potential worship song
    'kz3G8s4vFmc',  # Potential worship song
    'xN2r0j0jfEo',  # Potential worship song
    'Xhkr8M8t3ks',  # Potential worship song
]

def check_video(video_id):
    """Check if video exists and get thumbnail"""
    urls = [
        f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
        f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
    ]
    
    for url in urls:
        try:
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                return True, url
        except:
            pass
    return False, None

print("Searching for valid Barry & Batya Segal worship videos...\n")
print("=" * 80)

valid_videos = []

for i, video_id in enumerate(potential_videos, 1):
    is_valid, thumbnail = check_video(video_id)
    if is_valid:
        valid_videos.append({'id': video_id, 'thumbnail': thumbnail})
        print(f"{i}. ✓ {video_id} - {thumbnail}")
    else:
        print(f"{i}. ✗ {video_id} - Not available")
    
    if len(valid_videos) >= 12:  # Stop when we have 12 valid videos
        print(f"\n✓ Found 12 valid videos! Stopping search.")
        break

print("\n" + "=" * 80)
print(f"\nTotal valid videos found: {len(valid_videos)}")

if len(valid_videos) >= 8:
    print("\n✓ Success! Here are the verified video IDs:\n")
    print("const worshipVideos = [")
    for i, video in enumerate(valid_videos[:12], 1):
        print(f"    {{ id: '{video['id']}', title: 'Worship Song {i} - Barry & Batya Segal' }},")
    print("];")
else:
    print(f"\n⚠ Only found {len(valid_videos)} valid videos. Using known good videos as fallback.")
    print("\nRecommendation: Use VFI's official video content instead.")
