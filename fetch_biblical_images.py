import requests
import json
import time
from urllib.parse import quote

# Unsplash API Credentials
UNSPLASH_ACCESS_KEY = 'pLzB1lLkXQ6JFUXEIyMx6Yg4LWWE1WLeNN71kPNSCjE'

# Curated high-quality image collections (direct Unsplash URLs)
CURATED_IMAGES = {
    'timeline_1994': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',  # Mountain vision/prophecy
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',  # Mountain landscape
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',  # Scenic landscape
    ],
    'timeline_2000s': [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',  # Warehouse/storage
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',  # Food distribution
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',  # Helping hands
    ],
    'timeline_2010s': [
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',  # Modern building
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',  # Modern architecture
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',  # Corporate building
    ],
    'timeline_today': [
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',  # Community helping
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',  # Volunteers together
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',  # Diverse people
    ],
    'integrity_warriors': [
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',  # Warrior statue
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',  # Shield/armor
        'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800',  # Strength/warrior
    ],
    'unity_believers': [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',  # People united
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',  # Hands together
        'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800',  # Community circle
    ],
    'excellence_craftsmanship': [
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',  # Craftsman working
        'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',  # Woodworking
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',  # Craftsmanship
    ],
    'impact_transformation': [
        'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800',  # Sunrise/hope
        'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800',  # Breakthrough light
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',  # Helping/transformation
    ],
    'faith_strength': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',  # Mountain summit
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',  # Mountain peak
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',  # Victory/reaching
    ]
}

