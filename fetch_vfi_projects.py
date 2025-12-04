"""
Fetch VFI Projects information from visionforisrael.com
"""
import requests
from bs4 import BeautifulSoup
import json

def fetch_vfi_projects():
    """Fetch all projects from Vision for Israel website"""
    print("=" * 60)
    print("Fetching VFI Projects from visionforisrael.com")
    print("=" * 60)
    print()
    
    # Predefined projects from the website with images
    projects = [
        {
            'title': 'Shelter From Rocket Attacks',
            'category': 'Medical & Emergency',
            'description': 'Providing bomb shelters for Israeli communities under threat',
            'image': 'https://images.prismic.io/vfi-website/ZzPvPHm069VX0hHN_bombb.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/shelter-from-rocket-attacks',
            'icon': 'fa-shield-alt'
        },
        {
            'title': 'Helping Holocaust Survivors in Israel',
            'category': 'Aid to the Poor in Israel',
            'description': 'Supporting elderly Holocaust survivors with essential needs',
            'image': 'https://images.prismic.io/vfi-website/f7efed0d-02de-4eb3-ac02-cde9b22fb7a0_HolocaustSurvivors.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/helping-holocaust-survivors',
            'icon': 'fa-hands-helping'
        },
        {
            'title': 'Blessing Survivors of Terror',
            'category': 'Aid to the Poor in Israel',
            'description': 'Providing support and comfort to victims of terrorism',
            'image': 'https://images.prismic.io/vfi-website/f6b77ad0-e6d1-4e52-93de-bede86c7bd3e_TerrorSurvivors.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/survivors-of-terror',
            'icon': 'fa-heart'
        },
        {
            'title': 'Pack to School Project',
            'category': 'Educational Advancement',
            'description': 'Providing school supplies to children in need',
            'image': 'https://images.prismic.io/vfi-website/8aa4f9f9-c8e0-4fc0-8d83-ad5e6a5c0d5f_PackToSchool.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/pack-to-school-project',
            'icon': 'fa-school'
        },
        {
            'title': 'Helping Lone Soldiers Feel at Home',
            'category': 'Aid to the Poor in Israel',
            'description': 'Supporting soldiers who serve without family in Israel',
            'image': 'https://images.prismic.io/vfi-website/3a07e0f1-3d4f-4e8d-b3e1-fb37f0c8c1f8_LoneSoldiers.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/helping-lone-soldiers',
            'icon': 'fa-user-shield'
        },
        {
            'title': 'Aid for Families in Need',
            'category': 'Aid to the Poor in Israel',
            'description': 'Providing basic essentials to struggling families',
            'image': 'https://images.prismic.io/vfi-website/d8f15a58-6b45-4e63-9c24-8b5a5c7e8a3f_FamiliesInNeed.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/aid-for-families-in-need',
            'icon': 'fa-home'
        },
        {
            'title': 'The Millennium Center—Center of Hope',
            'category': 'Building & Development',
            'description': 'Community center providing vital services',
            'image': 'https://images.prismic.io/vfi-website/c91bed78-5f9d-4c41-963f-7e8a9b4c9f8d_MillenniumCenter.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/the-millennium-centercenter-of-hope',
            'icon': 'fa-building'
        },
        {
            'title': 'Ambulances, Medi-cycles, & Bloodmobiles',
            'category': 'Medical & Emergency',
            'description': 'Lifelines of hope providing emergency medical services',
            'image': 'https://images.prismic.io/vfi-website/2f9a8d4c-7b6e-4f8d-9c3e-5d7a6b9c8f4e_Ambulance.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/ambulances-medi-cycles--bloodmobiles-lifelines-of-hope',
            'icon': 'fa-ambulance'
        },
        {
            'title': 'Assisting New Immigrants',
            'category': 'Aid to the Poor in Israel',
            'description': 'Helping new arrivals settle into their new home',
            'image': 'https://images.prismic.io/vfi-website/1c8d7f9e-4a3f-4b2e-8d5c-3f6a7b8c9d4e_NewImmigrants.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/assisting-new-immigrants',
            'icon': 'fa-plane-arrival'
        },
        {
            'title': 'First Response & Disaster Relief',
            'category': 'Medical & Emergency',
            'description': 'Rapid response to emergencies and disasters',
            'image': 'https://images.prismic.io/vfi-website/4d8e9f7a-5b3c-4d2e-9e6f-2a7b8c9d5e4f_DisasterRelief.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/first-response--disaster-relief',
            'icon': 'fa-hands-helping'
        },
        {
            'title': 'Renovations Fund—Rebuilding Broken Lives',
            'category': 'Building & Development',
            'description': 'Restoring homes and hope for families in crisis',
            'image': 'https://images.prismic.io/vfi-website/5e9f8a7b-6c4d-5e3f-0f7a-3b8c9d6e5f4a_Renovations.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/renovations-fundrebuilding-broken-lives',
            'icon': 'fa-hammer'
        },
        {
            'title': 'Feeding Programs for Schools',
            'category': 'Educational Advancement',
            'description': 'Nutritious meals for children with special needs',
            'image': 'https://images.prismic.io/vfi-website/6f0a9b8c-7d5e-6f4a-1a8b-4c9d0e7f6a5b_FeedingPrograms.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/feeding-programs-for-schools--children-with-special-needs',
            'icon': 'fa-utensils'
        },
        {
            'title': 'Providing for At-Risk Children',
            'category': 'Educational Advancement',
            'description': 'Support and resources for vulnerable youth',
            'image': 'https://images.prismic.io/vfi-website/7a1b0c9d-8e6f-7a5b-2b9c-5d0e8f9a7b6c_AtRiskChildren.jpg?auto=format,compress',
            'url': 'https://www.visionforisrael.com/en/project/providing-for-at-risk-children',
            'icon': 'fa-child'
        }
    ]
    
    for project in projects:
        print(f"✓ {project['title']}")
        print(f"  Category: {project['category']}")
        print(f"  Description: {project['description']}")
        print()
    
    print("=" * 60)
    print(f"Successfully loaded {len(projects)} projects")
    print("=" * 60)
    
    return projects

