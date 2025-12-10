import re

with open('about.html', 'r') as f:
    content = f.read()

# Find all divs with grid-template-columns in their style attribute
print("=== Testing CSS Selector Effectiveness ===\n")

# Test selector: div[style*="grid-template-columns: repeat(4"]
pattern = r'style="[^"]*grid-template-columns: repeat\(4[^"]*"'
matches = re.findall(pattern, content)
print(f"Divs with 'repeat(4, 1fr)':")
print(f"  Found: {len(matches)} matches")
if matches:
    print(f"  Example: {matches[0][:80]}...")

print()

# Test selector: div[style*="grid-template-columns: repeat(3"]
pattern = r'style="[^"]*grid-template-columns: repeat\(3[^"]*"'
matches = re.findall(pattern, content)
print(f"Divs with 'repeat(3, 1fr)':")
print(f"  Found: {len(matches)} matches")

print()

# Test selector: div[style*="grid-template-columns: 1fr 1fr"]
pattern = r'style="[^"]*grid-template-columns: 1fr 1fr[^"]*"'
matches = re.findall(pattern, content)
print(f"Divs with '1fr 1fr' grid:")
print(f"  Found: {len(matches)} matches")

print("\n=== Expected Responsive Behavior ===")
print("✓ Mobile (320-479px):")
print("  - Timeline: 4 cols → 1 col")
print("  - Core Values: 4 cols → 1 col")
print("  - Endorsements: 3 cols → 1 col")
print("  - Leadership: 2 cols → 1 col")
print("  - Transparency: 3 cols → 1 col")

print("\n✓ Tablet (480-767px):")
print("  - Timeline: 4 cols → 2 cols")
print("  - Core Values: 4 cols → 2 cols")
print("  - Endorsements: 3 cols → 1 col")

print("\n✓ Tablet XL (768-1023px):")
print("  - Timeline: 4 cols → 2 cols")
print("  - Core Values: 4 cols → 2 cols")
print("  - Endorsements: 3 cols → 2 cols")

print("\n✓ Desktop (1024px+):")
print("  - All grids at full width (4/3/2 cols)")
