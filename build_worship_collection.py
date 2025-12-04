import requests
import time

# Expanded collection of worship music videos
# Focus on Messianic, Israel-focused, and general worship songs
worship_collection = [
    # Barry & Batya Segal - VERIFIED
    ('sdNJ6djL1c4', 'You Are Holy - Barry & Batya Segal'),
    ('k3-zaTr6OUo', 'Hallelujah - Barry & Batya Segal'),
    ('VYOjWnS4cMY', 'Blessed Be Your Name - Barry & Batya Segal'),
    ('VuNIsY6JdUw', 'Israel My Glory - Messianic Worship'),
    
    # Paul Wilbur - Messianic worship leader
    ('h_qHfD9WOaw', 'Days of Elijah - Paul Wilbur'),
    ('3d4xXvF2ukY', 'Baruch Adonai - Paul Wilbur'),
    ('7L1Ox2v7pR4', 'Shalom Jerusalem - Paul Wilbur'),
    ('2HQwV5grPYI', 'Lion of Judah - Paul Wilbur'),
    
    # General worship - Israel themed
    ('o2fhsDmPZKc', 'Days of Elijah - Robin Mark'),
    ('VNdHd1aYRts', 'Pray for the Peace of Jerusalem'),
    ('oyFQHFfKL0w', 'Hineh Ma Tov - How Good and Pleasant'),
    ('3Bqvp3vJYkk', 'Shalom Aleichem'),
    
    # Messianic praise
    ('a_tSPKfxj7I', 'Kadosh - Holy'),
    ('lskPjJk1Zt8', 'Adonai Roi - The Lord My Shepherd'),
    ('F4cLh-5w7M4', 'Messianic Praise Dance'),
    ('DXDOrYr3pY4', 'Hava Nagila - Israeli Dance'),
    
    # Popular worship songs
    ('447yaU_4DF8', 'How Great Is Our God'),
    ('yIeTmUJEI5E', 'Goodness of God'),
    ('C7fzHqkKU3c', 'Amazing Grace'),
    ('DXDGE_lRI0E', 'What A Beautiful Name'),
    
    # More Messianic worship
    ('JPr-UJuxWz4', 'L\'chi Lach - Come With Me'),
    ('RkZkekS8NQU', 'Hine Ma Tov'),
    ('fTcYouZMjRw', 'Shalom Rav - Abundant Peace'),
    ('S-vTmOZcjvU', 'Oseh Shalom - Make Peace'),
]

def check_video(video_id):
    """Check if video is available"""
    try:
        url = f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
        response = requests.head(url, timeout=5)
        return response.status_code == 200
    except:
        return False

print("=" * 90)
print(" " * 20 + "BUILDING WORSHIP MUSIC COLLECTION")
print("=" * 90)
print()

verified = []
failed = []

for video_id, title in worship_collection:
    is_valid = check_video(video_id)
    
    if is_valid:
        verified.append({'id': video_id, 'title': title})
        status = "✓"
        print(f"{status} [{len(verified):2d}] {title[:65]}")
    else:
        failed.append({'id': video_id, 'title': title})
        status = "✗"
    
    time.sleep(0.1)  # Be respectful to servers
    
    if len(verified) >= 12:
        print(f"\n✓ Found 12 videos! Stopping search.\n")
        break

print()
print("=" * 90)
print(f"RESULTS: {len(verified)} verified | {len(failed)} failed")
print("=" * 90)
print()

if len(verified) >= 8:
    print("✓ SUCCESS! Here's the hardcoded worship videos for index.js:\n")
    print("// Load Worship Music Videos")
    print("async function loadWorshipMusic() {")
    print("    // Verified worship music - hardcoded for reliability")
    print("    const worshipVideos = [")
    for video in verified:
        print(f"        {{ id: '{video['id']}', title: '{video['title']}' }},")
    print("    ];")
    print()
else:
    print(f"⚠ Only found {len(verified)} valid videos")
    print("\nStill usable, here's the code:\n")
    print("const worshipVideos = [")
    for video in verified:
        print(f"    {{ id: '{video['id']}', title: '{video['title']}' }},")
    print("];")
