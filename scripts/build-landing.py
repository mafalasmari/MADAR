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
from pathlib import Path

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

    urls = [("/", "1.0"), ("/en", "0.9"), ("/privacy", "0.3"), ("/terms", "0.3")]
    alt = (f'<xhtml:link rel="alternate" hreflang="ar" href="{SITE}/"/>'
           f'<xhtml:link rel="alternate" hreflang="en" href="{SITE}/en"/>'
           f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>')
    rows = "\n".join(
        f"  <url><loc>{SITE}{u}</loc>{alt if u in ('/', '/en') else ''}<priority>{p}</priority></url>"
        for u, p in urls)
    (LANDING / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        f"{rows}\n</urlset>\n")
    (LANDING / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
    print("built: index.html (ar), en.html, privacy.html, terms.html, sitemap.xml, robots.txt")


if __name__ == "__main__":
    main()
