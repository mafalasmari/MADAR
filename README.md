# Madar (مدار) — Marketing Site

The public, bilingual (Arabic/English) marketing site for **Madar** — a neutral
trust and verification layer connecting food manufacturers and wholesale
suppliers with retailers, restaurants and hotels across Saudi Arabia and the
Gulf.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** — brand tokens (Madar Navy, Trade Blue, Harvest Amber,
  Sand) defined in `app/[locale]/globals.css`
- **next-intl** — bilingual routing (`/ar`, `/en`), full RTL/LTR support
- **Framer Motion** — scroll reveals, tab/menu transitions, the animated
  logo draw-in
- **GSAP + ScrollTrigger** — the "How Madar Works" flow diagram and the
  orbit-ring vision map
- **Lenis** — smooth inertial scrolling, synced with ScrollTrigger
- **IBM Plex Sans Arabic** — self-hosted locally via `next/font/local`
  (`fonts/`), not loaded from a CDN

## Structure

```
app/[locale]/          Routes: home, about, services, for-suppliers,
                        for-buyers, contact, not-found
components/
  brand/                The exact MadarLogo / MadarSmile mark, reproduced
                        from the brand identity file
  home/                 Homepage sections (hero, flow diagram, neutrality
                        charter, audience tabs, vision map, stats, CTA)
  layout/               Header, footer, locale switcher, page hero
  motion/                Smooth-scroll provider, ScrollReveal, AnimatedCounter
  forms/                 Lead-capture and contact forms (react-hook-form + zod)
  ui/                    Button, Card, Container, form field primitives
i18n/                   next-intl routing/navigation config
messages/               ar.json / en.json translation dictionaries
fonts/                  Vendored IBM Plex Sans Arabic (OFL-licensed) woff2 files
```

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000> — it redirects to `/ar` (Arabic is the default
locale). Toggle language via the header switch, or visit `/en` directly.

## Notes for whoever picks this up

- **The lead-capture and contact forms are front-end only.** They validate
  and show a success state, but there is no backend endpoint wired up yet —
  point `InterestForm`/`ContactForm`'s submit handler at a real
  endpoint/CRM webhook before launch.
- The stats on the homepage are **founding-phase targets**, explicitly
  labeled as such — not achieved metrics. Swap them for real figures once
  available.
- The "Supply chain financing & invoice factoring" service is presented as
  a future-phase vision, not a current offering, per the brand's phased
  roadmap.
