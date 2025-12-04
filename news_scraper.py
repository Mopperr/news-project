from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import feedparser
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Trusted pro-Israel news sources RSS feeds
NEWS_SOURCES = {
    'times_of_israel': {
        'name': 'The Times of Israel',
        'url': 'https://www.timesofisrael.com/feed/',
        'icon': '🇮🇱'
    },
    'jerusalem_post': {
        'name': 'The Jerusalem Post',
        'url': 'https://www.jpost.com/rss/rssfeedsheadlines.aspx',
        'icon': '📰'
    },
    'i24news': {
        'name': 'i24NEWS',
        'url': 'https://www.i24news.tv/en/rss',
        'icon': '📡'
    },
    'israel_hayom': {
        'name': 'Israel Hayom',
        'url': 'https://www.israelhayom.com/feed/',
        'icon': '📰'
    },
    'jns': {
        'name': 'Jewish News Syndicate',
        'url': 'https://www.jns.org/feed/',
        'icon': '📰'
    },
    'arutz_sheva': {
        'name': 'Arutz Sheva',
        'url': 'https://www.israelnationalnews.com/rss.xml',
        'icon': '📻'
    }
}

# Category-specific RSS feeds
CATEGORY_SOURCES = {
    'business': {
        'times_of_israel_business': {
            'name': 'Times of Israel Business',
            'url': 'https://www.timesofisrael.com/category/business/feed/',
            'icon': '💼'
        },
        'jerusalem_post_business': {
            'name': 'Jerusalem Post Business',
            'url': 'https://www.jpost.com/rss/rssfeedsbusiness.aspx',
            'icon': '💼'
        }
    },
    'technology': {
        'times_of_israel_tech': {
            'name': 'Times of Israel Tech',
            'url': 'https://www.timesofisrael.com/category/tech/feed/',
            'icon': '💻'
        },
        'jpost_tech': {
            'name': 'Jerusalem Post Tech',
            'url': 'https://www.jpost.com/rss/rssfeedstechnology.aspx',
            'icon': '💻'
        }
    },
    'politics': {
        'times_of_israel_politics': {
            'name': 'Times of Israel Politics',
            'url': 'https://www.timesofisrael.com/category/politics/feed/',
            'icon': '🏛️'
        },
        'jerusalem_post_politics': {
            'name': 'Jerusalem Post Politics',
            'url': 'https://www.jpost.com/rss/rssfeedspolitics.aspx',
            'icon': '🏛️'
        }
    },
    'world': {
        'times_of_israel_world': {
            'name': 'Times of Israel World',
            'url': 'https://www.timesofisrael.com/category/world/feed/',
            'icon': '🌍'
        },
        'jpost_world': {
            'name': 'Jerusalem Post World',
            'url': 'https://www.jpost.com/rss/rssfeedsinternational.aspx',
            'icon': '🌍'
        }
    }
}

# Keywords to help categorize articles
CATEGORY_KEYWORDS = {
    'business': ['business', 'economy', 'market', 'stock', 'trade', 'investment', 'financial', 'banking', 'startup', 'company', 'corporate', 'entrepreneurship', 'innovation'],
    'technology': ['technology', 'tech', 'software', 'hardware', 'ai', 'artificial intelligence', 'cyber', 'digital', 'innovation', 'app', 'internet', 'cybersecurity', 'innovation', 'startup'],
    'politics': ['politics', 'political', 'government', 'election', 'minister', 'parliament', 'knesset', 'coalition', 'diplomat', 'policy', 'netanyahu', 'bennett', 'lapid'],
    'world': ['world', 'international', 'global', 'foreign', 'diplomatic', 'united nations', 'europe', 'middle east', 'arab', 'peace', 'treaty']
}

