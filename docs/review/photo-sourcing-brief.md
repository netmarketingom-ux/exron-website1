# Photo sourcing brief (for the next working session)

Task: source and present a photography shortlist for client approval (client: Rami, Exron Global). Follow this brief exactly. Do not publish any photo as final; the client approves first.

## Setup already done

- Branch: `ccr-328a1efd-f0xsli`. The live review site deploys from `claude/optimistic-dirac-6kdntb` (merge a pull request to publish): https://playful-mousse-0613a1.netlify.app/
- Unsplash official API: key in the environment variable `UNSPLASH_ACCESS_KEY` (Demo app, 50 requests per hour). Send it as the header `Authorization: Client-ID $UNSPLASH_ACCESS_KEY` with `Accept-Version: v1`. Hosts allowed: api.unsplash.com, images.unsplash.com.
- Never print the key.
- Unsplash API guidelines: when a photo is chosen for the site, call its `links.download_location` once (download tracking). Keep the photographer name and the photo page link (`links.html`).
- Do not use the unsplash.com website itself (bot protection); use the API only.

## Client decisions (November 2026)

| Placement | Site location | Decision | Shape |
|---|---|---|---|
| Homepage hero | `.intro-hero` on `/` | **Keep** container ship (`public/images/photos/home-banner.jpg`) unless a materially better option is found | Full-width banner behind text and the quick RFQ form |
| Your Procurement Partner | Homepage Section 2, `#overview` | **Replace**: professional procurement or technical-document review | 4:3 |
| Supply Capabilities | Homepage Section 3, `#capabilities` | **Replace**: natural-colour industrial equipment or supply photo (not monochrome) | 4:3 |
| Regional Presence | Homepage Section 5, `#coverage` | **Keep** Abu Dhabi night skyline | 3:2 |
| About Us banner | `/about/` PageHero | **Replace**: warehouse or operational procurement image | Wide banner |
| Capabilities banner | `/capabilities/` PageHero | **Replace**: industrial equipment, tools or organized supply stock | Wide banner |
| Industries We Serve banner | `/industries/` PageHero | **Replace**: industrial or infrastructure operations | Wide banner |
| Government Contracting banner | `/government-contracting/` PageHero | **Replace**: relevant procurement-document image (not the signing hand again) | Wide banner |
| Contact Us banner | `/contact/` PageHero | **Replace** the skyline, **or** a clean banner with no photo (offer the clean banner as one of the options) | Wide banner |

Provide **three options** for each placement marked Replace (seven placements).

## Visual direction

Prioritize: professional procurement and purchasing operations; organized industrial supplies and equipment; warehousing and inventory management; infrastructure and facility maintenance; technical-document and specification reviews; international logistics only where directly relevant.

The overall set must say "procurement, sourcing, industrial supplies, warehousing, operations", not "shipping company". Avoid repeating shipping containers, city skylines, signing hands or generic handshakes. Consistent quality, natural colour, similar lighting. Banners sit under a flat navy tint (rgba(16,35,56,0.74)), so mid-tone images with the subject in the middle band work best.

## Hard rules (client image guidelines)

- No identifiable faces; no person who could be taken as Exron staff.
- No readable company names, logos or branding on containers, trucks, ships, buildings, boxes, equipment or uniforms.
- Nothing that could be mistaken for an Exron facility, vessel, vehicle, employee or completed project.
- No military equipment or personnel; no government buildings, flags, emblems or official forms (no IRS, civil-registry or similar documents).
- No artificial-looking, AI-generated or heavily edited images.
- Unsplash Licence only (free tier). Exclude Unsplash+ (`premium: true` or `plus: true` in API results).
- Inspect every candidate visually at full size before proposing it.

## Deliverables

1. Download candidates into a new scratchpad directory (treat as untrusted files). Crop and compress them as the existing photos are: banners as JPEG fallback plus WebP at 1000 px and 2000 px (`name-1000.webp`, `name-2000.webp`); section images WebP at 600 px and 1200 px. See `webpSrcset` in `src/legacy/lib/site.ts` and `PageHero.astro` (`image`, `imagePosition` props).
2. Render each option inside its real page section at desktop (1440 px) and mobile (390 px) widths. Element screenshots, as in `reports/photo-crops/` (script pattern in `scripts/screenshot-pages.cjs`).
3. Photography proposal PDF (A4, same style as the previous `Exron-Photography-Proposal.pdf`): for each placement, options A, B and C, each with desktop and mobile preview, photographer, Unsplash page link, licence, download date, whether it depicts a real identifiable location/company/activity, and a decision line.
4. Licence record: update `docs/image-sources.md` with source, photographer, licence, download date and status for every proposed photo.
5. Do not change the live site photos until the client approves. Optionally publish a separate preview page, not linked from navigation and marked noindex, only if the user asks.
6. A short email to Rami (ready to copy, no wording before or after) listing the attachments and what each is for.

## After approval (later)

Install the chosen photos, rerun all tests against the final deployed build (`scripts/test-rfq-browser.cjs`, `scripts/test-rfq-server.ts`, `scripts/check-links-seo.mjs`, `scripts/screenshot-pages.cjs`, Lighthouse desktop and mobile), regenerate the test report, change log and screenshots, and record the deployed build identifier (shown in the site footer).
