critical = open('critical.css').read()
html = open('index.html').read()

old = (
    '    <link rel="preload" as="image" href="images/eljaya-hero.webp" type="image/webp" fetchpriority="high">\n'
    '    <link rel="preload" href="fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <link rel="preload" href="fonts/inter-700.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <link rel="preload" href="fonts/playfair-700.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <link rel="stylesheet" href="style.min.css">\n'
    '    <link rel="preload" href="fa.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n'
    '    <noscript><link rel="stylesheet" href="fa.min.css"></noscript>'
)

new = (
    '    <link rel="preload" as="image" href="images/eljaya-hero.webp" type="image/webp" fetchpriority="high">\n'
    '    <link rel="preload" href="fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <link rel="preload" href="fonts/inter-700.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <link rel="preload" href="fonts/playfair-700.woff2" as="font" type="font/woff2" crossorigin>\n'
    '    <style>' + critical + '</style>\n'
    '    <link rel="preload" href="style.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n'
    '    <noscript><link rel="stylesheet" href="style.min.css"></noscript>\n'
    '    <link rel="preload" href="fa.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n'
    '    <noscript><link rel="stylesheet" href="fa.min.css"></noscript>'
)

if old in html:
    open('index.html', 'w').write(html.replace(old, new))
    print('Done')
else:
    print('Pattern not found - checking actual content:')
    idx = html.find('style.min.css')
    print(repr(html[idx-200:idx+100]))
