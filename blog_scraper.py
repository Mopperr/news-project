def remove_footer(text):
    """Remove unwanted navigation/footer blocks from text using aggressive regex patterns."""
    FOOTER_PATTERNS = [
        r'By proceeding,? I agree to the Terms of Use and the Privacy Policy[\s\S]*$',
        r'By subscribing,? I agree to the Terms of Use and the Privacy Policy[\s\S]*$',
        r'(Home[\s\S]*?Projects[\s\S]*?Learn[\s\S]*?Events[\s\S]*?About[\s\S]*?Contact Us[\s\S]*?Shop USA[\s\S]*?Shop UK[\s\S]*?Give[\s\S]*?Other Ways to Give[\s\S]*?Legacy Giving[\s\S]*?Donate Shares[\s\S]*?VFI News App[\s\S]*?VFI News[\s\S]*?Roots & Reflections[\s\S]*?Vision for Israel[\s\S]*?P\.O\. Box[\s\S]*?Charlotte, NC 28241[\s\S]*?United States[\s\S]*?E:[\s\S]*?)$',
        r'Vision for Israel[\s\S]*?P\.?O\.? Box[\s\S]*?United States[\s\S]*?F: \+1 \(704\) 583-8308',
        r'Hazon Le[’\']Israel[\s\S]*?F: \+972 \(8\) 978 6429',
        r'Vision for Israel is a 501\(c\)\(3\) tax-exempt charity\.[\s\S]*$',
        r'info@visionforisrael.com[\s\S]*?F: \+1 \(704\) 583-8308',
        r'Contact Us[\s\S]*?info@visionforisrael.com[\s\S]*?F: \+1 \(704\) 583-8308',
        r'(Home[\s\S]*?Roots & Reflections[\s\S]*?info@visionforisrael.com[\s\S]*?F: \+1 \(704\) 583-8308)',
        r'<p[^>]*>By proceeding, I agree to the <a[^>]*>Terms of Use</a> and the <a[^>]*>Privacy Policy</a>\.?<\/p>[\s\S]*$',
        r'<p[^>]*>Home<\/p>[\s\S]*?<p[^>]*>Projects<\/p>[\s\S]*?<p[^>]*>Learn<\/p>[\s\S]*?<p[^>]*>Events<\/p>[\s\S]*?<p[^>]*>About<\/p>[\s\S]*?<p[^>]*>Contact Us<\/p>[\s\S]*?<p[^>]*>Shop USA<\/p>[\s\S]*?<p[^>]*>Shop UK<\/p>[\s\S]*?<p[^>]*>Give<\/p>[\s\S]*?<p[^>]*>Other Ways to Give<\/p>[\s\S]*?<p[^>]*>Legacy Giving<\/p>[\s\S]*?<p[^>]*>Donate Shares<\/p>[\s\S]*?<p[^>]*>VFI News App<\/p>[\s\S]*?<p[^>]*>VFI News<\/p>[\s\S]*?<p[^>]*>Roots & Reflections<\/p>[\s\S]*?<p><strong>Vision for Israel<\/strong><br\/>P\.O\. Box 7743<\/br>Charlotte, NC 28241<\/br>United States<\/br>E:[\s\S]*?$',
    ]
    for pat in FOOTER_PATTERNS:
        text = re.sub(pat, '', text, flags=re.I|re.M)
    return text.strip()
