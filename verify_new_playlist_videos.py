import requests

# Extract video IDs from the URLs
video_ids = [
    'd2ILnGedg2g',  # Index 2
    'HeTDyo2FwKk',  # Index 3
    'klDrARxA8io',  # Index 4
    '9yDt8B170N4',  # Index 5
    'iTbXjRZANDo',  # Index 7
]

print("Verifying Barry & Batya Segal playlist videos...\n")
print("=" * 80)

verified = []

for i, video_id in enumerate(video_ids, 1):
    try:
        # Check if thumbnail exists
        url = f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'
        response = requests.head(url, timeout=5)
        
        if response.status_code == 200:
            verified.append(video_id)
            print(f"✓ Video {i}: {video_id} - Valid (maxres)")
        else:
            # Try hq quality
            url = f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                verified.append(video_id)
                print(f"✓ Video {i}: {video_id} - Valid (hq)")
            else:
                print(f"✗ Video {i}: {video_id} - Invalid/Private")
    except Exception as e:
        print(f"✗ Video {i}: {video_id} - Error: {e}")

print("\n" + "=" * 80)
print(f"\nVerified videos: {len(verified)}/{len(video_ids)}")

if verified:
    print("\n✓ Adding to worship videos array:\n")
    print("const worshipVideos = [")
    print("    { id: 'sdNJ6djL1c4', title: 'You Are Holy - Barry & Batya Segal' },")
    
    titles = [
        'Worship Song 2 - Barry & Batya Segal',
        'Worship Song 3 - Barry & Batya Segal',
        'Worship Song 4 - Barry & Batya Segal',
        'Worship Song 5 - Barry & Batya Segal',
        'Worship Song 6 - Barry & Batya Segal',
    ]
    
    for vid, title in zip(verified, titles):
        print(f"    {{ id: '{vid}', title: '{title}' }},")
    
    print("];")
