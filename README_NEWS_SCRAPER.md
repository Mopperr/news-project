# Pro-Israel News Scraper

This system fetches latest news articles from trusted pro-Israel news sources.

## 📰 News Sources

The scraper fetches articles from:

1. **Jerusalem Post** - Israel's leading English newspaper
2. **Times of Israel** - Breaking news from Israel
3. **Israel Hayom** - Israel's most-read newspaper
4. **Arutz Sheva / Israel National News** - Religious Zionist news
5. **Jewish News Syndicate (JNS)** - Jewish & Israel news
6. **The Algemeiner** - Jewish newspaper covering Israel
7. **Israel 21c** - Innovation and culture from Israel
8. **United With Israel** - Pro-Israel advocacy news
9. **Honest Reporting** - Media bias watchdog

## 🚀 How to Use

### Step 1: Run the Scraper

Double-click `update_pro_israel_news.bat` to fetch the latest news.

Or run manually:
```bash
python pro_israel_news_scraper.py
```

This will:
- Fetch 10-15 articles from each source
- Extract article images from multiple sources
- Get full article content where available
- Save everything to `pro_israel_news.json`

### Step 2: View on Website

Open `index.html` in your browser. You'll see:
- All articles from all sources
- **Filter by Source** buttons at the top
- Click any source to see only articles from that outlet
- Click "All Sources" to see everything

## 📂 Files

- `pro_israel_news_scraper.py` - Main scraper script
- `update_pro_israel_news.bat` - Easy-to-run batch file
- `pro_israel_news.json` - Generated news data
- `index.html` - Displays the news with filtering
- `index.js` - Handles filtering and article display

## 🔧 Technical Details

### Image Extraction
The scraper tries multiple methods to find article images:
1. RSS media:content tags
2. RSS media:thumbnail tags
3. RSS enclosure tags
4. Parsing article content for `<img>` tags
5. Fetching article page and checking:
   - `og:image` meta tags
   - `twitter:image` meta tags
   - First image in article body

### Article Content
Full text is extracted from:
1. RSS content field
2. RSS summary field
3. RSS description field
4. Fallback: "Read full article at source"

### Filtering
Articles are filtered by source name:
- Source names are normalized: "Jerusalem Post" → "jerusalem_post"
- Click filter buttons to show only articles from that source
- Each article includes source metadata for filtering

## 📊 Data Format

`pro_israel_news.json` structure:
```json
{
  "status": "ok",
  "totalArticles": 95,
  "articles": [
    {
      "title": "Article Title",
      "link": "https://...",
      "published": "2025-01-04 15:30:00",
      "description": "Short summary...",
      "content": "Full article text...",
      "image": "https://...jpg",
      "author": "Author Name",
      "source": "Jerusalem Post",
      "category": ["jerusalem_post"]
    }
  ],
  "sources": ["Jerusalem Post", "Times of Israel", ...],
  "lastUpdated": "2025-01-04 15:30:00"
}
```

## 🔄 Updating News

Run the scraper regularly to get fresh news:
- **Manual:** Double-click `update_pro_israel_news.bat`
- **Scheduled:** Use Windows Task Scheduler to run automatically
  - Right-click Task Scheduler → Create Basic Task
  - Schedule: Every 4-6 hours
  - Action: Start program → select `update_pro_israel_news.bat`

## 🛠️ Requirements

Python packages (automatically installed):
- `feedparser` - Parse RSS feeds
- `beautifulsoup4` - Extract HTML content
- `requests` - Fetch web pages

## 🐛 Troubleshooting

**No articles showing?**
- Make sure `pro_israel_news.json` exists
- Run `update_pro_israel_news.bat` first
- Check console for errors (F12 in browser)

**Some sources have 0 articles?**
- Some RSS feeds may have parsing errors
- This is normal - other sources will still work
- Check scraper output for error messages

**Images not showing?**
- Some sources don't provide images in RSS feeds
- Scraper tries to fetch from article pages (slower)
- Some images may fail to load (broken links)

## 📝 Customization

### Add More Sources
Edit `pro_israel_news_scraper.py`, add to `RSS_FEEDS` dictionary:
```python
RSS_FEEDS = {
    'Your Source': 'https://example.com/rss',
    # ... existing sources
}
```

### Change Article Limit
In `scrape_rss_feed()` function:
```python
articles = scrape_rss_feed(feed_url, source_name, max_articles=15)  # Change 15 to desired number
```

### Add Filter Buttons
Edit `index.html`, add button:
```html
<button class="category-btn" data-source="your_source">
    <i class="fas fa-newspaper"></i> Your Source
</button>
```

## 🎨 Styling

Category buttons styled in `styles.css`:
- `.category-btn` - Button styling
- `.category-btn.active` - Selected button
- `.category-filter` - Filter section background

## ⚡ Performance

- Scraper runs in ~30-60 seconds (10 sources)
- Polite 1-second delay between sources
- Images loaded on-demand in browser
- Filters work instantly (client-side)

## 📜 License

Free to use and modify for pro-Israel advocacy and education.
