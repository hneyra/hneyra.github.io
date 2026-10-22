"""Checks every internal link, image, script, stylesheet and #anchor in the built site.

    python3 scripts/check-links.py _site [baseurl]

Exits with an error if anything points to a missing file or anchor (for example
a "Download CV" button whose PDF was not generated).
"""
import sys, os, re
from html.parser import HTMLParser
site = sys.argv[1]
base = (sys.argv[2] if len(sys.argv) > 2 else '').rstrip('/')
class P(HTMLParser):
    def __init__(s): super().__init__(); s.links=[]; s.ids=set()
    def handle_starttag(s, tag, a):
        a=dict(a)
        if 'id' in a: s.ids.add(a['id'])
        for k in ('href','src'):
            if k in a and a[k]: s.links.append((tag,a[k]))
        if tag=='meta' and a.get('property','').startswith('og:image') and a.get('content','').startswith('http'): s.links.append(('og',a['content']))
pages={}
for root,_,files in os.walk(site):
    for f in files:
        if f.endswith('.html'):
            p=P(); p.feed(open(os.path.join(root,f),encoding='utf8').read()); pages[os.path.relpath(os.path.join(root,f),site)]=p
errors=0; checked=0
def resolve(path):
    rel=path[len(base):] if base and path.startswith(base) else None
    if base and rel is None: return None
    rel=(rel if base else path).lstrip('/')
    full=os.path.join(site,rel)
    if os.path.isdir(full): full=os.path.join(full,'index.html')
    return full
for page,p in pages.items():
    for tag,u in p.links:
        if u.startswith(('mailto:','data:')): continue
        if u.startswith('http'):
            if 'localhost' in u or 'hneyra.github.io' in u:
                u=re.sub(r'^https?://[^/]+','',u)
            else: continue
        path,_,frag=u.partition('#')
        checked+=1
        if path=='' : target=page
        else:
            if not path.startswith('/'): print('RELATIVE', page, u); errors+=1; continue
            full=resolve(path)
            if full is None: print('MISSING BASEURL', page, u); errors+=1; continue
            if not os.path.exists(full): print('BROKEN', page, u); errors+=1; continue
            target=os.path.relpath(full,site)
        if frag and target in pages and frag not in pages[target].ids:
            print('BAD ANCHOR', page, u); errors+=1
print(f"{len(pages)} pages, {checked} internal links checked, {errors} errors")
sys.exit(1 if errors else 0)
