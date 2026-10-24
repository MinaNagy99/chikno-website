#!/usr/bin/env python3
"""Builds the Chikno site.
  dist/<page>.html     – self-contained pages that link to each other (keep them in one folder)
  dist/chikno-full.html – the WHOLE site in one file (all pages, navigation, cart) – opens anywhere
"""
import re, json, pathlib
ROOT = pathlib.Path(__file__).parent
SRC, DIST = ROOT / 'src', ROOT / 'dist'
DIST.mkdir(exist_ok=True)
read = lambda p: (SRC / p).read_text(encoding='utf-8')

# Everything is local – no internet needed (fonts, animation libraries and photos are bundled).
ASSETS = ROOT / 'assets_src'
LIBS = ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js', 'img.js']
CDN = ''.join(f'<script src="assets/{n}"></script>\n' for n in LIBS)
CDN_INLINE = ''.join(f'<script>\n{(ASSETS / n).read_text(encoding="utf-8")}\n</script>\n' for n in LIBS)
(DIST / 'assets').mkdir(parents=True, exist_ok=True)
for n in LIBS + ['fonts.css']:
    (DIST / 'assets' / n).write_bytes((ASSETS / n).read_bytes())
EARLY = ("<script>(function(){var d=document.documentElement;"
         "function M(){try{if(parent!==window)return parent.__chkMem||(parent.__chkMem={l:{},s:{}})}catch(e){}return window.__chkMem||(window.__chkMem=window.__CHK_MEM||{l:{},s:{}})}"
         "function g(k){var v=null;try{v=localStorage.getItem(k)}catch(e){v=M().l[k]||null}try{return JSON.parse(v)}catch(e){return null}}"
         "function s(k){try{var v=sessionStorage.getItem(k);if(v!==null)return v}catch(e){}return k in M().s?M().s[k]:null}"
         "var l=g('chk-lang');if(l!=='en')l='ar';var t=g('chk-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');"
         "d.lang=l;d.dir=l==='ar'?'rtl':'ltr';d.dataset.theme=t;"
         "if(!s('chk-seen'))d.classList.add('first');if(s('chk-wipe')!==null)d.classList.add('wiping')})()</script>")
FONTS = '<link rel="stylesheet" href="assets/fonts.css">'
FONTS_INLINE = '<style>\n' + (ROOT / 'assets_src' / 'fonts.css').read_text(encoding='utf-8') + '</style>'
DESC = 'Chikno – Syrian shawarma and charcoal chicken on Faisal St, Giza. Concept website.'

core_css, core_js, data_js = read('core.css'), read('core.js'), read('data.js')
import base64
b64 = lambda n, t: f'data:{t};base64,' + base64.b64encode((ROOT / 'assets_src' / n).read_bytes()).decode()
core_css = core_css.replace('__LOGO_WORD__', b64('logo-word.webp', 'image/webp')).replace('__LOGO_TAG__', b64('logo-tag.png', 'image/png'))
sprite, top, bottom = read('partials/sprite.html'), read('partials/top.html'), read('partials/bottom.html')

HEAD_A = ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
          '<link rel="icon" type="image/png" href="'+__import__('base64').b64encode((ROOT/'assets_src'/'favicon.png').read_bytes()).decode().join(['data:image/png;base64,',''])+'">\n'
          f'<meta name="description" content="{DESC}">\n<meta name="theme-color" content="#120E0C">\n')
SHARED_HEAD = f'{EARLY}\n{FONTS}\n<style>\n{core_css}\n</style>\n'
SHARED_TAIL = f'{bottom}\n{CDN}<script>\n{data_js}\n</script>\n<script>\n{core_js}\n</script>\n'
B_HEAD = f'{EARLY}\n{FONTS_INLINE}\n<style>\n{core_css}\n</style>\n'
B_TAIL = f'{bottom}\n{CDN_INLINE}<script>\n{data_js}\n</script>\n<script>\n{core_js}\n</script>\n'

pages = {}
for page in sorted((SRC / 'pages').glob('*.html')):
    raw = page.read_text(encoding='utf-8')
    meta_line, rest = raw.split('\n', 1)
    meta = {k.strip(): v.strip() for k, v in (kv.split(':', 1) for kv in re.findall(r'(\w+:[^|>]+)', meta_line))}
    css, rest = rest.split('<!--BODY-->', 1)
    body, script = rest.split('<!--SCRIPT-->', 1)
    name = meta['page']
    attrs = f'data-page="{name}"' + (' data-cbar' if 'cbar' in meta_line else '') + (' class="no-wa"' if 'no-wa' in meta_line else '')
    t = re.sub(r'<!--ANN-->.*?<!--/ANN-->', '', top, flags=re.S) if 'no-ann' in meta_line else top
    file = 'index.html' if name == 'home' else f'{name}.html'
    pages[file] = dict(name=name, title=meta.get('title', 'تشيكنو'), css=css.strip(), attrs=attrs,
                       top=re.sub(rf'(data-nav="{name}")', r'\1 aria-current="page"', sprite + t),
                       body=body.strip(), script=script.strip())

