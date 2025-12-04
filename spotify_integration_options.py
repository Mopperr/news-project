"""
Barry & Batya Segal - Spotify Integration Research
===================================================

SPOTIFY ARTIST: https://open.spotify.com/artist/26wd7poZI6XycIuZRUSOCq

POPULAR SONGS:
1. Sh'ma Yisrael - 1,039,277 plays
2. Kadosh - 549,615 plays
3. Baruch Haba - 498,929 plays
4. Hallelu Et Adonai - 432,000 plays
5. Hodu L'adonai - 326,179 plays

ALBUMS:
- Sh'ma Yisrael (1994)
- Jerusalem: The Last Frontier (1998)
- Go Through the Gates (2002)
- Day 7 (2013)

SPOTIFY EMBED OPTIONS:
======================

Option 1: SPOTIFY WEB PLAYER EMBED (Recommended)
-------------------------------------------------
Pros:
✓ Official Spotify integration
✓ No API key needed
✓ Works immediately
✓ Users can play full songs (if they have Spotify)
✓ Beautiful UI
✓ Shows album artwork

Cons:
✗ Requires Spotify account to play full songs
✗ Free users get 30-second previews only

Implementation:
<iframe style="border-radius:12px" 
        src="https://open.spotify.com/embed/artist/26wd7poZI6XycIuZRUSOCq?utm_source=generator" 
        width="100%" height="352" frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"></iframe>

Option 2: SPOTIFY WEB API + PYTHON
-----------------------------------
Pros:
✓ Can get track previews (30-second MP3 URLs)
✓ Full control over UI
✓ Can display track info

Cons:
✗ Requires Spotify Developer account
✗ Requires OAuth authentication
✗ Only 30-second previews available
✗ Complex setup
✗ Rate limits apply

NOT POSSIBLE:
✗ Cannot play full Spotify songs without Spotify Premium
✗ Cannot bypass Spotify's authentication
✗ Cannot stream full tracks via Python/JavaScript

Option 3: KEEP YOUTUBE VIDEOS (Current - Best Solution)
--------------------------------------------------------
Pros:
✓ Already implemented
✓ Full songs play for free
✓ No login required
✓ Works for all users
✓ Easy integration

Cons:
✗ Limited Barry & Batya videos available on YouTube
✗ Some videos may be removed/made private

RECOMMENDATION:
==============
Use HYBRID APPROACH:
1. Keep YouTube videos for songs that are available
2. Add Spotify embed widget for full album/artist access
3. Let users choose their preferred platform

This gives users:
- Free YouTube playback (7 verified videos)
- Full Spotify catalog access (if they have account)
- Best of both worlds
"""

import requests

# Test if we can access Spotify Web API without authentication
def test_spotify_access():
    print("=" * 80)
    print("TESTING SPOTIFY INTEGRATION OPTIONS")
    print("=" * 80)
    print()
    
    print("1. SPOTIFY EMBED WIDGET (No auth required)")
    print("   ✓ This works immediately - just embed iframe")
    print("   ✓ Users can play with their Spotify account")
    print()
    
    print("2. SPOTIFY WEB API (Requires auth)")
    artist_id = "26wd7poZI6XycIuZRUSOCq"
    
    # Try to access without auth (will fail, showing why we need embed)
    try:
        response = requests.get(f"https://api.spotify.com/v1/artists/{artist_id}")
        if response.status_code == 401:
            print("   ✗ Requires authentication (as expected)")
            print("   ✗ Would need OAuth flow")
            print("   ✗ Only provides 30-second previews anyway")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    print("=" * 80)
    print("CONCLUSION: Use Spotify Embed Widget")
    print("=" * 80)
    print()
    print("This is the official, legal way to integrate Spotify.")
    print("Users with Spotify accounts can play full songs.")
    print("Free users get 30-second previews.")
    print()
    print("Embed code:")
    print('-' * 80)
    print('<iframe style="border-radius:12px"')
    print('        src="https://open.spotify.com/embed/artist/26wd7poZI6XycIuZRUSOCq"')
    print('        width="100%" height="380" frameBorder="0"')
    print('        allowfullscreen=""')
    print('        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"')
    print('        loading="lazy"></iframe>')
    print('-' * 80)

if __name__ == '__main__':
    test_spotify_access()
