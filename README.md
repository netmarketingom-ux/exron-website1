# Exron Global website

The corporate website for **Exron Global General Trading LLC**, built with Astro and hosted on Netlify. Content is edited with Decap CMS.

**Status:** draft 2. This draft follows `BUILD-PROMPT.md` and the client's feedback in `docs/Website_feedback.pdf`. The homepage and the RFQ page are complete. The other pages are outlines, waiting for the client to approve the direction.

| Document | Contents |
| --- | --- |
| `docs/design-rationale.md` | How draft 2 answers each point of the feedback |
| `docs/sitemap.md` | Site structure and navigation |
| `docs/odoo-integration.md` | RFQ adapters and how to switch on Odoo |

## Homepage

The homepage at `/` uses the earlier approved design, which the client asked to keep as the default.

- Its files are in `src/legacy/`: its own layout, header, footer, styles and content.
- Its text is in `src/legacy/content/pages/home.md`.
- Its contact details are in `src/legacy/data/site.json`.
- Its placeholders are marked `[CLIENT TO PROVIDE: …]`. The placeholder check counts them as well as `[CONFIRM: …]`.

## Homepage options (review only)

Three homepage designs are online for the client to choose from. They use the same content from `src/content/home.yml`.

| Option | Name | Where |
| --- | --- | --- |
| A | Specification sheet | `/options/a/` (`src/pages/options/a.astro`) |
| B | Editorial | `/options/b/` (`src/pages/options/b.astro`) |
| C | Command | `/options/c/` (`src/pages/options/c.astro`) |

`/options/` compares the three.

- All option pages are noindex and left out of the sitemap.
- If the client chooses one of these instead, move its layout into `src/pages/index.astro`.
- Then delete `src/pages/options/` and `src/components/OptionBar.astro`, and remove the `/options/` entries from `astro.config.mjs`.

## Run locally

```bash
npm install
npm run dev                  # http://localhost:4321
npm run build                # static build into dist/
npm run check:placeholders   # list open [CONFIRM] markers (fails only in production)
npm run check                # type check
```

## Where things live

```
src/content/home.yml        Homepage text (all ten sections)
src/content/site.json       Contact details, RFQ acknowledgment time, disclaimer, secure-transmission notice
src/content/vendor.yml      Vendor information for contracting officers, each field with show: true/false
src/content/pages/*.md      Other pages: titles, descriptions, stub text, legal text
src/assets/images/          Photos uploaded through the CMS (optimized to AVIF/WebP at build)
src/assets/brand/           Logo files used by the site (copies of public/images/exron-logo*.png)
src/components/             Header, Footer, RfqForm, ContactForm, PhotoSlot, VendorList, …
src/lib/content.ts          Loads content, fills {tokens}, highlights [CONFIRM] markers
src/lib/rfq/                RFQ validation, email adapter, Odoo adapter
src/lib/rfq-form.ts         Browser code for the RFQ form
netlify/functions/          submission-created: runs after every verified form submission
public/admin/               Decap CMS
scripts/check-placeholders.mjs
```

## Placeholders

`[CONFIRM: …]` marks information that only Exron Global can provide. On preview deploys these markers show as pale red boxes.

The Netlify build runs `npm run check:placeholders`, which lists every marker still on the site.

- **By default it only reports**, so the site can go live while the client's information is outstanding.
- **To block deploys until every marker is replaced**, set the Netlify environment variable `STRICT_PLACEHOLDERS=true`.

The `/brand` page is skipped by the check, because it shows a marker as an example.

## Content rules

- Do not add contracts, past performance, certifications, registrations or government relationships that Exron Global has not obtained.
- Describe experience at Expedition Trading & Services as that of individuals on the management team, and keep the disclosure line.
- Do not present affiliated companies' capabilities as Exron Global's own.
- Vendor fields stay `show: false` until verified. SAM.gov and CAGE/NCAGE may show "Registration in progress", never a number before it is issued.

## Forms

**Netlify Forms** handles two forms, `rfq` and `contact`. Both use a honeypot field and Netlify reCAPTCHA v2.

**What happens after a submission:** `netlify/functions/submission-created.ts` runs.

1. It validates the submission again on the server.
2. It emails procurement (`RFQ_INBOX`).
3. For RFQs, it also sends the submitter an acknowledgment through Resend.

The function never logs field values.

## Environment variables (Netlify → Site configuration → Environment variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Sends acknowledgment and internal emails |
| `RFQ_INBOX` | yes | Procurement address(es) for RFQ and contact notifications, comma-separated |
| `RFQ_FROM` | no | Sender. Default `Exron Global Procurement <rfq@exronglobal.com>` |
| `ODOO_ENABLED`, `ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY` | later | See `docs/odoo-integration.md` |

## Launch checklist

1. **Connect the site.** In Netlify, choose **Import from Git** and select this repository. The build settings come from `netlify.toml`.
2. **Set the production branch.** Set it in Netlify and in `public/admin/config.yml` (`backend.branch`, currently `main`).
3. **Add the domains.** Add `exronglobal.com` and `www.exronglobal.com` and point DNS at Netlify. Netlify issues HTTPS automatically.
4. **Set up Resend.**
   - Add `exronglobal.com` as a sending domain.
   - Create the DNS records Resend lists: SPF (TXT), DKIM (TXT or CNAME) and the return-path MX record.
   - Add a DMARC TXT record at `_dmarc.exronglobal.com`.
5. **Add the environment variables** from the table above.
6. **Turn on the form features.** Under **Forms**, enable form detection and set up reCAPTCHA. The forms already carry `data-netlify-recaptcha`.
7. **Set up the content manager.**
   - Enable **Identity** and set registration to **Invite only**.
   - Enable **Git Gateway**.
   - Invite the editors.
8. **Replace every `[CONFIRM]` marker** through `/admin`, then deploy to production.

## Security headers

`netlify.toml` sets these headers for every response:

- HSTS
- `frame-ancestors 'none'` and `X-Frame-Options: DENY`
- `nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

The rest of the Content-Security-Policy is set in each page's `<head>`. The CMS at `/admin` needs a looser policy (Decap uses `eval` and loads from unpkg) than the public pages, and Netlify combines header rules rather than replacing them. Setting the policy per page keeps the two apart.
