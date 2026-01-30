
file_path = r'd:\Ceylon-Deaf-Adventures\ceylon-deaf-adventures\src\app\pages\user\tours-page\tours-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check first line
if lines[0].strip().startswith("```"):
    print("Found markdown fence at start. Removing.")
    lines = lines[1:]

# Check last line
if lines[-1].strip().startswith("```"):
    print("Found markdown fence at end. Removing.")
    lines = lines[:-1]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Markdown fences removed.")