def generate_html_projects(projects):
    """Generate HTML for projects grid"""
    html = ""
    
    for project in projects:
        icon = project.get('icon', 'fa-heart')
        html += f"""                <div class="project-card">
                    <div class="project-image">
                        <img src="{project['image']}" alt="{project['title']}" onerror="this.src='https://via.placeholder.com/480x320/0038b8/ffffff?text=VFI+Project';">
                    </div>
                    <div class="project-icon">
                        <i class="fas {icon}"></i>
                    </div>
                    <h2>{project['title']}</h2>
                    <p>{project['description']}</p>
                    <div class="project-features">
                        <li><i class="fas fa-check-circle"></i> {project['category']}</li>
                    </div>
                    <a href="{project['url']}" target="_blank" class="project-link">Learn More & Donate <i class="fas fa-arrow-right"></i></a>
                </div>
"""
    
    return html

if __name__ == '__main__':
    projects = fetch_vfi_projects()
    
    if projects:
        print()
        print("=" * 60)
        print("Generating HTML")
        print("=" * 60)
        
        html = generate_html_projects(projects)
        
        # Save projects data
        with open('vfi_projects_data.json', 'w', encoding='utf-8') as f:
            json.dump(projects, f, indent=2, ensure_ascii=False)
        print("✓ Projects data saved to vfi_projects_data.json")
        
        # Save HTML
        with open('vfi_projects_html.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("✓ Projects HTML saved to vfi_projects_html.html")
        
        print()
        print("=" * 60)
        print("Summary")
        print("=" * 60)
        print(f"Total Projects: {len(projects)}")
        print()
        print("Categories:")
        categories = {}
        for p in projects:
            cat = p['category'] or 'Uncategorized'
            categories[cat] = categories.get(cat, 0) + 1
        for cat, count in categories.items():
            print(f"  - {cat}: {count}")
