# Madar (مدار) — Marketing Site

The public, bilingual (Arabic/English) marketing site for **Madar** — a neutral
trust and verification layer connecting food manufacturers and wholesale
suppliers with retailers, restaurants and hotels across Saudi Arabia and the
Gulf.

The homepage is a single cinematic scroll narrative: preloader → hero → the
problem → the solution → the 3D order journey → the wider Madar Group
ecosystem → founding-partner sign-up. Deeper detail for each audience still
lives on its own route (`/about`, `/services`, `/for-suppliers`,
`/for-buyers`, `/contact`), linked to from the header, footer and the
homepage CTAs.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** — brand tokens (Madar Navy, Trade Blue, Harvest Amber,
  Sand), copied verbatim from the brand identity system, defined in
  `app/[locale]/globals.css`
- **next-intl** — bilingual routing (`/ar`, `/en`), full RTL/LTR support
- **Framer Motion** — the preloader, scroll reveals, the founding-partner
  modal, tab/menu transitions, the animated logo draw-in
- **GSAP + ScrollTrigger** — the problem→solution "orbit disruption"
  transition and the vision map's orbit rings
- **Three.js / React Three Fiber** — "The Orbit of Trade", the 3D
  scroll-driven order journey (Section 4 of the homepage)
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
  home/                 Homepage sections: preloader, hero, problem,
                        solution (+ the shared orbit-disruption visual),
                        ecosystem, founding-partners
  orbit-journey/        The 3D "order journey" scroll experience
  layout/               Header, footer, locale switcher, page hero
  motion/                Smooth-scroll provider, ScrollReveal, AnimatedCounter
  forms/                 Lead-capture, contact, and founding-partner forms
                        (react-hook-form + zod)
  ui/                    Button, Card, Container, Modal, form field primitives
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

- **All lead-capture forms are front-end only** — the homepage's
  founding-partner modal (`FoundingPartnerForm`), `InterestForm` (used on
  `/for-suppliers` and `/for-buyers`), and `ContactForm`. Each validates and
  shows a success state, but there is no backend endpoint wired up yet —
  point them at a real endpoint/CRM webhook before launch.
- The homepage's "Problem" stats (days lost sourcing, % unverified
  suppliers, % revenue lost to stockouts) are illustrative figures framing
  the market gap Madar addresses — not measured data. The "Stats" figures
  once shown lower on the homepage were founding-phase *targets*; if you
  reintroduce them, keep them labeled as targets, not achieved metrics.
- The footer's social links are placeholders (`href="#"`) — swap in the
  real handles before launch.
- The Ecosystem section (Section 5) presents MADAR Supply as the one live
  product today, with BlocStone Financial, IntelliGrid, and Captain & Co
  Real Estate shown as future Madar Group ventures with neutral placeholder
  styling — no invented sub-brand colors or logos. Replace with their real
  identity systems once those exist.
- "Embedded Trade Finance (Dhamen)" and supply-chain financing more broadly
  are presented as a phased vision, not a current offering — consistent
  with the phased roadmap described on `/services`.
