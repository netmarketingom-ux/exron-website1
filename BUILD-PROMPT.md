# Exron Global website: build brief (draft 2)

Read this whole file before writing any code. Also read `docs/Website_feedback.pdf`: it is the client's written response to draft 1 and it overrides anything earlier in this repo. Draft 1 was rejected as generic. This is a new direction, not a revision.

---

## 1. What you are building and what to stop at

Exron Global General Trading LLC is a procurement company that wants to win business from U.S. Government contracting officers, military installation purchasing teams and prime contractors, mainly in the Middle East. The site must read as if it were written by people who have actually quoted, sourced and delivered against installation RFQs. That is the whole test.

The client asked to approve the homepage direction before the other pages are built. So this round delivers exactly:

1. **The homepage**, fully designed, written and responsive.
2. **The Submit RFQ page**, fully working, because every homepage CTA lands there and the client named it the most important function.
3. **Stub pages** for the other nav items: page title, one sentence on what the page will hold, an RFQ call to action, and `noindex`. Do not write their full content yet.
4. **A `/brand` page** (`noindex`, not in the nav) showing the visual identity: colors, type scale, buttons, form fields, image direction, with short notes.
5. **`docs/design-rationale.md`**: a short document for the client that takes each numbered point of their feedback and says how this draft addresses it, in plain sentences.
6. **`docs/sitemap.md`**: the proposed structure and navigation.

Then stop and report. Do not build the remaining pages.

If an earlier version exists in this repo, keep the hosting, CMS and form plumbing that works, and replace the design and content.

---

## 2. Stack

- **Astro** (static output), TypeScript, plain CSS with custom properties (no Tailwind, no UI kit).
- **Netlify** hosting with HTTPS, deploy previews for every push.
- **Decap CMS** at `/admin` with Netlify Identity (invite-only) and Git Gateway. All homepage text, the vendor information block and contact details live in content files the CMS edits. Nothing the client may change is hardcoded.
- **Netlify Forms** for the RFQ and contact forms, plus a `submission-created` Netlify Function for emails and future Odoo hand-off (section 7).
- Self-hosted fonts via `@fontsource` (no Google Fonts requests).
- Images through `astro:assets`, output as AVIF/WebP with explicit width and height.
- Interactive JavaScript only where needed (the RFQ form). Everything else ships as static HTML.

---

## 3. Visual identity

### Principles
The site should feel like a disciplined supplier's document: structured, precise, calm and confident. Think of a well-made capability statement or spec sheet turned into a website, not a marketing landing page. Strength comes from layout, typography and restraint, not from decoration.

It must **not** suggest that Exron Global is a government agency or endorsed by one. So: no eagles, seals, flags, stars-and-stripes patterns, military insignia, camouflage or stencil fonts. The U.S. flag colors carry the identity on their own.

### Colors (client-specified)
| Token | Hex | Use |
| --- | --- | --- |
| `--navy` | `#3C3B6E` | Dominant brand color: header, hero, section bands, headings |
| `--navy-deep` | `#2A2950` | Footer, hover states, text on light backgrounds where more weight is needed |
| `--red` | `#B22234` | Primary buttons, key labels, thin accent rules. Never large areas. |
| `--white` | `#FFFFFF` | Main background |
| `--paper` | `#F6F6F3` | Alternate section background |
| `--ink` | `#1E1E2A` | Body text |
| `--steel` | `#5C6070` | Secondary text, captions |
| `--rule` | `#D9DAE0` | Borders and hairline dividers |

Check every text/background pair against WCAG 2.2 AA and list the ratios on the `/brand` page.

### Typography
- **Headings:** Archivo (variable; use a slightly condensed width, `wdth` around 85–90, weights 600–700). Tight, firm, legible.
- **Body:** Source Sans 3, 17–18px base on desktop, line-height 1.6, max line length about 70 characters.
- **Labels and reference data** (step numbers, RFQ reference numbers, small caps eyebrows): IBM Plex Mono, used sparingly.
- Use a modular type scale. Use sentence case for headings, except proper names and the company positioning line.

