import requests

# Curated list of worship music videos about Israel, Jerusalem, and related themes
# These are publicly available worship songs that align with VFI's mission
worship_videos_to_test = [
    # Barry & Batya Segal (verified)
    ('sdNJ6djL1c4', 'You Are Holy - Barry & Batya Segal'),
    ('k3-zaTr6OUo', 'Hallelujah - Barry & Batya Segal'),
    ('VYOjWnS4cMY', 'Worship Song - Barry & Batya Segal'),
    
    # Jerusalem/Israel themed worship songs (popular Christian worship)
    ('C7fzHqkKU3c', 'Jerusalem - Paul Wilbur'),
    ('k7SZJ0vwCvI', 'Shalom Jerusalem - Paul Wilbur'),
    ('FaStlYPYF-E', 'Baruch Adonai - Paul Wilbur'),
    ('o2fhsDmPZKc', 'Days of Elijah - Robin Mark'),
    ('KvXI7hwhG6g', 'Pray for the Peace of Jerusalem'),
    ('r5YOdEqDHRE', 'The Lord Bless You and Keep You'),
    ('GZXwYD9Z8Sk', 'Aaronic Blessing - Messianic Worship'),
    ('oFBbhHpV1uY', 'Hineh Mah Tov - How Good It Is'),
    ('W5cYQA14ODM', 'Adonai Roi - The Lord is My Shepherd'),
    
    # Additional worship songs
    ('2sZy8uHJ3r4', 'Shalom - Israel Worship'),
    ('p9DXmqDp3nw', 'Jerusalem Praise'),
    ('VuNIsY6JdUw', 'Israel My Glory'),
    ('ckgbZXXJ4s4', 'Messianic Worship'),
    ('JGUWbIvKR3g', 'Pray for Israel'),
]

def verify_video(video_id):
    """Verify video exists with thumbnail"""
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
            continue
    return False, None

print("=" * 80)
print("VERIFYING WORSHIP MUSIC VIDEOS FOR VFI WEBSITE")
print("=" * 80)
print()

verified_videos = []

for video_id, title in worship_videos_to_test:
    is_valid, thumbnail = verify_video(video_id)
    
    if is_valid:
        verified_videos.append({'id': video_id, 'title': title})
        print(f"✓ [{len(verified_videos):2d}] {title}")
        print(f"    ID: {video_id}")
    
    if len(verified_videos) >= 12:
        break

print()
print("=" * 80)
print(f"TOTAL VERIFIED VIDEOS: {len(verified_videos)}")
print("=" * 80)
print()

if verified_videos:
    print("JavaScript array for index.js:\n")
    print("const worshipVideos = [")
    for video in verified_videos:
        print(f"    {{ id: '{video['id']}', title: '{video['title']}' }},")
    print("];")
    print()
else:
    print("⚠ No videos could be verified")
