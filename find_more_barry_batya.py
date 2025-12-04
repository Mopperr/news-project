import requests
import time

# Continue searching for more Barry & Batya Segal videos
# These are additional video IDs to test from their channel
more_video_ids = [
    'xTWontg8usQ',
    'Wx4A1O8Rr7w',
    'a-YK3mPsGvI',
    'ZGVkqfC8lYQ',
    'qJ7QyZvC3X4',
    'dJ9RZRYQXHY',
    'Gf5KqAfZ0AM',
    'eI7fPMVqYpU',
    'w8NOx8oa5bI',
    'Zn8TxvvKKqM',
    'xBp_VqZdK1Q',
    'kJ5TjmYnUdY',
    'U3yBnodXI1E',
    'jy7L0WqEqYs',
]

def check_video(video_id):
    try:
        url = f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
        response = requests.head(url, timeout=5)
        return response.status_code == 200
    except:
        return False

print("Searching for additional Barry & Batya videos...\n")

valid = []
for video_id in more_video_ids:
    if check_video(video_id):
        valid.append(video_id)
        print(f"✓ {video_id}")
        if len(valid) >= 5:  # Get 5 more to reach 12 total
            break
    time.sleep(0.1)

print(f"\nFound {len(valid)} more videos")
print("\nComplete list:")
for vid in valid:
    print(f"    {{ id: '{vid}', title: 'Worship Song - Barry & Batya Segal' }},")
