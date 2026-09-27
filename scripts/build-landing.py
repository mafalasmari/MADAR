#!/usr/bin/env python3
"""Generate the SEO layer of the static landing site in ../landing.

Run after any copy change in landing/index.html:

    python3 scripts/build-landing.py

What it does
- Writes the <head> SEO block (canonical, hreflang, Open Graph, Twitter,
  icons, JSON-LD) into landing/index.html between <!--SEO:START--> and
  <!--SEO:END-->.
- Generates landing/en.html: a fully pre-rendered English copy of the page,
  so search engines index the English text at /en (not only the Arabic).
- Adds canonical + icon tags to privacy.html and terms.html.
- Writes landing/sitemap.xml and landing/robots.txt.

index.html (Arabic) is the single source of truth. All English strings come
from the `dict.en` object inside it.
"""
import html
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import blog_content  # noqa: E402

SITE = "https://gomadar.sa"  # primary domain (no trailing slash)
LANDING = Path(__file__).resolve().parent.parent / "landing"

MARK = re.compile(r"<!--SEO:START-->.*?<!--SEO:END-->", re.S)


def read_dict(src: str, lang: str) -> dict:
    """Pull `key:'value'` pairs for one language out of the inline JS dict."""
    start = src.index(f"\n    {lang}:{{")
    end = src.index("\n    }", start)
    block = src[start:end]
    out = {}
    for k, v in re.findall(r"(\w+):'((?:[^'\\]|\\.)*)'", block):
        out[k] = v.replace("\\'", "'")
    return out


def jsonld(obj) -> str:
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>"


def icons() -> str:
    return (
        '<link rel="icon" href="/favicon.ico" sizes="any">\n'
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
        '<link rel="manifest" href="/site.webmanifest">'
    )


def seo_block(lang: str, d: dict) -> str:
    url = SITE + ("/en" if lang == "en" else "/")
    title, desc = d["_title"], d["_desc"]
    org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": SITE + "/#organization",
        "name": "MADAR",
        "alternateName": ["مدار", "MADAR Supply", "GoMadar"],
        "url": SITE + "/",
        "logo": SITE + "/logo.png",
        "description": d["_desc"],
        "address": {"@type": "PostalAddress", "addressLocality": "Riyadh", "addressCountry": "SA"},
        "areaServed": {"@type": "Country", "name": "Saudi Arabia"},
        "contactPoint": {"@type": "ContactPoint", "contactType": "customer support", "url": SITE + "/#contact",
                         "availableLanguage": ["Arabic", "English"]},
    }
    site = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "name": "مدار — MADAR",
        "url": SITE + "/",
        "inLanguage": ["ar", "en"],
        "publisher": {"@id": SITE + "/#organization"},
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": lang,
        "url": url,
        "mainEntity": [
            {"@type": "Question", "name": d[f"faq{i}Q"],
             "acceptedAnswer": {"@type": "Answer", "text": d[f"faq{i}A"]}}
            for i in range(1, 9)
        ],
    }
    e = html.escape
    loc, alt = ("en_US", "ar_SA") if lang == "en" else ("ar_SA", "en_US")
    return "\n".join([
        "<!--SEO:START-->",
        f'<link rel="canonical" href="{url}">',
        f'<link rel="alternate" hreflang="ar" href="{SITE}/">',
        f'<link rel="alternate" hreflang="en" href="{SITE}/en">',
        f'<link rel="alternate" hreflang="x-default" href="{SITE}/">',
        '<meta name="robots" content="index,follow,max-image-preview:large">',
        icons(),
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="MADAR — مدار">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:title" content="{e(title)}">',
        f'<meta property="og:description" content="{e(desc)}">',
        f'<meta property="og:image" content="{SITE}/og-image.png">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="MADAR">',
        f'<meta property="og:locale" content="{loc}">',
        f'<meta property="og:locale:alternate" content="{alt}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{e(title)}">',
        f'<meta name="twitter:description" content="{e(desc)}">',
        f'<meta name="twitter:image" content="{SITE}/og-image.png">',
        jsonld(org), jsonld(site), jsonld(faq),
        "<!--SEO:END-->",
    ])


