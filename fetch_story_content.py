import requests
from bs4 import BeautifulSoup
import json
import time

def fetch_story_content(story_url):
    """Fetch the full content of a story from its URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(story_url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find main content area
        article = soup.find('article') or soup.find('main') or soup.find('div', class_=lambda x: x and 'content' in x.lower())
        
        if article:
            # Remove scripts, styles, ads
            for element in article.find_all(['script', 'style', 'iframe', 'nav', 'aside']):
                element.decompose()
            
            # Get all paragraphs
            paragraphs = article.find_all('p')
            content = '\n\n'.join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 20])
            
            return content
        
        return None
    except Exception as e:
        print(f"Error fetching {story_url}: {e}")
        return None

def enrich_stories_catalog():
    """Add full content to stories catalog"""
    print("Loading stories catalog...")
    with open('vfi_stories_catalog.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    stories = data['stories']
    print(f"Fetching full content for {len(stories)} stories...")
    
    for i, story in enumerate(stories):
        print(f"\n[{i+1}/{len(stories)}] Fetching: {story['title'][:50]}...")
        
        if 'full_content' not in story and 'link' in story:
            content = fetch_story_content(story['link'])
            if content:
                story['full_content'] = content
                print(f"  SUCCESS: Got {len(content)} characters")
            else:
                print(f"  FAILED: Could not fetch content")
            
            time.sleep(1)  # Be polite to server
    
    # Save enriched catalog
    with open('vfi_stories_catalog.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSUCCESS: Updated catalog saved")

if __name__ == "__main__":
    enrich_stories_catalog()