def fetch_unsplash_images(query, count=5):
    """Fetch images from Unsplash using official API"""
    try:
        # Official Unsplash API endpoint
        search_url = f"https://api.unsplash.com/search/photos?query={quote(query)}&per_page={count}&orientation=landscape"
        
        headers = {
            'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}',
            'Accept-Version': 'v1'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        
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
        
        if images:
            print(f"  ✅ Found {len(images)} images from Unsplash")
        
        return images
            
    except requests.exceptions.HTTPError as e:
        print(f"  ❌ HTTP Error from Unsplash: {e.response.status_code}")
        return []
    except Exception as e:
        print(f"  ❌ Error fetching from Unsplash: {str(e)}")
        return []

def fetch_pexels_images(query, count=5):
    """Fetch images from Pexels as backup"""
    try:
        search_url = f"https://www.pexels.com/search/{quote(query)}/"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Simple parsing for Pexels image URLs
            import re
            pattern = r'https://images\.pexels\.com/photos/\d+/[^"]+\.jpeg\?[^"]*w=\d+'
            matches = re.findall(pattern, response.text)
            
            images = []
            for url in matches[:count]:
                images.append({
                    'url': url,
                    'source': 'Pexels'
                })
            
            return images
        else:
            return []
            
    except Exception as e:
        print(f"Error fetching from Pexels for '{query}': {str(e)}")
        return []

def get_placeholder_image(topic, width=800, height=500):
    """Generate placeholder image URL"""
    return f"https://placehold.co/{width}x{height}/1e3a8a/ffffff?text={quote(topic)}"

# Comprehensive biblical and inspirational image queries
biblical_image_queries = {
    # Timeline Images
    'timeline_1994': [
        'ancient scroll prophecy',
        'biblical vision prophet',
        'jewish scripture scroll',
        'ancient israel landscape',
        'spiritual vision light'
    ],
    'timeline_2000s': [
        'warehouse food distribution',
        'charity volunteers helping',
        'community food bank',
        'warehouse shelves supplies',
        'humanitarian aid distribution'
    ],
    'timeline_2010s': [
        'modern israel building architecture',
        'jerusalem modern skyline',
        'israel headquarters building',
        'modi\'in israel city',
        'contemporary israel architecture'
    ],
    'timeline_today': [
        'diverse community helping hands',
        'volunteers serving community',
        'people helping elderly',
        'humanitarian aid workers',
        'community service volunteers'
    ],
    
    # Core Values Images - Biblical Warriors and Faith
    'integrity_warriors': [
        'warrior armor shield biblical',
        'knight armor shield faith',
        'biblical warrior standing strong',
        'armor of god warrior',
        'ancient warrior shield protection'
    ],
    'unity_believers': [
        'people joining hands unity circle',
        'diverse believers together worship',
        'community unity hands together',
        'believers praying together',
        'multicultural unity community'
    ],
    'excellence_craftsmanship': [
        'artisan craftsmanship hands working',
        'skilled craftsman woodworking',
        'builder constructing excellence',
        'master craftsman creating',
        'excellence quality workmanship'
    ],
    'impact_transformation': [
        'sunrise breakthrough light hope',
        'helping hands compassion serving',
        'transformation breakthrough moment',
        'hope light darkness breakthrough',
        'community transformation change'
    ],
    
    # Additional faith-inspiring images
    'faith_strength': [
        'mountain climber reaching summit victory',
        'strong hands prayer faith',
        'believer raising hands worship',
        'faith courage strength warrior',
        'spiritual warrior standing firm'
    ]
}

def fetch_all_biblical_images():
    """Fetch all biblical and inspirational images"""
    all_results = {}
    
    print("🔍 Starting comprehensive biblical image search...")
    print("=" * 60)
    
    for category, queries in biblical_image_queries.items():
        print(f"\n📸 Fetching images for category: {category}")
        category_images = []
        
        # First, try to use curated images if available
        if category in CURATED_IMAGES:
            print(f"  ✅ Using curated high-quality Unsplash images")
            for url in CURATED_IMAGES[category]:
                category_images.append({
                    'url': url,
                    'thumb': url.replace('?w=800', '?w=400'),
                    'description': f'Curated image for {category}',
                    'photographer': 'Unsplash',
                    'source': 'Unsplash (Curated)'
                })
        
        # Then supplement with API search for variety
        for query in queries[:2]:  # Only first 2 queries to avoid rate limits
            print(f"  → Searching: '{query}'")
            
            # Try Unsplash API
            images = fetch_unsplash_images(query, count=2)
            
            # If Unsplash fails, try Pexels
            if not images:
                print(f"  ⚠️  Unsplash API unavailable, using curated collection")
            else:
                category_images.extend(images)
            
            # Rate limiting
            time.sleep(0.5)
        
        # Ensure we have at least some images
        if not category_images:
            print(f"  ⚠️  Using placeholder for {category}")
            category_images = [{
                'url': get_placeholder_image(category),
                'source': 'Placeholder'
            }]
        
        all_results[category] = category_images
        print(f"  ✅ Total: {len(category_images)} images for {category}")
    
    return all_results

def save_results_to_file(results):
    """Save results to JSON file"""
    output_file = 'biblical_images.json'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Results saved to {output_file}")
    return output_file

def generate_html_reference():
    """Generate HTML reference for easy copying"""
    html_file = 'biblical_images_reference.html'
    
    with open('biblical_images.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biblical Images Reference</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .category { margin-bottom: 40px; background: white; padding: 20px; border-radius: 8px; }
        .category h2 { color: #1e3a8a; border-bottom: 3px solid #06b6d4; padding-bottom: 10px; }
        .images { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .image-card { border: 2px solid #ddd; border-radius: 8px; overflow: hidden; }
        .image-card img { width: 100%; height: 200px; object-fit: cover; }
        .image-info { padding: 10px; background: #f9f9f9; }
        .image-url { font-size: 10px; word-break: break-all; color: #666; margin-top: 5px; }
        .copy-btn { background: #06b6d4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px; }
        .copy-btn:hover { background: #0891b2; }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: #1e3a8a;">🙏 Biblical & Inspirational Images Reference</h1>
"""
    
    for category, images in data.items():
        html_content += f"""
    <div class="category">
        <h2>{category.replace('_', ' ').title()}</h2>
        <div class="images">
"""
        
        for idx, img in enumerate(images):
            url = img.get('url', '')
            desc = img.get('description', 'No description')
            source = img.get('source', 'Unknown')
            
            html_content += f"""
            <div class="image-card">
                <img src="{url}" alt="{desc}" loading="lazy">
                <div class="image-info">
                    <strong>#{idx + 1}</strong> - {source}<br>
                    <small>{desc[:50]}...</small>
                    <div class="image-url">{url}</div>
                    <button class="copy-btn" onclick="navigator.clipboard.writeText('{url}')">Copy URL</button>
                </div>
            </div>
"""
        
        html_content += """
        </div>
    </div>
"""
    
    html_content += """
</body>
</html>
"""
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ HTML reference saved to {html_file}")

def print_summary(results):
    """Print summary of fetched images"""
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    total_images = 0
    for category, images in results.items():
        count = len(images)
        total_images += count
        print(f"{category}: {count} images")
    
    print(f"\n🎉 Total images fetched: {total_images}")
    print("=" * 60)

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════╗
║   Biblical & Inspirational Image Fetcher                ║
║   Fetching faith-inspiring images with HTTPS support    ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    # Fetch all images
    results = fetch_all_biblical_images()
    
    # Save to JSON
    save_results_to_file(results)
    
    # Generate HTML reference
    generate_html_reference()
    
    # Print summary
    print_summary(results)
    
    print("\n✨ Image fetching complete! Check the generated files:")
    print("   📄 biblical_images.json - Raw data")
    print("   🌐 biblical_images_reference.html - Visual reference")
    print("\n💡 Open biblical_images_reference.html in your browser to view all images!")
