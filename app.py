from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import feedparser
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# ==================== NEWS SCRAPER ====================

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
        
        for entry in feed.entries[:10]:
            article = {
                'title': entry.get('title', 'No title'),
                'description': entry.get('summary', entry.get('description', 'No description available')),
                'url': entry.get('link', ''),
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
    if hasattr(entry, 'media_content') and entry.media_content:
        return entry.media_content[0].get('url', '')
    
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url', '')
    
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if 'image' in enclosure.get('type', ''):
                return enclosure.get('href', '')
    
    if hasattr(entry, 'summary'):
        soup = BeautifulSoup(entry.summary, 'html.parser')
        img = soup.find('img')
        if img and img.get('src'):
            return img.get('src')
    
    return None

def extract_category(entry):
    """Extract category/tags from entry"""
    if hasattr(entry, 'tags') and entry.tags:
        return [tag.term for tag in entry.tags[:3]]
    return ['general']

def categorize_article(article):
    """Categorize article based on keywords"""
    text = (article['title'] + ' ' + article['description']).lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text:
                if category not in article['category']:
                    article['category'].append(category)
    
    return article

# ==================== WEATHER API ====================

WEATHER_API_KEY = 'ba2a50681ffed31ce97da2d5cf03e17f'
JERUSALEM_COORDS = {'lat': 31.7683, 'lon': 35.2137}

@app.route('/api/weather/jerusalem', methods=['GET'])
def get_jerusalem_weather():
    """Get current weather for Jerusalem"""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={JERUSALEM_COORDS['lat']}&lon={JERUSALEM_COORDS['lon']}&appid={WEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify({
                'status': 'ok',
                'weather': {
                    'temp': data['main']['temp'],
                    'feels_like': data['main']['feels_like'],
                    'humidity': data['main']['humidity'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'city': 'Jerusalem',
                    'updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            })
        else:
            return jsonify({'status': 'error', 'message': 'Weather API error'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ==================== BLOG API ====================

@app.route('/api/blog/articles', methods=['GET'])
def get_blog_articles():
    """Get VFI blog articles from catalog"""
    try:
        # Try to read from vfi_blog_catalog.json
        if os.path.exists('vfi_blog_catalog.json'):
            with open('vfi_blog_catalog.json', 'r', encoding='utf-8') as f:
                catalog = json.load(f)
                return jsonify(catalog)
        else:
            # Return fallback articles
            return jsonify(get_fallback_blog_articles())
    except Exception as e:
        return jsonify(get_fallback_blog_articles())

def get_fallback_blog_articles():
    """Fallback blog articles if catalog file is not available"""
    return {
        'status': 'ok',
        'total_articles': 3,
        'articles': [
            {
                'id': 1,
                'title': 'A Father\'s Courage: How One Man\'s Faith Saved His Family',
                'excerpt': 'In the heart of Israel, a father\'s unwavering faith became the lifeline for his family during their darkest hour...',
                'image': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
                'link': 'https://visionforisrael.com/blog',
                'published': '2024-12-01'
            },
            {
                'id': 2,
                'title': 'The Table of Hope: Community Meals That Changed Lives',
                'excerpt': 'Every week, Vision for Israel hosts community meals that bring together Holocaust survivors, new immigrants...',
                'image': 'https://images.unsplash.com/photo-1543269865-4430e1dba460?w=800',
                'link': 'https://visionforisrael.com/blog',
                'published': '2024-11-28'
            },
            {
                'id': 3,
                'title': 'Q3 2024 Impact Report: Your Generosity in Action',
                'excerpt': 'This quarter has been remarkable. Thanks to your faithful support, Vision for Israel has reached more families...',
                'image': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                'link': 'https://visionforisrael.com/blog',
                'published': '2024-11-25'
            }
        ],
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'timestamp': datetime.now().isoformat()
    }

# ==================== NEWS ENDPOINTS ====================

@app.route('/api/news', methods=['GET'])
def get_news():
    """Get all Israel news with optional category filter"""
    category = request.args.get('category', 'all').lower()
    
    all_articles = []
    
    if category != 'all' and category in CATEGORY_SOURCES:
        for source_key, source_info in CATEGORY_SOURCES[category].items():
            articles = parse_rss_feed(source_info['url'], source_info)
            for article in articles:
                article = categorize_article(article)
                all_articles.append(article)
    
    for source_key, source_info in NEWS_SOURCES.items():
        articles = parse_rss_feed(source_info['url'], source_info)
        for article in articles:
            article = categorize_article(article)
            all_articles.append(article)
    
    if category != 'all':
        all_articles = [
            article for article in all_articles
            if category in [cat.lower() for cat in article['category']]
        ]
    
    all_articles.sort(key=lambda x: x['published'], reverse=True)
    
    return jsonify({
        'status': 'ok',
        'category': category,
        'total_articles': len(all_articles),
        'news': all_articles[:30]
    })

@app.route('/api/news/search', methods=['GET'])
def search_news():
    """Search news by keyword with optional category filter"""
    keyword = request.args.get('q', '').lower()
    category = request.args.get('category', 'all').lower()
    
    all_articles = []
    
    if category != 'all' and category in CATEGORY_SOURCES:
        for source_key, source_info in CATEGORY_SOURCES[category].items():
            articles = parse_rss_feed(source_info['url'], source_info)
            for article in articles:
                article = categorize_article(article)
                all_articles.append(article)
    
    for source_key, source_info in NEWS_SOURCES.items():
        articles = parse_rss_feed(source_info['url'], source_info)
        for article in articles:
            article = categorize_article(article)
            all_articles.append(article)
    
    if keyword:
        filtered = [
            article for article in all_articles
            if keyword in article['title'].lower() or keyword in article['description'].lower()
        ]
    else:
        filtered = all_articles
    
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
    return jsonify({
        'status': 'ok',
        'message': 'VFI News API is running',
        'endpoints': {
            'news': '/api/news',
            'news_search': '/api/news/search',
            'weather': '/api/weather/jerusalem',
            'blog': '/api/blog/articles',
            'health': '/api/health'
        }
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'service': 'VFI News API',
        'status': 'running',
        'endpoints': {
            'news': '/api/news',
            'news_by_category': '/api/news?category=business|technology|politics|world',
            'news_search': '/api/news/search?q=keyword',
            'weather': '/api/weather/jerusalem',
            'blog': '/api/blog/articles',
            'health': '/api/health'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5500))
    app.run(debug=False, host='0.0.0.0', port=port)