### Shape and layout
- Square or near-square corners (2px radius max). No pill buttons, no rounded cards.
- 12-column grid, generous white space, hairline rules (1px `--rule`) and a short red rule above section eyebrows.
- Numbered sections and steps (`01`, `02` … in mono) to give the page a procedural, organized rhythm.
- Buttons: primary is solid red with white text; secondary is a navy outline. Clear focus states.
- Sticky header: logo left, nav centre/right, red **Submit an RFQ** button always visible. Mobile: full-screen menu with the RFQ button pinned.

### Imagery
- Real photography only. No AI-generated images, no 3D renders, no illustrations of people, no abstract "network" graphics, no glowing world maps.
- Subjects: warehouse aisles, palletised cargo, containers at a port, loading bays, equipment being inspected, packing lists and paperwork, freight trucks, industrial tools and HVAC units, IT hardware being staged.
- Avoid photos of uniformed personnel, weapons, military vehicles or base signage. They imply a relationship the company cannot claim.
- Where photos are not yet supplied, render a neutral placeholder block (`--paper` background, thin border) with a caption describing the intended shot, e.g. `PHOTO: palletised supplies staged in a warehouse, morning light`. Do not fetch random stock images.
- The client's own photos (warehouse, team, shipments), if supplied in `public/images/`, take priority over everything else.
- The logo is at `public/images/exron-logo.png` (white version for dark backgrounds: `public/images/exron-logo-white.png`). If an SVG version is added later, prefer it. If the files are missing, use a text wordmark "EXRON GLOBAL" in Archivo 700 and flag it in the report. Never redraw or alter the client's logo.

---

## 4. Craft standard: it must not look or read like a template

The client wrote: "We are not looking for a generic trading company website or a standard AI-generated corporate template." Treat these as hard rules.

### Design patterns to avoid
- Purple-blue gradients, mesh or aurora backgrounds, glassmorphism, glowing borders, floating blobs.
- The "three cards with an icon in a circle" grid repeated section after section.
- Emoji, sparkle icons, generic line-icon sets used as decoration.
- Oversized rounded cards with drop shadows.
- Fake statistics ("500+ clients", "99% satisfaction"), fake logos, fake testimonials, star ratings.
- Stock-photo clichés: handshakes, people pointing at screens, globe-in-hand.
- Scroll animations on every element. Allow at most one subtle reveal per section, and respect `prefers-reduced-motion`.
- Default Inter / system-font look. Use the type system above.

### Writing rules
Copy for the homepage is provided in section 5. Use it as written. Where you must write additional text (stub page sentences, form helper text, alt text, error messages, the design rationale), follow these rules:

- Write the way an experienced procurement manager talks to a contracting officer: specific, plain, a little dry. Short sentences. Concrete nouns.
- Every sentence must say something a competitor's site could not say word for word. If it could appear on any trading company's site, rewrite or delete it.
- Do not use these words or phrases anywhere: seamless, cutting-edge, state-of-the-art, world-class, best-in-class, leverage, unlock, elevate, empower, robust, holistic, synergy, tailored solutions, one-stop shop, delve, navigate the complexities, in today's fast-paced world, look no further, we pride ourselves, your trusted partner, revolutionize, game-changer, next-level, passion for excellence.
- Do not open sentences with "Whether you're…". Avoid lists of exactly three adjectives. Keep em dashes rare (none in the homepage copy).
- No superlatives without evidence. No claims of contracts, past performance, certifications, registrations or government relationships that Exron Global does not hold.
- Use U.S. English and the vocabulary of the field where it fits naturally: RFQ, solicitation, line item, "brand name or equal", lead time, purchase order, delivery destination, packing list, receiving.

### Code hygiene
- No `<meta name="generator">` tag. No HTML or CSS comments mentioning tools, AI or generators. No leftover lorem ipsum or example.com.
- Clean, readable, hand-maintainable code: semantic HTML, meaningful class names, components in `src/components/`.

### Final self-review (do this before reporting)
1. Search all content and templates for every banned word above and for "lorem", "example.com" and "TODO". Fix any hits.
2. Read the homepage top to bottom as a contracting officer seeing it for the first time. In the first screen, can they tell who Exron is, what it supplies, why it is credible and how to send an RFQ? If not, fix the hero.
3. Check every factual claim against section 6. Anything unverified must be a visible `[CONFIRM: …]` placeholder.

