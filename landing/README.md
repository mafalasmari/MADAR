# GoMadar.sa — landing page

A static, bilingual (Arabic RTL / English LTR) landing page for MADAR Supply. No framework and no build step. The page is independent of the Next.js app in this repository.

| File | What it is |
|---|---|
| `index.html` | The landing page. One self-contained file: CSS, JS, logo and favicon are inline. |
| `privacy.html` | Privacy policy (Arabic authoritative, English alongside). |
| `terms.html` | Terms and conditions (Arabic authoritative, English alongside). |
| `vercel.json` | Vercel settings: clean URLs (`/privacy`, `/terms`), security headers, and redirects from the old site's `/ar` and `/en` paths. |

The three files link to each other with relative paths, so keep them in the same folder.

## Open locally

Double-click `index.html`, or serve the folder:

```bash
cd landing
python3 -m http.server 8000
# then open http://localhost:8000/
```

- `?lang=en` or `?lang=ar` in the URL forces a language. Otherwise the visitor's last choice is remembered in their browser.
- Fonts (Poppins, Tajawal) load from Google Fonts. Offline, the page falls back to system fonts and still renders correctly.

## Deploy

### Vercel (replacing the current site)

The page is set up to be served from the `landing` folder of branch `claude/determined-darwin-8zwq4g`. In the Vercel dashboard, open the existing project, then:

1. **Settings → General → Root Directory:** set it to `landing` and save.
2. **Settings → General → Build & Development Settings:**
   - Set *Framework Preset* to **Other**.
   - Turn on the override for *Build Command* and leave it empty.
   - Leave *Output Directory* empty. The folder is served as-is.
3. **Settings → Git → Production Branch:** set it to `claude/determined-darwin-8zwq4g`.
4. **Deployments:** open the latest deployment of that branch and choose **Redeploy**, or push any commit to the branch. When it finishes, it becomes the production deployment on your domain.

Links to the old site's `/ar/...` pages go to the Arabic landing page, and `/en/...` pages go to the English one (see `vercel.json`).

**To roll back**, go to **Deployments**, open the last deployment of the old site, and choose **Instant Rollback**. For a permanent revert, change Root Directory and Production Branch back to their previous values.

### Other static hosts

- **Netlify:** drag the `landing` folder onto app.netlify.com/drop, or connect the repo with *Base directory* `landing` and no build command.
- **Any other host (S3, Cloudflare Pages, nginx):** upload the contents of `landing`. `vercel.json` only applies on Vercel.

Make sure the host serves the page with gzip or brotli (all of the above do by default). That brings the page from ~240 KB down to ~54 KB over the wire.

## Connect the contact form (Formspree)

Until an endpoint is set, the form runs in **demo mode**: nothing is sent, and the confirmation reads «تم استلام بياناتك في النظام التجريبي.» / "Your details have been recorded in the demo system." Do not launch publicly in demo mode.

1. Create a free account at <https://formspree.io>. The free tier allows 50 submissions/month.
2. Create a new form, then copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find `<form class="cf" id="contact-form" action=""` and paste the endpoint:
   ```html
   <form class="cf" id="contact-form" action="https://formspree.io/f/abcdwxyz" method="post" …>
   ```
4. In the Formspree dashboard:
   - Verify the notification email.
   - Add your production domain under *Restrict to domain*.
5. Send a real test submission from the deployed site, and confirm it arrives. Once an endpoint is set, a successful send shows «تم استلام طلبك. سنتواصل معك قريباً.». A failed send shows an inline error, and the visitor can retry.

Fields sent: `name`, `company`, `email`, `phone`, `type` (supplier / buyer / investor / tech / other), `amount` (investors only, optional), `message`, `request` (demo / contact) and `language` (ar / en). `_gotcha` is a hidden spam trap that Formspree recognises.

Without JavaScript, the form still posts to the endpoint natively, and Formspree shows its own confirmation page.

**Netlify Forms instead of Formspree:** set `action="/"` and add `data-netlify="true" name="contact"` to the `<form>` tag. Then add `<input type="hidden" name="form-name" value="contact">` inside the form.

## Privacy and terms links

- The footer and the consent line under the form link to `privacy.html` and `terms.html`. If you move or rename those pages, update those three links in `index.html`.
- `privacy.html` names Formspree as the form processor. If you use a different provider, update the "How we store it" section in both languages.
- Both pages are published without a draft notice; the Arabic version is authoritative.

## Before public launch

- [ ] Formspree endpoint set and a real submission received.
- [ ] Lawyer review of `privacy.html` and `terms.html` under the Saudi PDPL. Points to check:
  - Cross-border processing by Formspree.
  - Whether the consent line is sufficient, or an explicit checkbox is needed.
  - The retention period.
- [ ] Optional: self-host the two fonts, so no visitor IP address reaches Google. If you do, update the privacy page.
- [ ] Add LinkedIn and X links to the footer only once official pages exist.
- [ ] Add a testimonials section only with real, attributable quotes.

## Copy rules (keep when editing)

- **No figures** except our own terms (45 days, 90 days) and the copyright year.
- **Banned words:** «أفضل», «الأفضل», «يضمن», «نضمن», «مجاناً», «بدون عمولة», «بدون فوائد», «مئات», «آلاف», «ملايين», «ليش», «نقارن», «ندفع للمورد».
- **MADAR only enables:** «نتيح», «نوفر», «نمكّن». Use the passive voice for anything the financing partner does («يُدفع للمورد»).
- **«مدار» is always masculine singular.** Write «مقاهٍ» when indefinite and «المقاهي» when definite.

## Editing notes

- Every visible string exists twice: in the HTML (Arabic) and in the `dict` object near the end of the file (`ar` and `en`). Elements carry `data-i18n="key"`, or `data-i18n-aria` for aria-labels. When you change copy, change it in both places.
- Brand tokens (colours, radii, type scale) are CSS variables at the top of the `<style>` block. They come from the MADAR Brand Kit 2026.
- Gold (`--gold`) appears only in the logo dot, the Dhamen confirm button and the HoReCa card tint.

## QA results at handoff

| Check | Result |
|---|---|
| axe-core, WCAG 2.2 AA plus best practices: landing page (AR and EN, desktop and mobile), privacy, terms | 0 violations |
| Lighthouse mobile, gzip (as served by any static host) | Performance 99, Accessibility 100, Best Practices 96\*, SEO 100. LCP 1.7 s, CLS 0 |
| Lighthouse mobile, uncompressed | Performance 95, Accessibility 100, Best Practices 96\*, SEO 100 |
| Keyboard | 50 tab stops, all with visible focus, none hidden. Tabs use roving tabindex with RTL-aware arrow keys |
| Reduced motion | No running animations or transitions; all content visible |
| JavaScript off | All content visible; FAQ works natively; tabs shown stacked; form posts natively |
| Horizontal scroll | None at 320, 390, 768, 1024, 1280, 1440 or 1920 px, in AR or EN |
| Language switch | Keeps the reader's place (within a few px); form errors switch language |

\* The one Best Practices deduction comes from the sandboxed test browser, which couldn't reach Google Fonts. It isn't a page issue.
