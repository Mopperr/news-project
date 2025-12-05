import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import re

def scrape_vfi_stories():
    """Scrape stories from VFI blog"""
    base_url = "https://www.visionforisrael.com/en/blog/topic/stories/"
    all_stories = []
    seen_titles = set()
    
    # Scrape pages 1-3
    for page_num in range(1, 4):
        url = f"{base_url}{page_num}"
        print(f"Scraping page {page_num}: {url}")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all links that might be story links
            links = soup.find_all('a', href=re.compile(r'/blog/'))
            
            print(f"Found {len(links)} potential story links")
            
            for link in links:
                # Skip app downloads
                href = link.get('href', '')
                if 'app' in href.lower() or '/topic/' in href:
                    continue
                    
                article = link.find_parent(['article', 'div'])
                if not article:
                    article = link
                
                story = {}
                
                # Get title
                title = link.get_text(strip=True)
                if not title or len(title) < 10:
                    heading = article.find(['h1', 'h2', 'h3', 'h4'])
                    if heading:
                        title = heading.get_text(strip=True)
                
                if not title or len(title) < 10 or title in seen_titles:
                    continue
                
                story['title'] = title
                seen_titles.add(title)
                
                # Get link
                if href.startswith('/'):
                    href = f"https://www.visionforisrael.com{href}"
                story['link'] = href
                
                # Find image
                img = article.find('img')
                if img:
                    src = img.get('src', '') or img.get('data-src', '')
                    if src and 'app-store' not in src.lower():
                        if src.startswith('/'):
                            src = f"https://www.visionforisrael.com{src}"
                        story['image'] = src
                        story['image_alt'] = img.get('alt', title)
                
                # Find description
                paragraphs = article.find_all('p', limit=3)
                for p in paragraphs:
                    text = p.get_text(strip=True)
                    if text and len(text) > 20 and 'download' not in text.lower():
                        story['description'] = text
                        break
                
                # Add category
                story['category'] = 'Story'
                
                # Only add if we have essentials
                if 'title' in story and ('image' in story or 'description' in story):
                    all_stories.append(story)
                    print(f"  ✓ {story['title'][:50]}...")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    # Save
    output = {
        'scraped_at': datetime.now().isoformat(),
        'total_stories': len(all_stories),
        'source': 'https://www.visionforisrael.com/en/blog/topic/stories',
        'stories': all_stories
    }
    
    with open('vfi_stories_catalog.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Scraped {len(all_stories)} stories")
    return all_stories

if __name__ == "__main__":
    print("VFI Stories Scraper")
    print("=" * 60)
    scrape_vfi_stories()
    print("=" * 60)