---

## 5. Homepage content (use as written)

Text in `[CONFIRM: …]` is information only the client can provide. Render placeholders visibly on preview deploys (highlighted in a pale red box) so the client sees what is missing. Add a script, `npm run check:placeholders`, that fails the **production** build if any `[CONFIRM` text remains. Deploy previews must still build.

The sections follow the order the client asked for.

### 01 Opening banner (hero)

- **Eyebrow (mono, small):** EXRON GLOBAL
- **H1:** Government & Military Installation Support Procurement Specialists
- **Tagline:** Mission-Driven Procurement. Global Supply. Reliable Execution.
- **Supporting line:** Strategic sourcing, procurement, supply and logistics coordination for U.S. Government operations, military installations, defense support contractors and institutional customers. Commercial and industrial buyers are served through our second division.
- **Buttons:** Submit an RFQ (primary) · View our capabilities (secondary)
- **Strip directly under the hero (navy-deep band, one line):** Have an open solicitation? Send the RFQ number, item list and documents. Every request is acknowledged [CONFIRM: within one business day]. **→ Submit an RFQ**
- **Image direction:** palletised supplies or containers at a logistics yard, early light, navy overlay at 55–65% for text contrast.

### 02 Introduction: who we are

- **H2:** A procurement company built around installation requirements
- **Body:** Exron Global General Trading LLC sources and delivers the supplies, equipment and materials that government operations and military installations order every day: maintenance stock, electrical and HVAC parts, IT hardware, safety equipment, and the specialized items that have to be found, quoted and shipped against a deadline. We are a privately owned company based in [CONFIRM: city, country], working with contracting officers, installation purchasing teams and prime contractors.
- **Fact row (three short items, mono labels):**
  - HEADQUARTERS: [CONFIRM: city, country]
  - DIVISIONS: Government & Military Installation Support · Commercial & Industrial Procurement
  - PRIMARY MARKET: Middle East, with international coverage

### 03 Government & military installation support (largest section on the page)

- **Eyebrow:** DIVISION ONE · OUR PRIMARY FOCUS
- **H2:** Government & military installation support
- **Lead:** Installation requirements rarely arrive as a single item. A typical RFQ mixes maintenance stock, electrical parts, safety equipment and one or two things that are hard to find, all due at a gate with its own access and receiving rules. We are set up for exactly that kind of request: one quotation covering every line, sourced against the stated specification, with the documentation your file needs.
- **Sub-heading:** How an RFQ moves through Exron Global
- **Eight numbered steps** (layout: two columns of four on desktop, a single list on mobile):
  - **01 Acknowledge.** Every RFQ is logged, given a reference number and acknowledged. We confirm the response deadline, delivery destination and any requirements we need to clarify.
  - **02 Identify suppliers.** We go to manufacturers and authorized distributors that can supply the exact item, brand or equivalent the specification allows.
  - **03 Check compliance.** Each line is checked against the technical specification. Where we propose an equal to a named brand, we say so clearly and attach the data sheet.
  - **04 Price and propose.** You receive an itemized quotation with unit prices, lead times and validity period, prepared in the format the solicitation asks for.
  - **05 Execute the order.** When a purchase order or award arrives, we place supplier orders, confirm production and dispatch dates, and track each one.
  - **06 Coordinate freight and customs.** We coordinate freight forwarding, shipping documents and customs clearance with our logistics partners.
  - **07 Deliver and document.** Deliveries are scheduled to the installation's receiving requirements, with packing lists, invoices and proof of delivery.
  - **08 Follow through.** After delivery we handle discrepancies, replacements and warranty questions, and remain your single point of contact.
- **Link:** For contracting officers: company and vendor information → `/government-contracting`

### 04 Core procurement capabilities