"""
VFI Blog Scraper
Scrapes articles from Vision for Israel blog and creates a rotating catalog
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import re

# Configuration
CATALOG_FILE = 'vfi_blog_catalog.json'
ARTICLE_BASE = 'https://www.visionforisrael.com'


# Start URL for crawling
BLOG_START_URL = "https://www.visionforisrael.com/en/blog?page=1"

# Request headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def get_article_links():
    """Crawl all paginated blog listing pages, extract all article links using both BeautifulSoup and regex."""
    links = set()
    visited_pages = set()
    next_url = BLOG_START_URL
    page_num = 1
    while next_url and next_url not in visited_pages:
        print(f"Scraping blog list page: {next_url}")
        visited_pages.add(next_url)
        try:
            resp = requests.get(next_url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            html = resp.text
            soup = BeautifulSoup(html, 'html.parser')
            # 1. Extract article links from <a> tags and <article> elements (as before)
            for a in soup.find_all('a', href=True):
                href = a['href']
                if (
                    href.startswith('/en/blog/')
                    and not re.search(r'/page/|/topic/', href)
                    and len(href.split('/')) > 3
                ):
                    full_url = ARTICLE_BASE + href.split('?')[0]
                    links.add(full_url)
            for article in soup.find_all('article'):
                a = article.find('a', href=True)
                if a:
                    href = a['href']
                    if (
                        href.startswith('/en/blog/')
                        and not re.search(r'/page/|/topic/', href)
                        and len(href.split('/')) > 3
                    ):
                        full_url = ARTICLE_BASE + href.split('?')[0]
                        links.add(full_url)
            # 2. Extract article links using regex from the raw HTML
            regex_links = re.findall(r'"(\/en\/blog\/[^"]+?)"|\'(\/en\/blog\/[^"]+?)\'|>(\/en\/blog\/[\w\-\.]+)<', html)
            for match in regex_links:
                for href in match:
                    if href and href.startswith('/en/blog/') and not re.search(r'/page/|/topic/', href) and len(href.split('/')) > 3:
                        full_url = ARTICLE_BASE + href.split('?')[0]
                        links.add(full_url)
            # 3. Find the "NEXT" link for pagination
            next_link = None
            for a in soup.find_all('a', href=True):
                if a.get_text(strip=True).lower() == 'next':
                    next_link = a['href']
                    break
            if next_link and next_link.startswith('/'):
                next_url = ARTICLE_BASE + next_link
            elif next_link and next_link.startswith('http'):
                next_url = next_link
            else:
                next_url = None
        except Exception as e:
            print(f"  [ERROR] Could not scrape {next_url}: {e}")
            break
        page_num += 1
        time.sleep(1)
    return sorted(list(links))

def scrape_article(url):
    """Scrape details of a single article"""
    print(f"  Scraping article: {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1') or soup.find('title')
        title = clean_text(title_elem.get_text()) if title_elem else ''
        
        # Extract main image
        image_url = ''
        img_elem = soup.find('meta', property='og:image')
        if img_elem:
            image_url = img_elem.get('content', '')
        else:
            img = soup.find('article').find('img') if soup.find('article') else None
            if img:
                image_url = img.get('src') or img.get('data-src') or ''
        
        # Make sure image URL is absolute
        if image_url and not image_url.startswith('http'):
            image_url = ARTICLE_BASE + image_url
        
        # Extract date from <h6 class="MuiTypography-root boldPostDate MuiTypography-subtitle2">
        published = ''
        date_h6 = soup.find('h6', class_='MuiTypography-root boldPostDate MuiTypography-subtitle2')
        if date_h6:
            raw_date = clean_text(date_h6.get_text())
            # Try to parse and subtract one day
            try:
                parsed = datetime.strptime(raw_date, '%B %d, %Y')
                published = (parsed - timedelta(days=1)).strftime('%B %d, %Y')
            except Exception:
                published = raw_date
        else:
            # fallback to <time> or meta
            date_elem = soup.find('time') or soup.find('meta', property='article:published_time')
            if date_elem:
                if date_elem.name == 'meta':
                    published = date_elem.get('content', '')
                elif date_elem.name == 'time':
                    published = date_elem.get('datetime') or date_elem.get_text()
            published = clean_text(published)
            # Try to parse and subtract one day
            try:
                parsed = datetime.strptime(published, '%B %d, %Y')
                published = (parsed - timedelta(days=1)).strftime('%B %d, %Y')
            except Exception:
                pass
        from datetime import datetime, timedelta
        
        # Extract article content (robust)
        content_area = soup.find('article') or soup.find('div', class_=re.compile(r'post.*content|article.*content|entry.*content|blog.*content', re.I))
        paragraphs = []
        content_html = ''
        if content_area:
            # Get all paragraphs and lists, preserve HTML
            for elem in content_area.find_all(['p', 'ul', 'ol', 'h2', 'h3', 'blockquote'], recursive=True):
                content_html += str(elem)
                if elem.name == 'p':
                    txt = clean_text(elem.get_text())
                    if txt:
                        paragraphs.append(txt)
        # Fallback: If no content found, try to extract from all <p> tags in the page
        if not paragraphs:
            for elem in soup.find_all('p'):
                txt = clean_text(elem.get_text())
                if txt:
                    paragraphs.append(txt)
                    content_html += str(elem)
        # Fallback: If still empty, try to extract from main text blocks
        if not paragraphs:
            main_blocks = soup.find_all('div', class_=re.compile(r'(main|body|text|container)', re.I))
            for block in main_blocks:
                for elem in block.find_all(['p', 'ul', 'ol', 'h2', 'h3', 'blockquote'], recursive=True):
                    txt = clean_text(elem.get_text())
                    if txt:
                        paragraphs.append(txt)
                        content_html += str(elem)
        excerpt = paragraphs[0] if paragraphs else ''
        content = '\n\n'.join(paragraphs)

        # Remove unwanted footer and navigation text from content and content_html

        # Aggressive removal of navigation/footer blocks
        FOOTER_PATTERNS = [
            r'By proceeding, I agree to the Terms of Use and the Privacy Policy.[\s\S]*$',
            r'(Home\s*Projects\s*Learn\s*Events\s*About\s*Contact Us\s*Shop USA\s*Shop UK\s*Give\s*Other Ways to Give\s*Legacy Giving\s*Donate Shares\s*VFI News App\s*VFI News\s*Roots & Reflections[\s\S]*)$',
            r'Vision for Israel\s*P\.O\. Box[\s\S]*?United States[\s\S]*?F: \+1 \(704\) 583-8308',
            r'Hazon Le’Israel[\s\S]*?F: \+972 \(8\) 978 6429',
            r'Vision for Israel is a 501\(c\)\(3\) tax-exempt charity\.[\s\S]*$',
        ]
        content = remove_footer(content)
        content_html = remove_footer(content_html)

        # Explicitly remove the provided unwanted text block
        UNWANTED_BLOCK = '''By proceeding, I agree to the Terms of Use and the Privacy Policy.'''
        content = content.replace(UNWANTED_BLOCK, '').strip()
        content_html = content_html.replace(UNWANTED_BLOCK, '').strip()

        return {
            'title': title,
            'excerpt': excerpt,
            'content': content,
            'content_html': content_html,
            'image': image_url,
            'link': url,
            'published': published
        }
    except Exception as e:
        print(f"    [ERROR] Failed to scrape article: {e}")
        return None

def main():
    """Main function to scrape all articles and save to catalog"""
    print("=" * 70)
    print("VFI Blog Scraper - Full Crawl")
    print("=" * 70)
    
    # Step 1: Get all article links from the blog listing pages
    article_links = get_article_links()
    print(f"Found {len(article_links)} articles.")
    
    articles = []
    # Step 2: Scrape each article
    for url in article_links:
        data = scrape_article(url)
        if data:
            articles.append(data)
        time.sleep(1)  # Be polite and don't hammer the server
    
    # Step 3: Save the scraped articles to the catalog file
    catalog = {
        'status': 'ok',
        'total_articles': len(articles),
        'articles': articles,
        'scraped_at': datetime.now().isoformat()
    }
    
    with open(CATALOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(articles)} articles to {CATALOG_FILE}")

if __name__ == '__main__':
    main()
