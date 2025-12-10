"""
Improved Pro-Israel News Scraper
Only scrapes sources with reliable images and content
"""

import feedparser
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

# Reliable Pro-Israel News Sources (tested with good images)
RSS_FEEDS = {
    'Times of Israel': 'https://www.timesofisrael.com/feed/',
    'Jerusalem Post': 'https://www.jpost.com/rss/rssfeedsheadlines.aspx',
    'Jewish News Syndicate': 'https://www.jns.org/feed/',
    'The Algemeiner': 'https://www.algemeiner.com/feed/',
    'United With Israel': 'https://unitedwithisrael.org/feed/',
}

def extract_image(entry):
    """Extract image using multiple methods"""
    
    # Method 1: media_content
    if hasattr(entry, 'media_content') and entry.media_content:
        return entry.media_content[0].get('url')
    
    # Method 2: media_thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url')
    
    # Method 3: enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            if 'image' in enc.get('type', ''):
                return enc.get('url')
    
    # Method 4: Parse HTML content
    content = entry.get('content', [{}])[0].get('value', '') or entry.get('summary', '') or entry.get('description', '')
    if content:
        soup = BeautifulSoup(content, 'html.parser')
        img = soup.find('img')
        if img and img.get('src'):
            src = img['src']
            # Ensure full URL
            if src.startswith('//'):
                src = 'https:' + src
            elif src.startswith('/'):
                # Try to construct full URL from entry link
                if 'link' in entry:
                    from urllib.parse import urlparse
                    parsed = urlparse(entry['link'])
                    src = f"{parsed.scheme}://{parsed.netloc}{src}"
            return src
    
    return None

def clean_html(text):
    """Remove HTML tags from text"""
    if not text:
        return ""
    soup = BeautifulSoup(text, 'html.parser')
    return soup.get_text(strip=True)

def scrape_feed(feed_url, source_name, max_articles=15):
    """Scrape a single RSS feed"""
    print(f"\n📰 Fetching from {source_name}...")
    
    try:
        feed = feedparser.parse(feed_url)
        articles = []
        
        for entry in feed.entries[:max_articles]:
            # Get image
            image_url = extract_image(entry)
            
            # Skip if no image
            if not image_url:
                continue
            
            # Get date
            published = entry.get('published', entry.get('updated', ''))
            if published:
                try:
                    pub_date = datetime(*entry.published_parsed[:6])
                    published = pub_date.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    published = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            else:
                published = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Get description
            description = clean_html(entry.get('description', entry.get('summary', '')))
            if len(description) > 200:
                description = description[:197] + '...'
            
            # Get full content
            content = entry.get('content', [{}])[0].get('value', '') or entry.get('description', '') or entry.get('summary', '')
            full_content = clean_html(content)
            
            article = {
                'title': entry.get('title', 'No Title'),
                'link': entry.get('link', ''),
                'url': entry.get('link', ''),
                'published': published,
                'publishedAt': published,
                'description': description,
                'content': full_content if full_content else description,
                'image': image_url,
                'urlToImage': image_url,
                'author': entry.get('author', source_name),
                'source': source_name,
                'category': [source_name.lower().replace(' ', '_')],
            }
            
            articles.append(article)
            print(f"  ✓ {article['title'][:50]}...")
        
        print(f"✅ {source_name}: {len(articles)} articles with images")
        time.sleep(1)
        
        return articles
    
    except Exception as e:
        print(f"❌ Error with {source_name}: {e}")
        return []

def scrape_all():
    """Scrape all feeds"""
    print("🚀 Starting Enhanced Pro-Israel News Scraper")
    print("=" * 60)
    
    all_articles = []
    
    for source_name, feed_url in RSS_FEEDS.items():
        articles = scrape_feed(feed_url, source_name)
        all_articles.extend(articles)
    
    # Sort by date
    all_articles.sort(key=lambda x: x['published'], reverse=True)
    
    # Limit to 15 most recent
    all_articles = all_articles[:15]
    
    # Save
    output = {
        'status': 'ok',
        'totalArticles': len(all_articles),
        'articles': all_articles,
        'sources': list(RSS_FEEDS.keys()),
        'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    with open('pro_israel_news.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✅ Done! Saved {len(all_articles)} articles (15 most recent)")
    print(f"📁 File: pro_israel_news.json")

if __name__ == '__main__':
    scrape_all()