- **H2:** What we supply
- **Intro:** We quote mixed requirements across these categories in a single response.
- **Category list** (a clean two- or three-column list with thin rules between rows, not icon cards; each row is a category name plus a line of concrete examples):
  - **General supplies and commodities:** consumables, janitorial and cleaning supplies, packaging, operational stock
  - **Industrial equipment, tools and machinery:** power and hand tools, workshop equipment, compressors, material handling
  - **Electrical, mechanical and maintenance supplies:** cable, breakers, lighting, bearings, fasteners, lubricants
  - **Building materials and facility maintenance:** cement, steel, paint, doors, fixtures, repair materials
  - **HVAC, plumbing and infrastructure equipment:** split and package AC units, pumps, pipe and fittings, water tanks
  - **IT hardware, networking and office technology:** laptops, servers, switches, structured cabling, printers
  - **Safety equipment and PPE:** helmets, gloves, eyewear, high-visibility clothing, fire extinguishers, first aid
  - **Office furniture, equipment and operational supplies:** desks, seating, storage, lodging furniture
  - **Specialized equipment sourcing:** hard-to-find, low-volume or brand-specific items
  - **Logistics and delivery support:** freight forwarding coordination, customs clearance coordination, final delivery
- **Footnote:** We also quote other authorized procurement requirements within our operational capabilities. If an item is not listed, send the specification.
- **Link:** View full capabilities → `/capabilities`

### 05 Management experience and operational background

- **Eyebrow:** EXPERIENCE
- **H2:** Experience that comes before the company
- **Body 1:** Exron Global is a new company. The people running it are not new to this work. Members of our management team have spent [CONFIRM: number] years in procurement, sourcing, trading and logistics coordination, including at Expedition Trading & Services, a company that supported U.S. military installations and government-related requirements across the Middle East.
- **Body 2:** That background shapes how we work: how installation RFQs are written, what a contracting officer needs to see in a quotation, and what it takes to move material through customs and onto an installation on schedule.
- **Disclosure (small text, always visible, directly under the section):** The experience described here was gained by members of our management team in previous roles. Contracts and past performance of Expedition Trading & Services belong to that company and are not represented as those of Exron Global.
- **Optional leadership row:** names, titles and one-line backgrounds [CONFIRM: names, titles, photos]. Keep it hidden (CMS toggle `show_leadership: false`) until the client supplies approved details.
- **Note to client in the report:** confirm the wording "Exron Global is a new company", or provide the founding date to use instead.

### 06 Why choose Exron Global

- **H2:** Why contracting officers and buyers work with us
- **Layout:** two columns, ten items. Each item is a short bold claim followed by one line saying what it means in practice. No icons.
  1. **Experienced management.** Our managers have quoted, sourced and delivered against installation requirements before.
  2. **We know how government RFQs work.** We read the whole solicitation, including specifications, delivery terms, required forms and deadlines, and quote to it.
  3. **International sourcing.** We source from manufacturers and distributors in [CONFIRM: source regions or countries] and coordinate them on your behalf.
  4. **One quotation across many categories.** Mixed RFQs are quoted together rather than split across several vendors.
  5. **Clear RFQ communication.** Every request gets a reference number, an acknowledgment and a named contact.
  6. **Logistics included.** Freight, customs and delivery coordination are part of the order, not an add-on.
  7. **Quality-focused supplier selection.** We prefer manufacturers and authorized distributors, and we document what we supply.
  8. **Competitive sourcing.** We compare sources for each line and look at freight and duty as well as unit price.
  9. **Accuracy and accountability.** Our quotation matches the specification, or we tell you exactly where it does not.
  10. **A wider business network.** Our affiliated companies add market knowledge and commercial support (see below).

### 07 International sourcing and geographic coverage

- **H2:** Where we source and where we deliver
- **Body:** Our primary market is the Middle East, where our management team has worked for [CONFIRM: number] years. We also take on requirements in other international markets where we can perform reliably.
- **Two lists side by side:**
  - **We deliver to:** [CONFIRM: countries or regions]
  - **We source from:** [CONFIRM: countries or regions]
- **Optional graphic:** a flat, single-tone navy map showing only the confirmed countries, labeled. No glowing dots, arcs or animated lines. Leave it out if the countries are not yet confirmed.

### 08 Commercial and industrial procurement division

- **Eyebrow:** DIVISION TWO
- **H2:** Commercial & industrial procurement
- **Body:** The same sourcing and logistics team also buys for affiliated companies, construction and infrastructure projects, industrial operators and external commercial customers. The process does not change: a clear quotation, the right specification and a delivery date you can plan around.
- **List:** Construction and infrastructure projects · Industrial and plant operations · Affiliated group companies · Commercial and institutional buyers
- **Button (secondary):** Send a commercial inquiry → RFQ page with the division preselected

