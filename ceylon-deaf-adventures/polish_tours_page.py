
import re

file_path = r'd:\Ceylon-Deaf-Adventures\ceylon-deaf-adventures\src\app\pages\user\tours-page\tours-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix <tag[binding] -> <tag [binding]
content = re.sub(r'<([a-zA-Z0-9-]+)\[', r'<\1 [', content)

# Fix <tag*ngIf -> <tag *ngIf
content = re.sub(r'<([a-zA-Z0-9-]+)\*', r'<\1 *', content)

# Fix <tag(event) -> <tag (event)
content = re.sub(r'<([a-zA-Z0-9-]+)\(', r'<\1 (', content)

# Remove spaces before > if possible, just for cleanliness (optional)
# content = re.sub(r'\s+>', '>', content) # This might be risky for " >" string comparisons

# Clean up spaces in double braces {{ value }}
# content = re.sub(r'{{\s+', '{{ ', content)
# content = re.sub(r'\s+}}', ' }}', content)

# Fix specific mat- components that still look weird if any.
# Previous script seemingly did okay.

# Fix self closing tags like <br > or <img ... >
# It's valid but ...

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File polished.")
