import requests

# Check the Baruch Haba video thumbnail
video_id = 'HeTDyo2FwKk'

print(f"Checking thumbnails for video: {video_id}\n")
print("=" * 80)

thumbnail_urls = [
    (f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg', 'maxresdefault (1280x720)'),
    (f'https://img.youtube.com/vi/{video_id}/sddefault.jpg', 'sddefault (640x480)'),
    (f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg', 'hqdefault (480x360)'),
    (f'https://img.youtube.com/vi/{video_id}/mqdefault.jpg', 'mqdefault (320x180)'),
    (f'https://img.youtube.com/vi/{video_id}/default.jpg', 'default (120x90)'),
]

working_thumbnails = []

for url, quality in thumbnail_urls:
    try:
        response = requests.head(url, timeout=5)
        if response.status_code == 200:
            print(f"✓ {quality}")
            print(f"  URL: {url}")
            working_thumbnails.append((url, quality))
        else:
            print(f"✗ {quality} - Status: {response.status_code}")
    except Exception as e:
        print(f"✗ {quality} - Error: {e}")

print("\n" + "=" * 80)
if working_thumbnails:
    print(f"\n✓ Working thumbnails found: {len(working_thumbnails)}")
    print(f"\nBest quality: {working_thumbnails[0][1]}")
    print(f"URL: {working_thumbnails[0][0]}")
else:
    print("\n✗ No working thumbnails found - video may be private/unavailable")
