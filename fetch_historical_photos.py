"""
Fetch historical photos related to VFI's founding story and 1990s Israel
This script searches for relevant images using web scraping techniques
"""

import requests
from bs4 import BeautifulSoup
import urllib.parse
import json
import os
import time

def fetch_unsplash_images(query, count=3):
    """Fetch images from Unsplash API (free, high-quality)"""
    # Unsplash provides free high-quality images
    search_url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page={count}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            images = []
            for result in data.get('results', [])[:count]:
                images.append({
                    'url': result['urls']['regular'],
                    'thumb': result['urls']['small'],
                    'description': result.get('description', '') or result.get('alt_description', ''),
                    'photographer': result['user']['name'],
                    'source': 'Unsplash'
                })
            return images
    except Exception as e:
        print(f"Error fetching from Unsplash: {e}")
    
    return []

def fetch_pexels_images(query, count=3):
    """Fetch images from Pexels (free stock photos)"""
    # Note: Pexels requires API key for production use
    # For now, we'll use placeholder approach
    search_url = f"https://www.pexels.com/search/{urllib.parse.quote(query)}/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            images = []
            
            # Find image elements (Pexels uses specific structure)
            for img in soup.find_all('img', limit=count):
                src = img.get('src', '')
                if 'images.pexels.com' in src:
                    images.append({
                        'url': src,
                        'thumb': src,
                        'description': img.get('alt', ''),
                        'source': 'Pexels'
                    })
            
            return images[:count]
    except Exception as e:
        print(f"Error fetching from Pexels: {e}")
    
    return []

def get_placeholder_image(topic, width=800, height=600):
    """Generate placeholder image URL"""
    return f"https://placehold.co/{width}x{height}/2c3e50/f8f9fa?text={urllib.parse.quote(topic)}"

def fetch_story_images():
    """Fetch images for different parts of the VFI story"""
    
    story_sections = {
        'vision': {
            'query': 'israel jerusalem sunset prayer',
            'fallback': 'Prophetic Vision',
            'alt': 'Barry Segal receiving vision in Israel'
        },
        'ministry': {
            'query': 'helping elderly people charity',
            'fallback': 'Ministry Beginning',
            'alt': 'Reaching out to poor and needy families'
        },
        'tragedy': {
            'query': 'memorial candles remembrance',
            'fallback': 'Tragedy and Loss',
            'alt': 'Remembering victims of terrorism'
        },
        'response': {
            'query': 'volunteers helping community',
            'fallback': 'Compassionate Response',
            'alt': 'Assisting families affected by terrorism'
        }
    }
    
    results = {}
    
    for section_key, section_data in story_sections.items():
        print(f"Fetching images for: {section_key}")
        
        # Try Unsplash first
        images = fetch_unsplash_images(section_data['query'], count=1)
        
        # Try Pexels if Unsplash fails
        if not images:
            images = fetch_pexels_images(section_data['query'], count=1)
        
        # Use placeholder if all fail
        if not images:
            images = [{
                'url': get_placeholder_image(section_data['fallback']),
                'thumb': get_placeholder_image(section_data['fallback'], 400, 300),
                'description': section_data['fallback'],
                'source': 'Placeholder'
            }]
        
        results[section_key] = images[0] if images else {
            'url': get_placeholder_image(section_data['fallback']),
            'description': section_data['fallback'],
            'alt': section_data['alt']
        }
        
        time.sleep(0.5)  # Be respectful to servers
    
    return results

def save_results(results):
    """Save results to JSON file"""
    output_file = 'historical_photos.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nResults saved to {output_file}")
    return output_file

if __name__ == "__main__":
    print("Fetching historical photos for VFI story...\n")
    
    results = fetch_story_images()
    
    print("\n" + "="*60)
    print("RESULTS:")
    print("="*60)
    
    for section, data in results.items():
        print(f"\n{section.upper()}:")
        print(f"  URL: {data['url'][:80]}...")
        print(f"  Description: {data.get('description', 'N/A')}")
        print(f"  Source: {data.get('source', 'Unknown')}")
    
    output_file = save_results(results)
    print(f"\n✅ Images ready! Use {output_file} to populate the modal.")
