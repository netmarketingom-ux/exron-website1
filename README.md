# Exron Global — corporate website

A static site for **Exron Global General Trading LLC**, built with [Astro](https://astro.build) and deployed on Netlify at **exronglobal.com**.

- Scope: `docs/Exron_Global_Website_Proposal.pdf`
- Original copy: `docs/Exron-Global-Website-Copy-Final.pdf` (superseded for the homepage by `docs/Website_feedback.pdf`)

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
  `{headquarters}`, `{procurementEmail}`, `{groupName}`, `{naics}`, `{email}`, `{phone}`, `{whatsapp}`, `{address}`, `{hours}`.
- **Placeholders:** any text like `[CLIENT TO PROVIDE: …]` appears as a yellow dashed highlight on the page. Replace it with the approved information. Run `npm run placeholders` to see what is still outstanding.
- **Logo:** put the file in `public/images/` and set `"logo": "/images/logo.svg"` in `site.json`.
- **Images:** grey boxes labelled "IMAGE – <subject>" are `<ImagePlaceholder>` slots. Replace one with
  `<img src="/images/<file>.jpg" alt="…" loading="lazy" />`. Each placeholder has a suggested `alt` in the page's `.md` file. Use licensed images only, and never imply they show Exron's own projects.
- **Map:** paste the Google Maps "Embed a map" `src` URL into `mapEmbedUrl` in `site.json`.

> Content rule (Proposal §21): do not add clients, contracts, certifications, government approvals, affiliations or achievements unless Exron has officially provided them.

## Design system (v2, after client feedback of 30 Oct 2026)

| Token | Hex | Use |
|---|---|---|
| `--navy-700` | `#3C3B6E` | **Brand navy, the dominant colour:** hero, government section, RFQ section, primary buttons |
| `--navy-900` / `--navy-950` | `#222149` / `#17173A` | Footer, top bar, coverage section, data panels |
| `--navy-50` / `--navy-100` | `#F3F3F8` / `#E7E7F0` | Tinted panels, notices, hover states |
| `--red-600` | `#B22234` | **Brand red, for emphasis and calls to action:** Submit an RFQ, rules, markers, eyebrows |
| `--red-300` | `#E8838F` | Red accents on dark navy backgrounds |
| `--white` / `--paper` | `#FFFFFF` / `#F7F7FA` | Backgrounds |
| `--ink-900` / `--ink-700` / `--ink-500` | `#1C1D30` / `#3D3F55` / `#66687E` | Headings / body / secondary text |

**Type:**
- Archivo, semi-expanded (108%), for headings, navigation and buttons.
- Inter for body text.
- IBM Plex Mono for labels and reference data (vendor codes, RFQ fields, process step numbers).

All fonts are self-hosted. Display size runs 34→60px, H2 26→40px, body 16px.

**Buttons:** `--quote` (red) is used only for "Submit an RFQ". The others are `--primary` (navy), `--secondary` (navy outline) and `--ghost` (white outline on navy). Corners are 3px, kept square for a more institutional look.

**Imagery:**
- Use real photographs only: Exron's own operations, team and warehousing, or carefully chosen licensed images.
- Never use AI-generated images.
- Never use military imagery that implies U.S. Government endorsement.
- The coverage map is generated from map data at build time (`src/components/CoverageMap.astro`).

## Site structure (client feedback §11)

Home · About Exron · Capabilities · Industries We Serve · Government Contracting · Contact / Submit an RFQ, plus Privacy Policy and Terms of Use.

## Deploying to Netlify

1. In Netlify, choose **Add new site → Import from Git** and pick this repository. The build settings come from `netlify.toml`.
2. Under **Domain management**, add `exronglobal.com` and `www.exronglobal.com`, then point the GoDaddy DNS records at Netlify. HTTPS is issued automatically.
3. **Forms:** Netlify Forms is detected at build time. Set up email notifications to info@exronglobal.com under **Forms → Notifications**.
