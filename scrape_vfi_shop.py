"""
VFI Shop Product Scraper
Scrapes all products from Vision For Israel shop with images, prices, and categories
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re

def scrape_vfi_shop_page(page_num):
    """Scrape a single page of VFI shop products"""
    url = f"https://shop.visionforisrael.com/collections/all?page={page_num}"
    print(f"\nScraping page {page_num}: {url}")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        products = []
        
        # Find all product cards
        product_items = soup.find_all('div', class_='product-item')
        
        if not product_items:
            # Try alternative selectors
            product_items = soup.find_all('div', class_='grid-product')
        
        if not product_items:
            # Try another common pattern
            product_items = soup.find_all(['div', 'article'], class_=re.compile(r'product|item'))
        
        print(f"Found {len(product_items)} products on page {page_num}")
        
        for item in product_items:
            try:
                # Extract product name
                title_elem = item.find(['h3', 'h2', 'a'], class_=re.compile(r'product.*title|product.*name', re.I))
                if not title_elem:
                    title_elem = item.find('a', href=re.compile(r'/products/'))
                
                if not title_elem:
                    continue
                
                name = title_elem.get_text(strip=True)
                
                # Extract product URL
                link = item.find('a', href=re.compile(r'/products/'))
                product_url = 'https://shop.visionforisrael.com' + link['href'] if link and link.get('href') else None
                
                if not product_url:
                    continue
                
                # Extract image URL
                img = item.find('img')
                image_url = None
                if img:
                    image_url = img.get('src') or img.get('data-src') or img.get('data-original')
                    if image_url:
                        if image_url.startswith('//'):
                            image_url = 'https:' + image_url
                        elif not image_url.startswith('http'):
                            image_url = 'https://shop.visionforisrael.com' + image_url
                        
                        # Clean up image URL parameters
                        if '?' in image_url:
                            base_url = image_url.split('?')[0]
                            # Use higher quality image
                            image_url = base_url + '?v=' + image_url.split('v=')[-1] if 'v=' in image_url else base_url
                
                # Extract price
                price_elem = item.find(['span', 'div'], class_=re.compile(r'price', re.I))
                price = None
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    # Extract numeric price
                    price_match = re.search(r'\$?(\d+\.?\d*)', price_text)
                    if price_match:
                        try:
                            price = float(price_match.group(1))
                        except ValueError:
                            price = None
                
                # Try to determine category from product URL or title
                category = categorize_product(name, product_url)
                
                product = {
                    'name': name,
                    'url': product_url,
                    'image': image_url,
                    'price': price,
                    'category': category
                }
                
                products.append(product)
                print(f"  ✓ {name} - ${price} ({category})")
                
            except Exception as e:
                print(f"  ✗ Error parsing product: {e}")
                continue
        
        return products
        
    except requests.RequestException as e:
        print(f"Error fetching page {page_num}: {e}")
        return []

def categorize_product(name, url):
    """Categorize product based on name and URL"""
    name_lower = name.lower()
    url_lower = url.lower() if url else ''
    
    # Anointing Oils
    if any(word in name_lower for word in ['oil', 'anointing', 'fragrance']):
        return 'oils'
    
    # Music CDs
    if any(word in name_lower for word in ['cd', 'music', 'album', 'worship', 'praise']):
        return 'music'
    
    # Books
    if any(word in name_lower for word in ['book', 'study', 'guide', 'testament']):
        return 'books'
    
    # T-Shirts & Apparel
    if any(word in name_lower for word in ['t-shirt', 'shirt', 'tee', 'apparel', 'clothing', 'wristband', 'hat', 'cap']):
        return 'apparel'
    
    # Scarves & Prayer Shawls
    if any(word in name_lower for word in ['scarf', 'shawl', 'tallit', 'prayer']):
        return 'scarves'
    
    # Cards & Calendars
    if any(word in name_lower for word in ['card', 'calendar', 'print', 'poster', 'bookmark']):
        return 'cards'
    
    # Judaica
    if any(word in name_lower for word in ['judaica', 'mezuzah', 'menorah', 'star of david', 'shofar', 'cross', 'necklace', 'jewelry', 'pin', 'keychain']):
        return 'judaica'
    
    # Check URL for category hints
    if '/collections/' in url_lower:
        if 'oil' in url_lower:
            return 'oils'
        elif 'cd' in url_lower or 'music' in url_lower:
            return 'music'
        elif 'book' in url_lower:
            return 'books'
        elif 't-shirt' in url_lower or 'apparel' in url_lower:
            return 'apparel'
        elif 'scarf' in url_lower or 'shawl' in url_lower:
            return 'scarves'
        elif 'card' in url_lower or 'calendar' in url_lower:
            return 'cards'
        elif 'judaica' in url_lower:
            return 'judaica'
    
    # Default category
    return 'judaica'

def scrape_all_pages():
    """Scrape all pages of VFI shop"""
    all_products = []
    page = 1
    max_pages = 10  # Safety limit
    
    print("=" * 60)
    print("VFI SHOP PRODUCT SCRAPER")
    print("=" * 60)
    
    while page <= max_pages:
        products = scrape_vfi_shop_page(page)
        
        if not products:
            print(f"\nNo products found on page {page}. Stopping.")
            break
        
        all_products.extend(products)
        print(f"Total products so far: {len(all_products)}")
        
        page += 1
        time.sleep(2)  # Be respectful to the server
    
    return all_products

def generate_shop_data_js(products):
    """Generate JavaScript file with product data"""
    
    # Remove duplicates based on URL
    seen_urls = set()
    unique_products = []
    for product in products:
        if product['url'] not in seen_urls:
            seen_urls.add(product['url'])
            unique_products.append(product)
    
    print(f"\n{len(unique_products)} unique products after removing duplicates")
    
    # Group by category and mark popular/featured items
    category_counts = {}
    for product in unique_products:
        cat = product['category']
        category_counts[cat] = category_counts.get(cat, 0) + 1
    
    # Mark some products as featured/popular
    for i, product in enumerate(unique_products):
        if i < 10:  # First 10 are featured
            product['featured'] = True
        if product['price'] and product['price'] <= 15:  # Affordable items are popular
            product['popular'] = True
        elif i < 15:  # First 15 also popular
            product['popular'] = True
    
    # Generate JavaScript
    js_content = '''// VFI Shop Product Catalog - Auto-generated
const shopProducts = [\n'''
    
    for i, product in enumerate(unique_products, 1):
        description = f"{product['name']} from the Holy Land"
        if product['category'] == 'oils':
            description = f"Authentic anointing oil from Israel"
        elif product['category'] == 'music':
            description = f"Hebrew worship and praise music"
        elif product['category'] == 'books':
            description = f"Insightful reading from Israel"
        elif product['category'] == 'apparel':
            description = f"Show your support for Israel"
        elif product['category'] == 'scarves':
            description = f"Beautiful prayer covering"
        elif product['category'] == 'cards':
            description = f"Blessings for your home"
        elif product['category'] == 'judaica':
            description = f"Traditional Jewish items"
        
        featured_str = 'true' if product.get('featured') else 'false'
        popular_str = 'true' if product.get('popular') else 'false'
        price_str = f"{product['price']:.2f}" if product['price'] else "0.00"
        
        js_content += f'''    {{
        id: {i},
        name: "{product['name']}",
        category: "{product['category']}",
        price: {price_str},
        image: "{product['image']}",
        description: "{description}",
        url: "{product['url']}",
        featured: {featured_str},
        popular: {popular_str}
    }}'''
        
        if i < len(unique_products):
            js_content += ',\n'
        else:
            js_content += '\n'
    
    js_content += '''];\n\n// Category definitions
const shopCategories = [
    { id: 'all', name: 'All Products', icon: 'fas fa-th-large' },
    { id: 'oils', name: 'Anointing Oils', icon: 'fas fa-oil-can' },
    { id: 'music', name: 'Music CDs', icon: 'fas fa-music' },
    { id: 'books', name: 'Books', icon: 'fas fa-book' },
    { id: 'apparel', name: 'T-Shirts & Apparel', icon: 'fas fa-tshirt' },
    { id: 'scarves', name: 'Scarves & Shawls', icon: 'fas fa-socks' },
    { id: 'cards', name: 'Cards & Calendars', icon: 'fas fa-calendar-alt' },
    { id: 'judaica', name: 'Judaica', icon: 'fas fa-star-of-david' }
];
'''
    
    return js_content

def main():
    """Main function"""
    # Scrape all products
    products = scrape_all_pages()
    
    if not products:
        print("\n❌ No products were scraped!")
        return
    
    # Save raw JSON data
    with open('vfi_shop_products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Saved {len(products)} products to vfi_shop_products.json")
    
    # Generate JavaScript file
    js_content = generate_shop_data_js(products)
    with open('shop-data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"✓ Generated shop-data.js with product data")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SCRAPING SUMMARY")
    print("=" * 60)
    
    categories = {}
    for product in products:
        cat = product['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in sorted(categories.items()):
        print(f"{cat:15} : {count:3} products")
    
    print(f"\n{'TOTAL':15} : {len(products):3} products")
    print("=" * 60)

if __name__ == '__main__':
    main()
