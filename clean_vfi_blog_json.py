import json
import re

# List of unwanted phrases/blocks to remove (add more as needed)
UNWANTED_BLOCKS = [
    "Stay UPDATED on key events from around the world.LEARN how they relate to Biblical prophecies.PRAY for grace and provision where needed most.",
    "By proceeding, I agree to the <a href=\"/terms-of-use\">Terms of Use</a> and the <a href=\"/gdpr-privacy-policy\">Privacy Policy</a>.",
    "By subscribing, I agree to the Terms of Use and the Privacy Policy.",
    "By subscribing, I agree to the <a href=\"/terms-of-use\">Terms of Use </a>and the <a href=\"/gdpr-privacy-policy\">Privacy Policy</a>.",
    # Footer navigation blocks (HTML)
    '<p class="MuiTypography-root MuiTypography-body2">Home</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Projects</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Learn</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Events</p>',
    '<p class="MuiTypography-root MuiTypography-body2">About</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Contact Us</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Shop USA</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Shop UK</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Give</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Other Ways to Give</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Legacy Giving</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Donate Shares</p>',
    '<p class="MuiTypography-root MuiTypography-body2">VFI News App</p>',
    '<p class="MuiTypography-root MuiTypography-body2">VFI News</p>',
    '<p class="MuiTypography-root MuiTypography-body2">Roots &amp; Reflections</p>',
    # Address block (HTML)
    '<p><strong>Vision for Israel<br/></strong>P.O. Box 7743<br/>Charlotte, NC 28241<br/>United States<br/>E: <a href=\"mailto:info@visionforisrael.com\">info@visionforisrael.com</a><br/>T: <a href=\"tel:+17045838445\">+1 (704) 583-8445</a><br/>F: +1 (704) 583-8308</p><p><strong></p><p>',
    # Address block (plain text)
    "Vision for Israel\nP.O. Box 7743\nCharlotte, NC 28241\nUnited States\nE: info@visionforisrael.com\nT: +1 (704) 583-8445\nF: +1 (704) 583-8308",
]