### 09 Group affiliation

- **H2:** Part of a wider business group
- **Body:** Exron Global is affiliated with [CONFIRM: group name], whose companies work in [CONFIRM: sectors, e.g. engineering, infrastructure, energy, construction]. The group gives us market knowledge, supplier relationships and commercial backing. Each company in the group operates independently, and Exron Global does not present their contracts or capabilities as its own.
- **Logo row:** group company logos [CONFIRM: logos and permission to display]. Hidden until supplied.

### 10 Closing call to action

- **H2:** Have an open requirement?
- **Body:** Send us the solicitation or your item list. Include the RFQ number, quantities, delivery destination and required date, and attach any specifications. We will acknowledge it and come back with an itemized quotation.
- **Buttons:** Submit an RFQ · Contact procurement
- **Notice (small):** Do not send classified, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission.

### Footer (all pages)

- Logo, one-line description: Procurement, supply and logistics coordination for government, military installation and commercial customers.
- Columns: Company (About, Capabilities, Industries) · Government (Government Contracting, Capability Statement) · Contact (procurement email [CONFIRM: rfq@exronglobal.com], phone [CONFIRM], WhatsApp [CONFIRM], address [CONFIRM]).
- **Disclaimer line:** Exron Global General Trading LLC is a privately owned company. It is not a government agency and is not affiliated with or endorsed by the U.S. Government.
- Privacy Policy · Terms of Use · © 2026 Exron Global General Trading LLC

---

## 6. Accuracy rules (the client's non-negotiables)

- Never state or imply that Exron Global holds contracts, past performance, certifications, contract vehicles or government registrations it has not obtained.
- Management experience at Expedition Trading & Services is described as **experience of individuals**, never as Exron Global's track record. Keep the disclosure line.
- Affiliated companies' capabilities are never presented as Exron Global's own.
- **Vendor information** (for the future Government Contracting page and the footer) lives in `src/content/vendor.yml` with a `show` flag per field, all `false` by default: legal name, headquarters, business registration, SAM.gov status, UEI, CAGE/NCAGE, NAICS codes, capability statement PDF, procurement contact. SAM.gov and CAGE are currently in process. If the client approves, show them as "Registration in progress" only. Never show a number until it has been issued.
- Do not use the words "approved", "certified", "authorized" or "compliant" about Exron Global itself unless the client confirms the basis.

---

## 7. Submit RFQ page (fully functional)

- **URL:** `/submit-rfq`. **H1:** Submit an RFQ. **Intro:** Send us your solicitation or requirement. We acknowledge every submission and reply with an itemized quotation.

