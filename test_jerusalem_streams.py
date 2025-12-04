import requests

# Test several Jerusalem live stream video IDs
jerusalem_streams = [
    ('BHAy74Z7vY8', 'Original - Jerusalem Old City Live'),
    ('1-iS7LArMPA', 'Jerusalem Western Wall Live'),
    ('sNxxbfGvcKU', 'Jerusalem Live Camera'),
    ('gJ2JJxw8fJI', 'Israel Jerusalem Live Stream'),
    ('DDU-rZs-Ic4', 'Jerusalem Kotel Live'),
    ('q8tZKCLPbYY', 'Western Wall Plaza Live'),
    ('wCcMcaiRbhM', 'Jerusalem Live Feed'),
]

print("Testing Jerusalem live stream videos...\n")
print("=" * 80)

working_streams = []

for video_id, description in jerusalem_streams:
    try:
        # Check if thumbnail exists (indicates video is available)
        url = f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
        response = requests.head(url, timeout=5)
        
        if response.status_code == 200:
            working_streams.append((video_id, description))
            print(f"✓ {video_id} - {description}")
        else:
            print(f"✗ {video_id} - {description} (Not available)")
    except Exception as e:
        print(f"✗ {video_id} - Error: {e}")

print("\n" + "=" * 80)
print(f"\nWorking streams found: {len(working_streams)}")

if working_streams:
    print("\n✓ Best replacement video:")
    print(f"   ID: {working_streams[0][0]}")
    print(f"   Description: {working_streams[0][1]}")
    print(f"\n   Embed URL:")
    print(f"   https://www.youtube.com/embed/{working_streams[0][0]}?autoplay=1&mute=1&controls=0&loop=1&playlist={working_streams[0][0]}")
else:
    print("\n⚠ No working live streams found")
    print("Jerusalem live streams may be temporarily unavailable.")
    print("Recommendation: Use a static image or webcam snapshot instead.")
