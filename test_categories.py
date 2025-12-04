"""
Test script to verify category filtering works correctly
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8080/api"

def test_category(category):
    """Test fetching news for a specific category"""
    print(f"\n{'='*60}")
    print(f"Testing category: {category.upper()}")
    print('='*60)
    
    url = f"{BASE_URL}/news?category={category}"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        print(f"Status: {data.get('status')}")
        print(f"Total articles: {data.get('total_articles', 0)}")
        
        if data.get('news'):
            print(f"\nFirst 3 articles:")
            for i, article in enumerate(data['news'][:3], 1):
                print(f"\n{i}. {article.get('title', 'No title')}")
                print(f"   Source: {article.get('source', 'Unknown')}")
                print(f"   Categories: {', '.join(article.get('category', ['none']))}")
        else:
            print("No articles found")
            
    except Exception as e:
        print(f"Error: {str(e)}")

def test_all_categories():
    """Test all available categories"""
    categories = ['all', 'business', 'technology', 'politics', 'sports']
    
    print("Testing News Scraper Category Filtering")
    print("Make sure news_scraper.py is running on port 8080")
    
    for category in categories:
        test_category(category)
    
    print(f"\n{'='*60}")
    print("Testing complete!")
    print('='*60)

if __name__ == "__main__":
    test_all_categories()
