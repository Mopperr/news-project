import requests
import json

# Pexels API - Free high-quality stock photos
# Get your free API key from: https://www.pexels.com/api/
PEXELS_API_KEY = "563492ad6f91700001000001c4b6d6f9d4b5428f9c5e3b0c2f5f5b5a"  # Free demo key

def search_pexels(query, per_page=5):
    """Search Pexels for high-quality images"""
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": PEXELS_API_KEY
    }
    params = {
        "query": query,
        "per_page": per_page,
        "orientation": "landscape"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        print(f"\n=== {query.upper()} ===")
        images = []
        for i, photo in enumerate(data.get('photos', []), 1):
            img_url = photo['src']['large']
            photographer = photo['photographer']
            print(f"{i}. {img_url}")
            print(f"   By: {photographer}")
            images.append(img_url)
        
        return images
    except Exception as e:
        print(f"Error searching for '{query}': {e}")
        return []

def main():
    print("=" * 80)
    print("FINDING HIGH-QUALITY IMAGES FOR VFI MODALS")
    print("=" * 80)
    
    # Timeline searches - specific to VFI's mission
    timeline_searches = {
        "1994 - Foundation": "charity volunteers helping elderly people",
        "2000s - Storehouse": "food bank volunteers distributing supplies",
        "2010s - Building": "modern charity organization office teamwork",
        "Today": "volunteers helping community diverse group"
    }
    
    print("\n" + "=" * 80)
    print("TIMELINE IMAGES")
    print("=" * 80)
    
    timeline_results = {}
    for period, query in timeline_searches.items():
        images = search_pexels(query, per_page=3)
        if images:
            timeline_results[period] = images[0]  # Take the best match
    
    # Core Values searches
    values_searches = {
        "Integrity": "handshake trust honesty transparency",
        "Unity": "diverse people working together community",
        "Excellence": "professional volunteers helping people quality care",
        "Impact": "helping hands charity work transformation"
    }
    
    print("\n" + "=" * 80)
    print("CORE VALUES IMAGES")
    print("=" * 80)
    
    values_results = {}
    for value, query in values_searches.items():
        images = search_pexels(query, per_page=3)
        if images:
            values_results[value] = images[0]  # Take the best match
    
    # Print final recommendations
    print("\n" + "=" * 80)
    print("RECOMMENDED IMAGE URLS")
    print("=" * 80)
    
    print("\n--- TIMELINE IMAGES ---")
    for period, url in timeline_results.items():
        print(f"{period}:")
        print(f"  {url}")
    
    print("\n--- CORE VALUES IMAGES ---")
    for value, url in values_results.items():
        print(f"{value}:")
        print(f"  {url}")
    
    # Generate code snippet
    print("\n" + "=" * 80)
    print("JAVASCRIPT CODE SNIPPET TO UPDATE")
    print("=" * 80)
    
    print("""
// Timeline Images:
'1994': {
    image: '""" + timeline_results.get("1994 - Foundation", "") + """',
},
'2000s': {
    image: '""" + timeline_results.get("2000s - Storehouse", "") + """',
},
'2010s': {
    image: '""" + timeline_results.get("2010s - Building", "") + """',
},
'Today': {
    image: '""" + timeline_results.get("Today", "") + """',
}

// Value Images (in JavaScript handler):
if (valueKey === 'integrity') valueImage = '""" + values_results.get("Integrity", "") + """';
else if (valueKey === 'unity') valueImage = '""" + values_results.get("Unity", "") + """';
else if (valueKey === 'excellence') valueImage = '""" + values_results.get("Excellence", "") + """';
else if (valueKey === 'impact') valueImage = '""" + values_results.get("Impact", "") + """';
""")

if __name__ == "__main__":
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("Installing requests library...")
        import subprocess
        subprocess.check_call(["pip", "install", "requests"])
        import requests
    
    main()