def mark(html, name):
    return re.sub(rf'(data-nav="{name}")(?! aria-current)', r'\1 aria-current="page"', html)

# 1) separate pages
for file, p in pages.items():
    html = (f'<!doctype html>\n<html lang="ar" dir="rtl" data-theme="dark">\n<head>\n{HEAD_A}<title>{p["title"]}</title>\n'
            f'{SHARED_HEAD}{p["css"]}\n</head>\n<body {p["attrs"]}>\n{p["top"]}\n{p["body"]}\n{mark(SHARED_TAIL, p["name"])}{p["script"]}\n</body>\n</html>\n')
    (DIST / file).write_text(html, encoding='utf-8')
    print(f'built {file:16} {len(html)//1024:4d} KB')

# 2) everything in one file: a shell that renders each page into a full-screen frame
HEAD_ICON = HEAD_A.split('\n')[2]
def js(s):
    return json.dumps(s, ensure_ascii=False).replace('</', '<\\/')
bundle_pages = {f: {k: p[k] for k in ('name', 'title', 'css', 'attrs', 'top', 'body', 'script')} for f, p in pages.items()}
shell = f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>تشيكنو – Chikno</title>
<meta name="description" content="{DESC}">
<meta name="theme-color" content="#120E0C">
{HEAD_ICON}
<style>html,body{{margin:0;height:100%;background:#120E0C;overflow:hidden}}#chk{{position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:#120E0C}}</style>
</head>
<body>
<iframe id="chk" title="Chikno" allow="clipboard-write; web-share; fullscreen"></iframe>
<script>
(function(){{
var PAGES={js(bundle_pages)};
var HEAD_A={js(HEAD_A)}, SHARED_HEAD={js(B_HEAD)}, SHARED_TAIL={js(B_TAIL)};
var f=document.getElementById('chk');
function esc(s){{return String(s).replace(/\\\\/g,'\\\\\\\\').replace(/'/g,"\\\\'").replace(/</g,'\\\\x3c');}}
function build(file,hash){{var p=PAGES[file]||PAGES['404.html'];
  var tail=SHARED_TAIL.replace('data-nav="'+p.name+'"','data-nav="'+p.name+'" aria-current="page"');
  var pre='<script>window.__CHK_FILE=\\''+esc(PAGES[file]?file:'404.html')+'\\';window.__CHK_HASH=\\''+esc(hash||'')+'\\';window.__CHK_MEM='+JSON.stringify(window.__chkMem||{{l:{{}},s:{{}}}}).replace(/</g,'\\\\u003c')+';<\\/script>';
  return '<!doctype html><html lang="ar" dir="rtl" data-theme="dark"><head>'+HEAD_A+'<title>'+p.title+'</title>'+pre+SHARED_HEAD+p.css+'</head><body '+p.attrs+'>'+p.top+p.body+tail+p.script+'</body></html>';}}
function parse(h){{h=(h||'').replace(/^#\\/?/,'');if(!h)return ['index.html',''];var i=h.indexOf('#');var file=i<0?h:h.slice(0,i),hash=i<0?'':h.slice(i);if(!/\\.html$/.test(file))file+='.html';return [file,hash];}}
function show(file,hash){{f.srcdoc=build(file,hash);}}
window.__chkNav=function(href){{var r=parse(href);var url='#/'+r[0]+r[1];try{{history.pushState(null,'',url);}}catch(e){{}}show(r[0],r[1]);}};
window.addEventListener('message',function(e){{if(e.source!==f.contentWindow||!e.data)return;if(e.data.chkMem)window.__chkMem=e.data.chkMem;if(typeof e.data.chkNav==='string')window.__chkNav(e.data.chkNav);}});
window.addEventListener('popstate',function(){{var r=parse(location.hash);show(r[0],r[1]);}});
f.addEventListener('load',function(){{try{{document.title=f.contentDocument.title;f.contentWindow.focus();}}catch(e){{}}}});
var r=parse(location.hash);show(r[0],r[1]);
}})();
</script>
</body>
</html>
"""
(DIST / 'chikno-full.html').write_text(shell, encoding='utf-8')
print(f'built chikno-full.html {len(shell)//1024} KB (all {len(pages)} pages)')
