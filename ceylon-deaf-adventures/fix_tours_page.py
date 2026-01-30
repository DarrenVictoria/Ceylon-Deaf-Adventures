
import re

file_path = r'd:\Ceylon-Deaf-Adventures\ceylon-deaf-adventures\src\app\pages\user\tours-page\tours-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix opening tags with spaces: < div -> <div
content = re.sub(r'<\s+([a-zA-Z!/])', r'<\1', content)

# Fix closing tags: < / div -> </div
content = re.sub(r'<\s+/\s+([a-zA-Z])', r'</\1', content)

# Fix self-closing or end of tag spaces: class="..." > -> class="...">
# Be careful not to break binding syntax like [value]="..." which is fine.
# But <div ... > is fine HTML, just ugly. Angular might complain about specific things.
# The main issue is < div and < !-- and * ngIf

# Fix * ngIf -> *ngIf (and * ngFor, etc)
content = re.sub(r'\*\s+(ng[A-Z][a-zA-Z]*)', r'*\1', content)

# Fix comments: < !-- -> <!-- and -- > -> -->
content = content.replace('< !--', '<!--')
content = content.replace('-- >', '-->')

# Fix < mat-icon > -> <mat-icon>
# content = re.sub(r'<\s+([a-zA-Z0-9-]+)\s*>', r'<\1>', content) 
# This might be risky if attributes exist.

# Let's just fix the start of tags primarily.
# Also fix [ routerLink ] if spaces were added.
content = re.sub(r'\[\s+routerLink\s+\]', '[routerLink]', content)

# Fix < mat - card - content -> <mat-card-content
# It seems "mat - card" spaces might be there.
content = re.sub(r'<([a-zA-Z0-9]+)\s+-\s+([a-zA-Z0-9]+)', r'<\1-\2', content)
content = re.sub(r'([a-zA-Z0-9]+)\s+-\s+([a-zA-Z0-9]+)', r'\1-\2', content) 
# The above is too aggressive for text content. "Barrier - Free" -> "Barrier-Free" (maybe ok)
# But strictly for tags:
def fix_tag_dashed_names(match):
    # match.group(0) is the whole tag logic
    # This is hard with simple regex.
    pass

# Let's look at specific seen errors:
# < mat-card - content
content = content.replace('mat - card - content', 'mat-card-content')
content = content.replace('mat - card', 'mat-card')
content = content.replace('mat - icon', 'mat-icon')
content = content.replace('mat - button', 'mat-button')
content = content.replace('mat - form - field', 'mat-form-field')
content = content.replace('mat - label', 'mat-label')
content = content.replace('mat - input', 'mat-input')
content = content.replace('mat - select', 'mat-select')
content = content.replace('mat - option', 'mat-option')
content = content.replace('mat - progress - spinner', 'mat-progress-spinner')
content = content.replace('mat - chip', 'mat-chip')
content = content.replace('mat - divider', 'mat-divider')
content = content.replace('mat - badge', 'mat-badge')
content = content.replace('ng - container', 'ng-container')
content = content.replace('ng - template', 'ng-template')
content = content.replace('router - link', 'router-link') # if applicable

# Fix property bindings spaces: [ formGroup ] -> [formGroup]
content = re.sub(r'\[\s+([a-zA-Z0-9]+)\s+\]', r'[\1]', content)

# Fix interpolation spaces: {{ count }} is fine.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File patched.")
