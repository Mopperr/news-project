import requests
from bs4 import BeautifulSoup
import json
import time

# Project URLs from VFI website
projects = [
    {
        "name": "Shelter From Rocket Attacks",
        "url": "https://www.visionforisrael.com/en/project/shelter-from-rocket-attacks"
    },
    {
        "name": "Helping Holocaust Survivors in Israel",
        "url": "https://www.visionforisrael.com/en/project/helping-holocaust-survivors"
    },
    {
        "name": "Blessing Survivors of Terror",
        "url": "https://www.visionforisrael.com/en/project/survivors-of-terror"
    },
    {
        "name": "Pack to School Project",
        "url": "https://www.visionforisrael.com/en/project/pack-to-school-project"
    },
    {
        "name": "Helping Lone Soldiers Feel at Home",
        "url": "https://www.visionforisrael.com/en/project/helping-lone-soldiers"
    },
    {
        "name": "Aid for Families in Need",
        "url": "https://www.visionforisrael.com/en/project/aid-for-families-in-need"
    },
    {
        "name": "The Millennium Center—Center of Hope",
        "url": "https://www.visionforisrael.com/en/project/the-millennium-centercenter-of-hope"
    },
    {
        "name": "Ambulances, Medi-cycles, & Bloodmobiles",
        "url": "https://www.visionforisrael.com/en/project/ambulances-medi-cycles--bloodmobiles-lifelines-of-hope"
    },
    {
        "name": "Assisting New Immigrants",
        "url": "https://www.visionforisrael.com/en/project/assisting-new-immigrants"
    },
    {
        "name": "First Response & Disaster Relief",
        "url": "https://www.visionforisrael.com/en/project/first-response--disaster-relief"
    },
    {
        "name": "Renovations Fund—Rebuilding Broken Lives",
        "url": "https://www.visionforisrael.com/en/project/renovations-fundrebuilding-broken-lives"
    },
    {
        "name": "Feeding Programs for Schools",
        "url": "https://www.visionforisrael.com/en/project/feeding-programs-for-schools--children-with-special-needs"
    },
    {
        "name": "Providing for At-Risk Children",
        "url": "https://www.visionforisrael.com/en/project/providing-for-at-risk-children"
    }
]

results = []

print("Extracting project images from VFI website...")
print("=" * 60)

for project in projects:
    try:
        print(f"\nFetching: {project['name']}")
        response = requests.get(project['url'], timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try to find the main project image - look for various patterns
        image_url = None
        
        # Look for hero/banner images
        hero_img = soup.find('img', class_=lambda x: x and ('hero' in x.lower() or 'banner' in x.lower() or 'featured' in x.lower()))
        if hero_img and hero_img.get('src'):
            image_url = hero_img['src']
        
        # Look for Open Graph image
        if not image_url:
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                image_url = og_image['content']
        
        # Look for first large image in content area
        if not image_url:
            content_imgs = soup.find_all('img', src=lambda x: x and 'prismic.io' in x)
            if content_imgs:
                # Get the first image that's likely substantial (has certain size params or is in main content)
                for img in content_imgs:
                    src = img.get('src', '')
                    if 'vfi-website' in src and not any(skip in src.lower() for skip in ['logo', 'icon', 'thumb']):
                        image_url = src
                        break
        
        if image_url:
            # Ensure full URL
            if image_url.startswith('//'):
                image_url = 'https:' + image_url
            elif image_url.startswith('/'):
                image_url = 'https://www.visionforisrael.com' + image_url
            
            print(f"  ✓ Found image: {image_url[:80]}...")
            results.append({
                'name': project['name'],
                'url': project['url'],
                'image': image_url
            })
        else:
            print(f"  ✗ No image found")
            results.append({
                'name': project['name'],
                'url': project['url'],
                'image': None
            })
        
        # Be respectful with requests
        time.sleep(0.5)
        
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        results.append({
            'name': project['name'],
            'url': project['url'],
            'image': None,
            'error': str(e)
        })

# Save results
with open('project_images.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "=" * 60)
print(f"\nExtracted {len([r for r in results if r.get('image')])} images out of {len(projects)} projects")
print("Results saved to: project_images.json")
print("\nImage URLs:")
for result in results:
    if result.get('image'):
        print(f"\n{result['name']}:")
        print(f"  {result['image']}")
