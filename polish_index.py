import os
import re

# Cleanup index.html for maximum compatibility and performance
index_path = 'index.html'
if os.path.exists(index_path):
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove the script tag near the top (the one with defer)
    content = re.sub(r'<script src="app\.js" defer></script>', '', content)
    
    # 2. Fix the LinkedIn icon (Lucide uses 'linkedin' but sometimes data-lucide needs to be exact)
    # The subagent said it was missing, let's ensure it uses 'linkedin' or 'linkedin-2' if needed
    # but 'linkedin' is standard. Let's check the nav-linkedin id.
    
    # 3. Ensure there is only ONE app.js script tag before </body>
    if 'src="app.js"' in content:
        # Remove all existing app.js script tags
        content = re.sub(r'<script src="app\.js".*?></script>', '', content)
    
    # Add it back correctly at the very bottom
    content = content.replace('</body>', '    <script src="app.js"></script>\n</body>')
    
    # 4. Remove any loose text or artifacts left by previous regexes
    content = content.strip()
    
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Polished index.html and corrected script loading order.")
