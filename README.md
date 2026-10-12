# Exron Global — corporate website

A static site for **Exron Global General Trading LLC**, built with [Astro](https://astro.build) and deployed on Netlify at **exronglobal.com**.

- Scope: `docs/Exron_Global_Website_Proposal.pdf`
- Approved copy: `docs/Exron-Global-Website-Copy-Final.pdf`

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321 with live reload
npm run build      # production build into dist/
npm run preview    # serve the built site
npm run placeholders   # list every [CLIENT TO PROVIDE: …] still on the site
```

## Folder structure

```
├── netlify.toml               build settings, security headers, www → apex redirect
├── astro.config.mjs           site URL (https://exronglobal.com) and sitemap
├── docs/                      proposal and approved copy (source documents)
├── public/                    favicon, robots.txt, and later /images and /documents
└── src/
    ├── content/pages/         ← PAGE COPY: one .md file per page (home.md, …)
    ├── data/
    │   ├── site.json          ← company details: email, phone, WhatsApp, address, hours, quote response time, map
    │   ├── navigation.json    ← header nav (Section 26) and footer quick links
    │   └── ctas.json          ← reusable sales CTAs ("Send your requirement…", "One supplier…")
    ├── components/            Header, Footer, Button, CTABand, FAQ, Steps, ImagePlaceholder, Icon, Logo…
    ├── layouts/BaseLayout.astro   <head>/SEO, Inter font, header, footer, WhatsApp button
    ├── lib/site.ts            helpers: {token} filling, placeholder highlighting, tel:/wa.me links
    ├── styles/tokens.css      ← design system (colors, type scale, spacing)
    ├── styles/global.css      base styles, buttons, cards, grid
    └── pages/                 one .astro template per URL (index.astro = Home)
```

## Editing content

- **Text:** edit the YAML at the top of `src/content/pages/<page>.md`. Keep the quotes around each value.
- **Company details:** edit `src/data/site.json`. These values appear everywhere (top bar, footer, contact page, WhatsApp and phone links) and are written as tokens in the copy:
  `{responseTime}`, `{email}`, `{phone}`, `{whatsapp}`, `{address}`, `{hours}`.
  For example, setting `"responseTime": "24"` updates every "within … business hours" on the site.
- **Placeholders:** any text like `[CLIENT TO PROVIDE: …]` appears as a yellow dashed highlight on the page. Replace it with the approved information. Run `npm run placeholders` to see what is still outstanding.
- **Logo:** put the file in `public/images/` and set `"logo": "/images/logo.svg"` in `site.json`.
- **Images:** grey boxes labelled "IMAGE – <subject>" are `<ImagePlaceholder>` slots. Replace one with
  `<img src="/images/<file>.jpg" alt="…" loading="lazy" />`. Each placeholder has a suggested `alt` in the page's `.md` file. Use licensed images only, and never imply they show Exron's own projects.
- **Map:** paste the Google Maps "Embed a map" `src` URL into `mapEmbedUrl` in `site.json`.

> Content rule (Proposal §21): do not add clients, contracts, certifications, government approvals, affiliations or achievements unless Exron has officially provided them.

## Design system

| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B1F3A` | Hero, dark sections, footer |
| `--navy-950` | `#071528` | Top bar, hero gradient |
| `--blue-600` | `#1F5FAE` | Links, primary buttons, icons, eyebrows |
| `--blue-100` / `--blue-50` | `#E6EEF8` / `#F2F6FC` | Icon badges, tinted sections |
| `--red-600` | `#C8102E` | **Accents only:** quote buttons, thin rules, active nav underline, step numbers |
| `--white` / `--offwhite` | `#FFFFFF` / `#F5F6F8` | Page and alternating section backgrounds |
| `--slate-700` | `#3A4554` | Body text |
| `--charcoal-900` | `#1C232D` | Headings |

**Type:** Inter Variable (self-hosted). Fluid sizes from mobile to desktop:
Display 34→56px · H1 32→48 · H2 26→38 · H3 19→22 · Lead 17→20 · Body 16→17 · Eyebrow 13 (uppercase, tracked).

**Buttons** (`.btn` plus a modifier, at least 48px tall):
`--quote` red, for quote CTAs only · `--primary` blue · `--secondary` navy outline · `--ghost` white outline on dark backgrounds · `--whatsapp` green. Sizes are `--sm` and `--lg`.

**Layout:** 1200px container, 16/24/32px gutters, 8px spacing grid. The full navigation appears from 1180px, with a slide-down menu below that.

## Deploying to Netlify

1. In Netlify, choose **Add new site → Import from Git** and pick this repository. The build settings come from `netlify.toml`.
2. Under **Domain management**, add `exronglobal.com` and `www.exronglobal.com`, then point the GoDaddy DNS records at Netlify. HTTPS is issued automatically.
3. **Forms:** Netlify Forms is detected at build time. Set up email notifications to info@exronglobal.com under **Forms → Notifications**.
