
import re

file_path = r'd:\Ceylon-Deaf-Adventures\ceylon-deaf-adventures\src\app\pages\user\tours-page\tours-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Total length: {len(content)}")

# Check backticks
backticks = [m.start() for m in re.finditer(r'`', content)]
print(f"Backticks found at indices: {backticks}")
print(f"Total backticks: {len(backticks)}")

# We expect:
# 1. template: ` ... `
# 2. styles: [` ... `]
# So 4 backticks minimum.

if len(backticks) < 4:
    print("CRITICAL: Fewer than 4 backticks found. File structure is broken.")

# Regex to find template and styles
template_match = re.search(r'template:\s*`', content)
if template_match:
    print(f"Template starts at: {template_match.start()}")
else:
    print("Template start not found")

styles_match = re.search(r'styles:\s*\[\s*`', content)
if styles_match:
    print(f"Styles start at: {styles_match.start()}")
else:
    print("Styles start not found")

# Fix CSS properties: "word - word" -> "word-word"
# This identifies patterns like "grid-template - columns"
def fix_css_hyphens(match):
    return f"{match.group(1)}-{match.group(2)}"

# Fix 1: Specific CSS properties seen in errors
# grid-template - columns
# flex - direction
# align - items
# justify - content
# border - radius
# border - color
# font - size
# font - weight
# margin - right
# margin - bottom
# margin - top
# line - height
# z - index
# max - width
# max - height
# background - color
# object - fit
# backdrop - filter
# box - shadow

# Pattern: word - word (with spaces)
# We need to be careful not to merge "10px - 5px" (calc) but typically CSS properties don't have spaces around hyphens.
# Angular style classes: "mat-mdc - chip" -> "mat-mdc-chip" also needs fixing.

# Let's be aggressive with hyphen fixing inside the styles block if we can find it.
# But simply applying to the whole file might be safe enough for these specific patterns.
# We will target common CSS property patterns.

properties = [
    'grid-template', 'flex-direction', 'align-items', 'justify-content',
    'border-radius', 'border-color', 'font-size', 'font-weight',
    'margin-right', 'margin-bottom', 'margin-top', 'margin-left',
    'line-height', 'z-index', 'max-width', 'max-height', 'min-width',
    'background-color', 'object-fit', 'backdrop-filter', 'box-shadow',
    'text-align', 'display', 'position', 'overflow', 'opacity', 'transform',
    'transition', 'padding', 'gap', 'color', 'background', 'width', 'height'
]

# Fix "property - suffix" e.g. "grid-template - columns"
content = re.sub(r'([a-zA-Z]+)\s+-\s+([a-zA-Z]+)', r'\1-\2', content)

# Fix "mat-mdc - thing" which might be "mat - mdc - thing"
# The regex above handles one pair. "mat - mdc" -> "mat-mdc".
# Run it twice?
content = re.sub(r'([a-zA-Z0-9]+)\s+-\s+([a-zA-Z0-9]+)', r'\1-\2', content)
content = re.sub(r'([a-zA-Z0-9]+)\s+-\s+([a-zA-Z0-9]+)', r'\1-\2', content)

# Fix :: ng-deep -> ::ng-deep
content = content.replace(':: ng-deep', '::ng-deep')

# Fix : host -> :host
content = content.replace(': host', ':host')

# Fix css values like "1.5s ease -in -out" -> "1.5s ease-in-out"
content = content.replace('ease -in -out', 'ease-in-out')
content = content.replace('ease -out', 'ease-out')
content = content.replace('ease -in', 'ease-in')

# Fix units? "12 px" -> "12px" (The error logs showed "12px" correctly though, but maybe?)
# Actually the Error "An identifier or keyword cannot immediately follow a numeric literal" 
# at "12px" implies "12" then "px". Wait. 12px IS a valid identifier in CSS but invalid in TS.
# So this confirms it's being parsed as TS.

# Saving the file
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS hyphens fixed.")