def parse_rss_feed(url, source_info):
    """Parse RSS feed and extract article information"""
    articles = []
    try:
        feed = feedparser.parse(url)
        source_name = source_info.get('name', 'Unknown Source')
        source_icon = source_info.get('icon', '📰')
        
        for entry in feed.entries[:10]:  # Get top 10 articles per source
            # Get the URL and ensure it has https://
            article_url = entry.get('link', '')
            if article_url and not article_url.startswith('http'):
                article_url = 'https://' + article_url.lstrip('/')
            
            article = {
                'title': entry.get('title', 'No title'),
                'description': entry.get('summary', entry.get('description', 'No description available')),
                'url': article_url,
                'author': entry.get('author', source_name),
                'published': entry.get('published', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                'source': source_name,
                'source_icon': source_icon,
                'image': extract_image_from_entry(entry),
                'category': extract_category(entry)
            }
            articles.append(article)
    except Exception as e:
        print(f"Error parsing {source_info.get('name', 'source')}: {str(e)}")
    
    return articles

def extract_image_from_entry(entry):
    """Extract image URL from RSS entry"""
    image_url = None
    
    # Try media content
    if hasattr(entry, 'media_content') and entry.media_content:
        image_url = entry.media_content[0].get('url', '')
    
    # Try media thumbnail
    elif hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        image_url = entry.media_thumbnail[0].get('url', '')
    
    # Try enclosures
    elif hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'image' in enclosure.get('type', ''):
                image_url = enclosure.get('href', '')
                break
    
    # Try to extract from summary/content
    elif hasattr(entry, 'summary'):
        soup = BeautifulSoup(entry.summary, 'html.parser')
        img = soup.find('img')
        if img and img.get('src'):
            image_url = img.get('src')
    
    # Ensure image URL has https:// protocol
    if image_url and not image_url.startswith('http'):
        image_url = 'https://' + image_url.lstrip('/')
    
    return image_url

def extract_category(entry):
    """Extract category/tags from entry"""
    if hasattr(entry, 'tags') and entry.tags:
        return [tag.term for tag in entry.tags[:3]]
    return ['general']

def categorize_article(article):
    """Categorize article based on keywords in title and description"""
    text = (article['title'] + ' ' + article['description']).lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                if category not in article['category']:
                    article['category'].append(category)
    
    return article

@app.route('/api/news', methods=['GET'])
def get_news():
    """Endpoint to get all Israel news with optional category filter"""
    from flask import request
    category = request.args.get('category', 'all').lower()
    
    all_articles = []
    
    # If specific category requested, fetch from category-specific sources
    if category != 'all' and category in CATEGORY_SOURCES:
        for source_key, source_info in CATEGORY_SOURCES[category].items():
            articles = parse_rss_feed(source_info['url'], source_info)
            for article in articles:
                article = categorize_article(article)
                all_articles.append(article)
    
    # Also fetch from general sources
    for source_key, source_info in NEWS_SOURCES.items():
        articles = parse_rss_feed(source_info['url'], source_info)
        for article in articles:
            article = categorize_article(article)
            all_articles.append(article)
    
    # Filter by category if specified
    if category != 'all':
        all_articles = [
            article for article in all_articles
            if category in [cat.lower() for cat in article['category']]
        ]
    
    # Sort by published date (most recent first)
    all_articles.sort(key=lambda x: x['published'], reverse=True)
    
    return jsonify({
        'status': 'ok',
        'category': category,
        'total_articles': len(all_articles),
        'news': all_articles[:30]  # Return top 30 articles
    })

@app.route('/api/news/search', methods=['GET'])
def search_news():
    """Endpoint to search news by keyword with optional category filter"""
    from flask import request
    keyword = request.args.get('q', '').lower()
    category = request.args.get('category', 'all').lower()
    
    all_articles = []
    
    # Fetch from category-specific sources if category specified
    if category != 'all' and category in CATEGORY_SOURCES:
        for source_key, source_info in CATEGORY_SOURCES[category].items():
            articles = parse_rss_feed(source_info['url'], source_info)
            for article in articles:
                article = categorize_article(article)
                all_articles.append(article)
    
    # Fetch from general sources
    for source_key, source_info in NEWS_SOURCES.items():
        articles = parse_rss_feed(source_info['url'], source_info)
        for article in articles:
            article = categorize_article(article)
            all_articles.append(article)
    
    # Filter by keyword
    if keyword:
        filtered = [
            article for article in all_articles
            if keyword in article['title'].lower() or keyword in article['description'].lower()
        ]
    else:
        filtered = all_articles
    
    # Filter by category if specified
    if category != 'all':
        filtered = [
            article for article in filtered
            if category in [cat.lower() for cat in article['category']]
        ]
    
    filtered.sort(key=lambda x: x['published'], reverse=True)
    
    return jsonify({
        'status': 'ok',
        'category': category,
        'keyword': keyword,
        'total_articles': len(filtered),
        'news': filtered[:30]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Israel News API is running'})

if __name__ == '__main__':
    print("Starting Israel News Scraper API...")
    print("Available endpoints:")
    print("  - GET /api/news - Get all Israel news")
    print("  - GET /api/news?category=business - Get business news")
    print("  - GET /api/news?category=technology - Get technology news")
    print("  - GET /api/news?category=politics - Get politics news")
    print("  - GET /api/news?category=world - Get world news")
    print("  - GET /api/news/search?q=keyword - Search news")
    print("  - GET /api/news/search?q=keyword&category=business - Search with category")
    print("  - GET /api/health - Health check")
    app.run(debug=True, host='127.0.0.1', port=5500)