# Load JSON
with open('vfi_blog_catalog.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_text(text):
    # Remove all repeated navigation/footer blocks, 'Stay UPDATED...' lines, 'By proceeding...' lines, all <p class="MuiTypography-root MuiTypography-body2">...</p> nav links, and address/contact blocks
    patterns = [
        r'(<p[^>]*class="MuiTypography-root MuiTypography-body2"[^>]*>.*?</p>\s*)+',
        r'(?is)<p[^>]*>\s*Stay UPDATED on key events from around the world\.<br\s*/?>LEARN how they relate to Biblical prophecies\.<br\s*/?>PRAY for grace and provision where needed most\.?\s*</p>',
        r'(?is)Stay UPDATED on key events from around the world\.LEARN how they relate to Biblical prophecies\.PRAY for grace and provision where needed most\.?',
        r'(?is)<p[^>]*>\s*By proceeding,? I agree to the <a [^>]+>Terms of Use</a> and the <a [^>]+>Privacy Policy</a>\.?\s*</p>',
        r'(?is)By proceeding,? I agree to the Terms of Use and the Privacy Policy\.?',
        r'(?is)<p[^>]*>\s*By subscribing,? I agree to the <a [^>]+>Terms of Use</a> and the <a [^>]+>Privacy Policy</a>\.?\s*</p>',
        r'(?is)By subscribing,? I agree to the Terms of Use and the Privacy Policy\.?',
        r'(?is)<p[^>]*><strong>Vision for Israel<br\s*/?></strong>P\.O\. Box 7743<br\s*/?>Charlotte, NC 28241<br\s*/?>United States<br\s*/?>E: <a [^>]+>info@visionforisrael.com</a><br\s*/?>T: <a [^>]+>\+1 \(704\) 583-8445</a><br\s*/?>F: \+1 \(704\) 583-8308</p>',
        r'(?is)Vision for Israel\s*P\.O\. Box 7743\s*Charlotte, NC 28241\s*United States\s*E: info@visionforisrael.com\s*T: \+1 \(704\) 583-8445\s*F: \+1 \(704\) 583-8308',
        r'(Home\s*Projects\s*Learn\s*Events\s*About\s*Contact Us\s*Shop USA\s*Shop UK\s*Give\s*Other Ways to Give\s*Legacy Giving\s*Donate Shares\s*VFI News App\s*VFI News\s*Roots & Reflections)',
        r"Stay UPDATED on key events from around the world\.?\s*LEARN how they relate to Biblical prophecies\.?\s*PRAY for grace and provision where needed most\.?",
        r"By proceeding,? I agree to the (Terms of Use( and the Privacy Policy)?|Terms of Use and the Privacy Policy)\.?",
        r"By subscribing,? I agree to the (Terms of Use( and the Privacy Policy)?|Terms of Use and the Privacy Policy)\.?",
        r"By subscribing,? I agree to the <a href=\\?\"/terms-of-use\\?\">Terms of Use ?</a>and the <a href=\\?\"/gdpr-privacy-policy\\?\">Privacy Policy</a>\.?",
        r"<p>Stay UPDATED on key events from around the world\.<br\s*/?>LEARN how they relate to Biblical prophecies\.<br\s*/?>PRAY for grace and provision where needed most\.<\/p>",
        r"<p>By proceeding, I agree to the <a href=\\?\"/terms-of-use\\?\">Terms of Use<\/a> and the <a href=\\?\"/gdpr-privacy-policy\\?\">Privacy Policy<\/a>\.<\/p>",
        r"<p>By subscribing, I agree to the <a href=\\?\"/terms-of-use\\?\">Terms of Use<\/a> and the <a href=\\?\"/gdpr-privacy-policy\\?\">Privacy Policy<\/a>\.<\/p>",
        r"(?:<p class=\\?\"MuiTypography-root MuiTypography-body2\\?\">.*?</p>\s*)+",
        r"<p><strong>Vision for Israel<br\s*/?></strong>P\.O\. Box 7743<br\s*/?>Charlotte, NC 28241<br\s*/?>United States<br\s*/?>E: <a href=\\?\"mailto:info@visionforisrael.com\\?\">info@visionforisrael.com</a><br\s*/?>T: <a href=\\?\"tel:\+17045838445\\?\">\+1 \(704\) 583-8445</a><br\s*/?>F: \+1 \(704\) 583-8308</p>",
        r"Vision for Israel\s*P\.O\. Box 7743\s*Charlotte, NC 28241\s*United States\s*E: info@visionforisrael.com\s*T: \+1 \(704\) 583-8445\s*F: \+1 \(704\) 583-8308",
        r"<p><strong></p><p>",
        r"\n+",
    ]
    for pat in patterns:
        text = re.sub(pat, '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'^(<p>\s*</p>|<br\s*/?>|\s*)+', '', text, flags=re.DOTALL)
    return text


# Support both old and new JSON structure (with or without 'articles' key)
def clean_articles(articles):
    for article in articles:
        if 'content' in article:
            article['content'] = clean_text(article['content'])
            # Remove trailing whitespace, <p>, <br>, or empty tags
            article['content'] = re.sub(r'(\s*<p>\s*</p>|<br\s*/?>|\s*)+$', '', article['content'], flags=re.DOTALL)
        if 'content_html' in article:
            article['content_html'] = clean_text(article['content_html'])
            article['content_html'] = re.sub(r'(\s*<p>\s*</p>|<br\s*/?>|\s*)+$', '', article['content_html'], flags=re.DOTALL)

if isinstance(data, dict) and 'articles' in data:
    clean_articles(data['articles'])
else:
    clean_articles(data)

# Save cleaned JSON
with open('vfi_blog_catalog_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