def to_english(src: str, en: dict) -> str:
    out = src
    out = out.replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">', 1)
    out = re.sub(r"<title>.*?</title>", f"<title>{html.escape(en['_title'])}</title>", out, count=1)
    out = re.sub(r'<meta name="description" content="[^"]*">',
                 f'<meta name="description" content="{html.escape(en["_desc"])}">', out, count=1)

    missing = []

    def text(m):
        key = m.group(2)
        if key not in en:
            missing.append(key)
            return m.group(0)
        return m.group(1) + html.escape(en[key], quote=False) + m.group(4)

    out, n = re.subn(r'(<[^<>]*\bdata-i18n="(\w+)"[^<>]*>)([^<]*)(</)', text, out)

    def aria(m):
        tag, key = m.group(0), m.group(1)
        if key not in en:
            missing.append(key)
            return tag
        return re.sub(r'aria-label="[^"]*"', 'aria-label="' + html.escape(en[key]) + '"', tag, count=1)

    out = re.sub(r'<[^<>]*\bdata-i18n-aria="(\w+)"[^<>]*>', aria, out)
    out = re.sub(r'href="[^"]*"( data-href-ar="[^"]*" data-href-en="([^"]*)")', lambda m: f'href="{m.group(2)}"{m.group(1)}', out)
    out = out.replace('data-lang="ar" aria-pressed="true"', 'data-lang="ar" aria-pressed="false"', 1)
    out = out.replace('data-lang="en" aria-pressed="false"', 'data-lang="en" aria-pressed="true"', 1)
    out = out.replace('id="cf-language" value="ar"', 'id="cf-language" value="en"', 1)

    total = len(re.findall(r'\bdata-i18n="', src))
    if n != total or missing:
        raise SystemExit(f"English render incomplete: {n}/{total} text nodes, missing keys {missing}")
    return out


def patch_legal(name: str):
    p = LANDING / name
    s = p.read_text()
    s = re.sub(r'<link rel="icon" type="image/svg\+xml" href="data:[^\n]*', "<!--SEO:START--><!--SEO:END-->", s, count=1)
    slug = "/" + name.replace(".html", "")
    block = "\n".join(["<!--SEO:START-->", f'<link rel="canonical" href="{SITE}{slug}">', icons(), "<!--SEO:END-->"])
    s = MARK.sub(lambda _: block, s, count=1)
    p.write_text(s)