### Fields
| Field | Required | Notes |
| --- | --- | --- |
| Division | yes | Radio: Government / military installation · Prime or defense support contractor · Commercial / industrial. Can be preselected via `?division=` |
| Organization name | yes | Company or government organization |
| Contact person | yes | |
| Official email address | yes | Validate format. Helper: use your work or official address. |
| Phone | no | Include country code |
| RFQ or solicitation number | no | Helper: if you have one |
| Quotation due date | no | The deadline for our response |
| Product or service description | yes | Textarea |
| Line items | no | Optional repeater (item, quantity, unit). Serialise into one hidden field so Netlify captures it. A plain textarea must still work without JavaScript. |
| Required quantities | yes, if no line items | |
| Delivery destination | yes | Installation, city, country |
| Requested delivery date | no | |
| Specifications and documents | no | Up to 3 file inputs. Accept `.pdf, .doc, .docx, .xls, .xlsx, .csv`. Total upload under 8 MB (Netlify's limit). Validate type and size in the browser with a clear message: "For larger files, submit the form and we will send you a secure upload link." |
| Additional instructions | no | Textarea |
| Confirmation checkbox | yes | I confirm this submission does not contain classified, CUI or export-controlled information. |
| Privacy consent | yes | Link to Privacy Policy |

### Behaviour
- Netlify Forms with `netlify-honeypot` and Netlify reCAPTCHA v2. Validate input on both client and server. Add a static form skeleton if the form is rendered client-side, so Netlify detects it at build time.
- Generate a reference number in the browser (`EXR-RFQ-YYMMDD-XXXX`) and submit it as a hidden field. After submission, show a confirmation page with that reference and what happens next.
- **`netlify/functions/submission-created.ts`:**
  - Sends the submitter an acknowledgment email with the reference number, a summary of what they sent and the expected response time [CONFIRM]. Send through Resend via `RESEND_API_KEY`, from `rfq@exronglobal.com`.
  - Sends procurement (`RFQ_INBOX` env variable) a formatted internal email: all fields, links to attachments and the reference number in the subject.
  - Routes all of this through an adapter interface (`src/lib/rfq/`): an `emailAdapter` now and an `odooAdapter` stub. The stub creates a CRM lead with attachments via Odoo's external API when `ODOO_ENABLED=true`, using `ODOO_URL`, `ODOO_DB`, `ODOO_USER` and `ODOO_API_KEY`. It must be unused today but ready to switch on. Document it in `docs/odoo-integration.md`.
  - Never log full submission contents or attachments to function logs.
- Also include a short **general contact form** (name, email, subject, message) on `/contact`, using the same spam protection.

---

## 8. Technical, security and SEO requirements

- **Responsive:** design mobile-first. Test at 360, 768, 1024 and 1440 px. No horizontal scroll.
- **Performance:** Lighthouse 95+ for Performance, Accessibility, Best Practices and SEO on mobile for the homepage and the RFQ page. Preload the hero image, keep render-blocking CSS small and subset the fonts.
- **Accessibility:** WCAG 2.2 AA. One H1 per page, logical heading order, labels on every field, visible focus, keyboard-operable menu and form, alt text written for each image (describe the content, not the keyword).
- **Security headers** in `netlify.toml`: HSTS, Content-Security-Policy (allow only what is used: self, Netlify, reCAPTCHA, Identity for `/admin`), X-Content-Type-Options, Referrer-Policy (`strict-origin-when-cross-origin`), Permissions-Policy, frame-ancestors none.
- **SEO:**
  - Homepage title: `Military Installation Procurement Specialists | Exron Global`
  - Homepage meta description: `Exron Global sources and delivers supplies, equipment and logistics for U.S. Government operations, military installations and prime contractors. Submit an RFQ.`
  - Unique titles and descriptions on every page, canonical URLs, Open Graph and Twitter cards (OG image: logo on navy).
  - JSON-LD `Organization` schema with only verified fields (name, url, logo, email, address once confirmed). Do not add `hasCredential` or anything similar.
  - `sitemap.xml` (exclude `noindex` pages and `/brand`) and `robots.txt`.
  - Internal links: homepage sections link to their future pages.
- **Privacy Policy and Terms of Use:** draft pages covering form data, attachments, email processing, retention and contact. Mark them `[CONFIRM: legal review]`.
- **Navigation (all devices):** Home · About Exron · Capabilities · Industries We Serve · Government Contracting · Contact. The red **Submit an RFQ** button is separate and always visible.

---

## 9. Proposed site structure (`docs/sitemap.md`)

```
/                         Home
/about                    About Exron: background, management experience, mission, values, group affiliation
/capabilities             Procurement categories, sourcing services, logistics coordination, operational support
/industries               Government, military installation support, defense contractors, construction, infrastructure, industrial, commercial
/government-contracting   For contracting officers: verified registrations, procurement process, capability statement, procurement contact
/contact                  Contact details, general inquiry form, secure-transmission note
/submit-rfq               RFQ submission
/privacy  /terms          Legal
/brand                    Visual identity (noindex, review only)
/admin                    CMS (noindex)
```

---

## 10. Report when done

Reply with:
1. The deploy preview URL for the homepage, `/submit-rfq` and `/brand`.
2. A list of every `[CONFIRM: …]` placeholder still open, grouped by section.
3. Lighthouse scores (mobile) for the homepage and RFQ page.
4. Confirmation that the self-review in section 4 was done, plus anything you could not do and why.
5. The environment variables and DNS records the owner must set up: `RESEND_API_KEY`, `RFQ_INBOX`, Resend domain verification records for exronglobal.com, and enabling Netlify Identity and Git Gateway.
