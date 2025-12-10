"""
Enhanced RSS News Scraper for Pro-Israel News Sources
Fetches articles with images and full content from trusted sources
"""

import feedparser
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
from urllib.parse import urlparse

# Pro-Israel News Sources
RSS_FEEDS = {
    'Jerusalem Post': 'https://www.jpost.com/rss/rssfeedsheadlines.aspx',
    'Times of Israel': 'https://www.timesofisrael.com/feed/',
    'Israel Hayom': 'https://www.israelhayom.com/feed/',
    'Arutz Sheva': 'https://www.israelnationalnews.com/rss.xml',
    'Israel National News': 'https://www.israelnationalnews.com/rss/news.aspx',
    'The Algemeiner': 'https://www.algemeiner.com/feed/',
    'Jewish News Syndicate': 'https://www.jns.org/feed/',
    'Israel 21c': 'https://www.israel21c.org/feed/',
    'United With Israel': 'https://unitedwithisrael.org/feed/',
    'Honest Reporting': 'https://honestreporting.com/feed/'
}

def extract_article_image(entry, source_name):
    """
    Extract image from RSS entry using multiple methods
    """
    # Method 1: media:content or media:thumbnail
    if 'media_content' in entry and entry.media_content:
        return entry.media_content[0]['url']
    
    if 'media_thumbnail' in entry and entry.media_thumbnail:
        return entry.media_thumbnail[0]['url']
    
    # Method 2: enclosure
    if 'enclosures' in entry and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'image' in enclosure.get('type', ''):
                return enclosure['url']
    
    # Method 3: Parse content for <img> tags
    content = entry.get('content', [{}])[0].get('value', '') or entry.get('summary', '')
    if content:
        soup = BeautifulSoup(content, 'html.parser')
        img = soup.find('img')
        if img and img.get('src'):
            return img['src']
    
    # Method 4: Fetch from article URL
    try:
        if 'link' in entry:
            response = requests.get(entry['link'], timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try og:image meta tag
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                return og_image['content']
            
            # Try twitter:image
            twitter_image = soup.find('meta', {'name': 'twitter:image'})
            if twitter_image and twitter_image.get('content'):
                return twitter_image['content']
            
            # Try first img in article
            article_img = soup.find('article')
            if article_img:
                img = article_img.find('img')
                if img and img.get('src'):
                    return img['src']
    except Exception as e:
        print(f"⚠️ Could not fetch image from {entry.get('link', '')}: {e}")
    
    return None

def extract_full_text(entry, source_name):
    """
    Extract full article text
    """
    # Try content field first
    if 'content' in entry and entry.content:
        content = entry.content[0].value
        soup = BeautifulSoup(content, 'html.parser')
        return soup.get_text(strip=True)
    
    # Try summary
    if 'summary' in entry:
        soup = BeautifulSoup(entry.summary, 'html.parser')
        return soup.get_text(strip=True)
    
    # Try description
    if 'description' in entry:
        soup = BeautifulSoup(entry.description, 'html.parser')
        return soup.get_text(strip=True)
    
    return "Read full article at source."

def scrape_rss_feed(feed_url, source_name, max_articles=10):
    """
    Scrape a single RSS feed
    """
    print(f"\n📰 Scraping {source_name}...")
    
    try:
        feed = feedparser.parse(feed_url)
        
        if feed.bozo:
            print(f"⚠️ Feed error for {source_name}: {feed.bozo_exception}")
        
        articles = []
        
        for entry in feed.entries[:max_articles]:
            # Extract data
            title = entry.get('title', 'No Title')
            link = entry.get('link', '')
            published = entry.get('published', entry.get('updated', ''))
            
            # Parse date
            if published:
                try:
                    pub_date = datetime(*entry.published_parsed[:6])
                    published = pub_date.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    published = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            else:
                published = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Extract image
            image_url = extract_article_image(entry, source_name)
            
            # Extract full text
            full_text = extract_full_text(entry, source_name)
            
            # Author
            author = entry.get('author', source_name)
            
            article = {
                'title': title,
                'link': link,
                'url': link,
                'published': published,
                'publishedAt': published,
                'description': entry.get('description', entry.get('summary', '')),
                'content': full_text,
                'excerpt': entry.get('summary', '')[:200] + '...' if entry.get('summary', '') else '',
                'image': image_url,
                'urlToImage': image_url,
                'author': author,
                'source': source_name,
                'category': [source_name.replace(' ', '_').lower()],
            }
            
            articles.append(article)
            print(f"  ✓ {title[:60]}...")
        
        print(f"✅ {source_name}: {len(articles)} articles")
        time.sleep(1)  # Be polite to servers
        
        return articles
    
    except Exception as e:
        print(f"❌ Error scraping {source_name}: {e}")
        return []

def scrape_all_feeds():
    """
    Scrape all RSS feeds
    """
    print("🚀 Starting Pro-Israel News Scraper")
    print("=" * 50)
    
    all_articles = []
    
    for source_name, feed_url in RSS_FEEDS.items():
        articles = scrape_rss_feed(feed_url, source_name, max_articles=30)
        all_articles.extend(articles)
    
    # Sort by date (newest first)
    all_articles.sort(key=lambda x: x['published'], reverse=True)
    
    # Save to JSON
    output_file = 'pro_israel_news.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'status': 'ok',
            'totalArticles': len(all_articles),
            'articles': all_articles,
            'sources': list(RSS_FEEDS.keys()),
            'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print(f"✅ Scraping complete!")
    print(f"📊 Total articles: {len(all_articles)}")
    print(f"📁 Saved to: {output_file}")
    print(f"🗞️ Sources: {', '.join(RSS_FEEDS.keys())}")
    
    return all_articles

if __name__ == '__main__':
    scrape_all_feeds()