def main():
    idx = LANDING / "index.html"
    src = idx.read_text()
    assert "<!--SEO:START-->" in src, "SEO markers missing from index.html"
    ar, en = read_dict(src, "ar"), read_dict(src, "en")

    src = MARK.sub(lambda _: seo_block("ar", ar), src, count=1)
    idx.write_text(src)

    en_src = MARK.sub(lambda _: seo_block("en", en), to_english(src, en), count=1)
    (LANDING / "en.html").write_text(en_src)

    for name in ("privacy.html", "terms.html"):
        patch_legal(name)

    build_blog(src)

    # (url, arabic twin, english twin, priority)
    pairs = [("/", "/", "/en", "1.0"), ("/en", "/", "/en", "0.9"),
             ("/blog", "/blog", "/en/blog", "0.8"), ("/en/blog", "/blog", "/en/blog", "0.7")]
    for a in blog_content.ARTICLES:
        ar_u, en_u = f"/blog/{a['slug']}", f"/en/blog/{a['slug']}"
        pairs += [(ar_u, ar_u, en_u, "0.7"), (en_u, ar_u, en_u, "0.6")]
    rows = []
    for u, ar_u, en_u, p in pairs:
        alt = (f'<xhtml:link rel="alternate" hreflang="ar" href="{SITE}{ar_u}"/>'
               f'<xhtml:link rel="alternate" hreflang="en" href="{SITE}{en_u}"/>'
               f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{ar_u}"/>')
        lastmod = f"<lastmod>{blog_content.PUBLISHED}</lastmod>" if "/blog/" in u else ""
        rows.append(f"  <url><loc>{SITE}{u}</loc>{alt}{lastmod}<priority>{p}</priority></url>")
    for u in ("/privacy", "/terms"):
        rows.append(f"  <url><loc>{SITE}{u}</loc><priority>0.3</priority></url>")
    rows = "\n".join(rows)
    (LANDING / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        f"{rows}\n</urlset>\n")
    (LANDING / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
    print("built: index.html (ar), en.html, privacy.html, terms.html, blog (ar/en), sitemap.xml, robots.txt")


# ---------------------------------------------------------------- blog
BLOG_UI = {
    "ar": {"home": "الرئيسية", "blog": "المدونة", "other": "English", "other_lang": "en",
           "cta": "اطلب عرضاً تجريبياً", "cta_title": "ابدأ مع مدار اليوم",
           "cta_sub": "انضم إلى قائمة الشركاء المؤسسين، وتواصل معنا لطلب عرض تجريبي.",
           "related": "مقالات أخرى", "more": "اقرأ المقال", "skip": "تخطَّ إلى المحتوى",
           "crumbs": "مسار التنقل", "nav": "التنقل الرئيسي", "by": "مدار",
           "copy": "© 2026 مدار. جميع الحقوق محفوظة.", "privacy": "سياسة الخصوصية", "terms": "الشروط والأحكام",
           "home_aria": "MADAR — الصفحة الرئيسية"},
    "en": {"home": "Home", "blog": "Blog", "other": "عربي", "other_lang": "ar",
           "cta": "Request a demo", "cta_title": "Start with MADAR today",
           "cta_sub": "Join the founding partners list, and contact us to request a demo.",
           "related": "More articles", "more": "Read the article", "skip": "Skip to content",
           "crumbs": "Breadcrumb", "nav": "Primary navigation", "by": "MADAR",
           "copy": "© 2026 MADAR. All rights reserved.", "privacy": "Privacy policy", "terms": "Terms and conditions",
           "home_aria": "MADAR — Home"},
}

BLOG_CSS = """
:root{--navy:#0A2A45;--orbit:#3972B4;--sky:#5AA2D8;--mist:#F3F5F8;--hairline:#DCE2EA;--slate:#52637A;--body:#3D4C5E;--paper:#fff;--r-md:8px;--r-lg:12px;
  --shadow:0 1px 2px rgba(10,42,69,.04),0 8px 24px rgba(10,42,69,.06);--shadow-hover:0 2px 4px rgba(10,42,69,.05),0 16px 40px rgba(10,42,69,.10);
  --font-latin:'Poppins',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
  --font-arabic:'Tajawal','Segoe UI','Geeza Pro','Noto Sans Arabic',Tahoma,sans-serif}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--body);font-family:var(--font-latin);font-size:17px;line-height:30px;-webkit-font-smoothing:antialiased}
html[lang="ar"] body{font-family:var(--font-arabic);font-size:18px;line-height:33px}
a{color:var(--orbit)}
h1,h2,h3{color:var(--navy);margin:0}
:focus-visible{outline:2px solid var(--orbit);outline-offset:3px;border-radius:4px}
.skip-link{position:absolute;inset-inline-start:16px;top:-60px;background:var(--navy);color:#fff;padding:10px 16px;border-radius:var(--r-md);z-index:10}
.skip-link:focus{top:12px}
.wrap{max-width:760px;margin-inline:auto;padding-inline:24px}
.wide{max-width:1120px;margin-inline:auto;padding-inline:24px}
.bh{border-bottom:1px solid var(--hairline);background:#fff}
.bh .wide{display:flex;align-items:center;gap:32px;height:76px}
.logo{direction:ltr;display:inline-flex}
.logo svg{width:120px;height:auto;aspect-ratio:2870/1090}
.bh nav{flex:1}
.bh nav ul{display:flex;gap:24px;list-style:none;margin:0;padding:0}
.bh nav a{color:var(--slate);text-decoration:none;font-weight:500}
.bh nav a:hover,.bh nav a[aria-current="page"]{color:var(--navy)}
.bh .lang{color:var(--navy);text-decoration:none;font-weight:600;font-size:15px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:999px;background:var(--navy);color:#fff;text-decoration:none;font-weight:600;white-space:nowrap}
.btn:hover{background:#0F3759}
.btn--light{background:#fff;color:var(--navy)}
.btn--light:hover{background:var(--mist)}
@media (max-width:720px){.bh .wide{gap:16px;height:68px}.bh nav{display:none}.bh .btn{display:none}.bh .lang{margin-inline-start:auto}}
.crumbs{font-size:14px;color:var(--slate)}
.crumbs ol{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}
.crumbs li+li::before{content:"/";margin-inline-end:8px;color:var(--hairline)}
.crumbs a{color:var(--slate);text-decoration:none}
.post-hero{padding-block:56px 32px}
.tag{display:inline-block;margin-top:24px;padding:4px 12px;border-radius:999px;background:var(--mist);color:var(--navy);font-size:14px;font-weight:600}
.post-hero h1{margin-top:16px;font-size:40px;line-height:52px}
html[lang="ar"] .post-hero h1{font-size:42px;line-height:58px}
.meta{margin-top:12px;color:var(--slate);font-size:15px}
.lead{margin-top:20px;font-size:20px;line-height:34px;color:var(--navy)}
html[lang="ar"] .lead{font-size:21px;line-height:37px}
.post-media{margin-bottom:8px}
.post-media .frame{position:relative;aspect-ratio:16/7;border-radius:var(--r-lg);background:var(--mist);overflow:hidden}
.post-media svg{position:absolute;inset:0;width:100%;height:100%}
.post-body{padding-bottom:24px}
.post-body h2{margin-top:44px;font-size:26px;line-height:36px}
html[lang="ar"] .post-body h2{font-size:27px;line-height:40px}
.post-body p{margin:14px 0 0}
.post-body ul,.post-body ol{margin:14px 0 0;padding-inline-start:24px}
.post-body li+li{margin-top:8px}
.post-body strong{color:var(--navy)}
.callout{margin-top:40px;padding:28px;border-radius:var(--r-lg);background:var(--mist);border:1px solid var(--hairline)}
.callout h3{font-size:20px;line-height:28px}
.ticks{list-style:none;margin:16px 0 0!important;padding:0!important;display:grid;gap:10px}
.ticks li{position:relative;padding-inline-start:32px;margin:0!important}
.ticks li::before{content:"";position:absolute;inset-inline-start:0;top:.45em;width:20px;height:20px;border-radius:50%;background:var(--orbit) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 6.2l2.3 2.3 4.7-4.9'/%3E%3C/svg%3E") center/12px no-repeat}
.formula{margin-top:18px!important;padding:18px 20px;border-radius:var(--r-md);background:#fff;border:1px solid var(--hairline);border-inline-start:4px solid var(--orbit);color:var(--navy);font-weight:600}
.cta-box{margin-block:48px 16px;padding:40px;border-radius:var(--r-lg);background:var(--navy);color:rgba(255,255,255,.8)}
.cta-box h2{color:#fff;font-size:26px;line-height:36px}
.cta-box p{margin:10px 0 24px}
.related,.list{padding-block:48px 96px}
.related h2,.list-head h1{font-size:26px;line-height:36px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin-top:24px}
.card{display:flex;flex-direction:column;border:1px solid var(--hairline);border-radius:var(--r-lg);overflow:hidden;color:inherit;text-decoration:none;background:#fff;transition:box-shadow .3s,border-color .3s}
.card:hover{border-color:var(--orbit);box-shadow:var(--shadow-hover)}
.card .media{position:relative;aspect-ratio:16/10;background:var(--mist)}
.card .media svg{position:absolute;inset:0;width:100%;height:100%}
.card .media .pill{position:absolute;top:14px;inset-inline-start:14px;padding:5px 12px;border-radius:999px;background:#fff;color:var(--navy);font-size:13px;font-weight:600;box-shadow:var(--shadow)}
.card .text{display:flex;flex-direction:column;gap:10px;padding:22px 22px 26px;flex:1}
.card h2,.card h3{font-size:19px;line-height:28px}
html[lang="ar"] .card h2,html[lang="ar"] .card h3{font-size:20px;line-height:31px}
.card p{margin:0;color:var(--slate);font-size:15px;line-height:24px}
.card .more{margin-top:auto;padding-top:6px;color:var(--orbit);font-weight:600;font-size:15px}
.list-head{padding-top:56px}
.list-head h1{font-size:40px;line-height:52px;margin-top:20px}
.list-head p{margin-top:14px;font-size:19px;line-height:32px;color:var(--slate)}
footer{background:var(--navy);color:rgba(255,255,255,.72);padding:28px 0;font-size:14px}
footer .wide{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
footer a{color:#fff}
footer p{margin:0}
@media (max-width:560px){.post-hero h1,html[lang="ar"] .post-hero h1,.list-head h1{font-size:30px;line-height:42px}.cta-box{padding:28px 22px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
"""


def _blog_urls(lang, slug=None):
    base = "/en/blog" if lang == "en" else "/blog"
    return f"{base}/{slug}" if slug else base


def _blog_page(lang, title, desc, canon_path, twin_path, body, ld, defs, current):
    ui = BLOG_UI[lang]
    e = html.escape
    home = "/en" if lang == "en" else "/"
    dir_ = "ltr" if lang == "en" else "rtl"
    ar_path, en_path = (twin_path, canon_path) if lang == "en" else (canon_path, twin_path)
    head_seo = "\n".join([
        f'<link rel="canonical" href="{SITE}{canon_path}">',
        f'<link rel="alternate" hreflang="ar" href="{SITE}{ar_path}">',
        f'<link rel="alternate" hreflang="en" href="{SITE}{en_path}">',
        f'<link rel="alternate" hreflang="x-default" href="{SITE}{ar_path}">',
        '<meta name="robots" content="index,follow,max-image-preview:large">',
        icons(),
        f'<meta property="og:type" content="{"article" if current == "post" else "website"}">',
        '<meta property="og:site_name" content="MADAR — مدار">',
        f'<meta property="og:url" content="{SITE}{canon_path}">',
        f'<meta property="og:title" content="{e(title)}">',
        f'<meta property="og:description" content="{e(desc)}">',
        f'<meta property="og:image" content="{SITE}/og-image.png">',
        f'<meta property="og:locale" content="{"en_US" if lang == "en" else "ar_SA"}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{e(title)}">',
        f'<meta name="twitter:description" content="{e(desc)}">',
        f'<meta name="twitter:image" content="{SITE}/og-image.png">',
    ] + [jsonld(x) for x in ld])
    blog_current = ' aria-current="page"' if current == "index" else ""
    return f"""<!doctype html>
<html lang="{lang}" dir="{dir_}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#0A2A45">
{head_seo}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap" media="print" onload="this.media='all'">
<style>{BLOG_CSS}</style>
</head>
<body>
{defs}
<a class="skip-link" href="#main">{ui['skip']}</a>
<header class="bh">
  <div class="wide">
    <a class="logo" href="{home}" aria-label="{e(ui['home_aria'])}"><svg viewBox="40 70 2870 1090" aria-hidden="true" focusable="false"><use href="#m-wordmark" fill="#000000"/><use href="#m-arrow" fill="#3972B4"/><use href="#m-dot" fill="#F4A623"/></svg></a>
    <nav aria-label="{ui['nav']}"><ul><li><a href="{home}">{ui['home']}</a></li><li><a href="{_blog_urls(lang)}"{blog_current}>{ui['blog']}</a></li></ul></nav>
    <a class="lang" href="{twin_path}" hreflang="{ui['other_lang']}" lang="{ui['other_lang']}">{ui['other']}</a>
    <a class="btn" href="{home}#contact">{ui['cta']}</a>
  </div>
</header>
<main id="main">
{body}
</main>
<footer>
  <div class="wide">
    <p>{ui['copy']}</p>
    <p><a href="/privacy">{ui['privacy']}</a> · <a href="/terms">{ui['terms']}</a></p>
  </div>
</footer>
</body>
</html>
"""


def _card(lang, a, patterns, level=3):
    t = a[lang]
    ui = BLOG_UI[lang]
    e = html.escape
    return (f'<a class="card" href="{_blog_urls(lang, a["slug"])}">'
            f'<div class="media">{patterns[a["pattern"]]}<span class="pill">{e(t["tag"])}</span></div>'
            f'<div class="text"><h{level}>{e(t["title"])}</h{level}><p>{e(t["description"])}</p>'
            f'<span class="more">{ui["more"]}</span></div></a>')


def build_blog(index_src):
    defs = re.search(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>.*?</defs></svg>', index_src, re.S).group(0)
    patterns = re.findall(r'<svg class="blog-pattern".*?</svg>', index_src, re.S)[:3]
    arts = blog_content.ARTICLES
    org_ref = {"@id": SITE + "/#organization"}
    for lang in ("ar", "en"):
        ui, e = BLOG_UI[lang], html.escape
        out_dir = LANDING / ("en/blog" if lang == "en" else "blog")
        out_dir.mkdir(parents=True, exist_ok=True)
        home = "/en" if lang == "en" else "/"
        twin = "ar" if lang == "en" else "en"
        # index
        idx = blog_content.BLOG_INDEX[lang]
        cards = "".join(_card(lang, a, patterns, 2) for a in arts)
        body = f"""<section class="wide list-head" aria-labelledby="bt">
  <nav class="crumbs" aria-label="{ui['crumbs']}"><ol><li><a href="{home}">{ui['home']}</a></li><li aria-current="page">{ui['blog']}</li></ol></nav>
  <h1 id="bt">{e(idx['heading'])}</h1>
  <p>{e(idx['lead'])}</p>
</section>
<section class="wide list"><div class="cards">{cards}</div></section>"""
        ld = [{"@context": "https://schema.org", "@type": "Blog", "name": idx["title"], "url": SITE + _blog_urls(lang),
               "inLanguage": lang, "publisher": org_ref,
               "blogPost": [{"@type": "BlogPosting", "headline": a[lang]["title"], "url": SITE + _blog_urls(lang, a["slug"])} for a in arts]}]
        page = _blog_page(lang, f"{idx['title']} | MADAR" if lang == "en" else f"{idx['title']} | مدار", idx["description"],
                          _blog_urls(lang), _blog_urls(twin), body, ld, defs, "index")
        (LANDING / ("en/blog.html" if lang == "en" else "blog.html")).write_text(page)
        # articles
        for a in arts:
            t = a[lang]
            others = "".join(_card(lang, o, patterns) for o in arts if o is not a)
            path, twin_path = _blog_urls(lang, a["slug"]), _blog_urls(twin, a["slug"])
            body = f"""<article>
  <header class="wrap post-hero">
    <nav class="crumbs" aria-label="{ui['crumbs']}"><ol><li><a href="{home}">{ui['home']}</a></li><li><a href="{_blog_urls(lang)}">{ui['blog']}</a></li><li aria-current="page">{e(t['tag'])}</li></ol></nav>
    <span class="tag">{e(t['tag'])}</span>
    <h1>{e(t['title'])}</h1>
    <p class="meta"><time datetime="{blog_content.PUBLISHED}">{blog_content.PUBLISHED_LABEL[lang]}</time> · {ui['by']}</p>
    <p class="lead">{e(t['lead'])}</p>
  </header>
  <div class="wrap post-media" aria-hidden="true"><div class="frame">{patterns[a['pattern']]}</div></div>
  <div class="wrap post-body">{t['body']}</div>
  <div class="wrap"><aside class="cta-box" aria-labelledby="cta-{a['slug']}"><h2 id="cta-{a['slug']}">{ui['cta_title']}</h2><p>{ui['cta_sub']}</p><a class="btn btn--light" href="{home}#contact">{ui['cta']}</a></aside></div>
</article>
<section class="wide related" aria-labelledby="rel"><h2 id="rel">{ui['related']}</h2><div class="cards">{others}</div></section>"""
            ld = [
                {"@context": "https://schema.org", "@type": "BlogPosting", "headline": t["title"], "description": t["description"],
                 "inLanguage": lang, "datePublished": blog_content.PUBLISHED, "dateModified": blog_content.PUBLISHED,
                 "mainEntityOfPage": SITE + path, "url": SITE + path, "image": SITE + "/og-image.png",
                 "author": {"@type": "Organization", "name": "MADAR", "url": SITE + "/"}, "publisher": org_ref},
                {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": ui["home"], "item": SITE + home},
                    {"@type": "ListItem", "position": 2, "name": ui["blog"], "item": SITE + _blog_urls(lang)},
                    {"@type": "ListItem", "position": 3, "name": t["title"], "item": SITE + path}]},
            ]
            suffix = " | MADAR" if lang == "en" else " | مدار"
            (out_dir / f"{a['slug']}.html").write_text(
                _blog_page(lang, t["title"] + suffix, t["description"], path, twin_path, body, ld, defs, "post"))


if __name__ == "__main__":
    main()
