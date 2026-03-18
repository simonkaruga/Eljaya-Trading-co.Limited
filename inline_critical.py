import re

critical = open('critical.css').read()
html = open('index.html').read()

# Replace existing inline <style>...</style> block in head with new critical CSS
html = re.sub(r'<style>.*?</style>', '<style>' + critical + '</style>', html, count=1, flags=re.DOTALL)

open('index.html', 'w').write(html)
print('Done - critical CSS updated')
