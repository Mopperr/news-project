import json
import re

# The exact unwanted block as a single string (for multi-line matching)
UNWANTED_BLOCK = '''By proceeding, I agree to the Terms of Use and the Privacy Policy.

Home

Projects

Learn

Events

About

Contact Us

Shop USA

Shop UK

Give

Other Ways to Give

Legacy Giving

Donate Shares

VFI News App

VFI News

Roots & Reflections

Vision for Israel
P.O. Box 7743
Charlotte, NC 28241
United States
E: info@visionforisrael.com
T: +1 (704) 583-8445
F: +1 (704) 583-8308'''

# Compile a regex pattern that matches the block, allowing for optional whitespace and HTML tags between lines
def build_block_pattern(block):
    # Escape special regex chars, but allow for flexible whitespace and HTML tags between lines
    lines = [re.escape(line.strip()) for line in block.strip().split('\n') if line.strip()]
    # Allow for any whitespace, <br>, <p>, or <div> tags between lines
    joiner = r'(\s*<[^>]+>\s*|\s*\n\s*)*'
    pattern = joiner.join(lines)
    # Allow for optional whitespace/tags at start/end
    pattern = r'(?is)' + joiner + pattern + joiner
    return pattern

BLOCK_PATTERN = build_block_pattern(UNWANTED_BLOCK)

def remove_block(text):
    # Remove all occurrences of the block pattern
    return re.sub(BLOCK_PATTERN, '', text, flags=re.DOTALL|re.IGNORECASE)

def clean_article_fields(article):
    for field in ['content', 'content_html']:
        if field in article and isinstance(article[field], str):
            article[field] = remove_block(article[field])
            # Remove any leftover repeated blank lines or whitespace
            article[field] = re.sub(r'\n{2,}', '\n', article[field]).strip()

def main():
    # Load the cleaned JSON file
    with open('vfi_blog_catalog_cleaned.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Support both old and new JSON structure
    articles = data['articles'] if isinstance(data, dict) and 'articles' in data else data
    for article in articles:
        clean_article_fields(article)

    # Save the updated JSON
    with open('vfi_blog_catalog_cleaned.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
