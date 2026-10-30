# Draft 2: how this draft answers your feedback

Prepared for Exron Global management, in response to the written feedback on draft 1. Each section below takes one numbered point of that feedback and says what has changed.

You can review the draft on these pages:

- **Homepage** at `/`
- **Submit an RFQ** at `/submit-rfq`
- **Visual identity** at `/brand`

The other pages exist only as outlines. As you asked, the remaining pages will not be built until you approve this direction.

Wherever the site needs information that only you can confirm, it shows a highlighted `[CONFIRM: …]` marker. The site cannot go live while any marker remains: the production build stops until each one is replaced.

---

### 1. Corporate identity and visual design

- **Colors.** The palette is built on the three colors you specified.
  - Navy `#3C3B6E` is the dominant color: header text, hero, section bands and headings.
  - White is the main background.
  - Red `#B22234` is kept for buttons, step numbers and thin accent rules. It never fills a large area.
  - Two supporting tones, a deeper navy for the footer and a warm off-white for alternate sections, keep long pages from feeling flat.
- **Logo.** Your approved logo appears in the header and footer. It is used exactly as supplied, with the white version on navy.
- **Avoiding a government look.** We deliberately left out flags, eagles, seals, stars-and-stripes patterns, insignia and stencil lettering. The colors carry the identity on their own, and the page cannot be mistaken for a government agency's. The footer of every page states that the company is privately owned and is not affiliated with or endorsed by the U.S. Government.
- **Images.** The draft uses no stock or AI imagery. Each place where a photograph belongs shows a neutral block describing the intended shot, for example "PHOTO: equipment being inspected against a packing list at a loading bay". The full list of subjects to use and to avoid is on `/brand`. Your own warehouse, shipment and team photos will take priority. Once a photo is uploaded through the content manager, it replaces the block automatically.

### 2. Homepage and positioning

- **Opening banner.** The banner leads with your positioning line, "Government & Military Installation Support Procurement Specialists", followed by "Mission-Driven Procurement. Global Supply. Reliable Execution." and the supporting statement.
- **The four questions in the first screen.** A visitor sees the following before scrolling:
  - who you are, from the eyebrow and heading;
  - what you supply and for whom, from the supporting line;
  - why you are credible, from the "At a glance" panel. It states your primary focus, your primary market and your management's installation background.
  - how to send an RFQ, from a red button plus a strip directly under the banner that tells a contracting officer exactly what to send.

### 3. Government and military installation support as the primary focus

- **The largest section on the page.** Government and military installation support has its own navy band, labeled "Division one · Our primary focus".
- **An eight-step RFQ process.** Instead of general claims, the section explains how an RFQ moves through the company: acknowledgment, supplier identification, specification checks, priced proposal, order execution, freight and customs, delivery documentation and follow-through. These steps are the activities you listed in point 10.
- **Contracting officers.** The section ends with a direct link to the Government Contracting page.

### 4. Management experience

- **A section of its own.** "Experience that comes before the company" presents your management's background, including Expedition Trading & Services.
- **The distinction you asked for.** It says plainly that Exron Global is a new company, so the experience reads as that of individuals.
- **Disclosure.** A disclosure that is always visible states that Expedition's contracts and past performance belong to that company and are not represented as Exron Global's.
- **Leadership row.** A row for names and titles is ready but hidden until you supply approved details.
- **Please confirm.** Is the wording "Exron Global is a new company" acceptable, or would you prefer we use the founding date?

### 5. The two divisions

- **Division one** is government and military installation support (section 03). It gets the most space and appears first.
- **Division two** is commercial and industrial procurement (section 08). It is presented as the same team and process serving construction, industrial, affiliated and commercial buyers.
- **The RFQ form** asks which division a request belongs to. The commercial button on the homepage opens the form with that division already selected.

### 6. Group of companies

- **Section 09** describes the group as a source of market knowledge, supplier relationships and commercial backing.
- **No borrowed capabilities.** It states that each group company operates independently and that Exron Global does not present their contracts or capabilities as its own.
- **What we need from you.** The group's name and sectors are marked for your confirmation. Group logos stay hidden until you supply them with permission to display.

### 7. Why choose Exron Global

- **Ten reasons, the ten you listed.** Each one pairs a short claim with one line describing what it means in practice. For example: "Accuracy and accountability. Our quotation matches the specification, or we tell you exactly where it does not."
- **No unsupported claims.** There are no superlatives, statistics or testimonials that cannot be supported.

### 8. RFQ submission system

The `/submit-rfq` page is fully working.

- **Fields.** It collects every item in your list. It adds a division choice, a quotation due date and an optional line-item table, and the line items reach procurement as one list.
- **Attachments.** Up to three files can be attached (PDF, Word, Excel or CSV, 8 MB in total). Type and size are checked in the browser, and visitors with larger files are told how to proceed.
- **Reference numbers.** Each submission gets a reference number such as `EXR-RFQ-261030-K7QM`. It is shown on the confirmation page and repeated in the acknowledgment email.
- **Automatic acknowledgment.** The customer receives an email with the reference number, a summary of what they sent and the expected response time.
- **Internal notification.** Procurement receives a formatted email with every field and links to the attachments. The reference number is in the subject line.
- **Spam protection.** Submissions are screened by a hidden honeypot field, Google reCAPTCHA and validation in both the browser and the server.
- **Controlled information.** Before sending, the submitter must confirm the request contains no classified, CUI or export-controlled information. The same notice appears beside the form and on the homepage.
- **Data handling.** Function logs never record submission contents.

### 9. Government contracting and vendor information

- **One editable file.** All vendor details live in one file that you can edit through the content manager. This covers legal name, headquarters, registration, SAM.gov, UEI, CAGE/NCAGE, NAICS, the capability statement and the procurement contact.
- **Hidden by default.** Every field is switched off until you have verified it.
- **SAM.gov and CAGE/NCAGE.** These can only ever show "Registration in progress" until the numbers are issued.
- **Structured data.** Nothing unverified is published, including in the data read by search engines.

### 10. Stronger content

- **New homepage copy.** The homepage copy is new and written for contracting officers and procurement managers. It uses the vocabulary of the work: solicitation, line item, "brand name or equal", lead time, purchase order, receiving, packing list.
- **No filler.** We removed generic phrases and repeated descriptions.
- **Your list of activities.** Each procurement activity you listed now appears in the RFQ process or in the reasons to choose Exron.

### 11. Architecture and navigation

- **Navigation.** The navigation follows the structure you recommended: Home, About Exron, Capabilities, Industries We Serve, Government Contracting and Contact.
- **RFQ button.** A red "Submit an RFQ" button is always visible in the header.
- **Mobile.** On phones, the menu opens full screen with the RFQ button pinned at the bottom.
- **Full structure.** See `docs/sitemap.md`.

### 12. Technical performance, security and SEO

- **Speed.** The site is built as static pages and loads fast. It scored 99 for Performance and 100 for Accessibility, Best Practices and SEO in a mobile Lighthouse test of the homepage and the RFQ page, run against a local build. Images are converted to modern formats automatically, and fonts are served from our own domain.
- **Security.** The site is served over HTTPS with strict security headers. The content manager is invite-only.
- **Accessibility.** Text and background color pairs meet WCAG 2.2 AA. The ratios are listed on `/brand`.
- **Search engines.** Each page has its own title and description. The site has a sitemap, sharing cards and verified-only organization data.
- **Privacy and terms.** Draft Privacy Policy and Terms of Use pages are in place for legal review.

### 13. Homepage sequence

The homepage follows your ten-step order exactly. Each section is numbered 01 to 10 on the page, so the structure is easy to follow and to discuss.

### 14. What this submission contains

| You asked for | Where to find it |
| --- | --- |
| A completely revised homepage design | `/` |
| A proposed website structure and navigation | `docs/sitemap.md` |
| Stronger, professionally rewritten homepage content | `/`, editable through the content manager |
| The proposed visual identity, including colors, typography and imagery | `/brand` |
| A brief explanation of how the design addresses your expectations | This document |

### 15. Odoo integration

- **Ready but switched off.** RFQ submissions pass through a small adapter layer. Today it sends emails. An Odoo connection is already written and only needs to be switched on.
- **What it does.** Once switched on, it creates a CRM opportunity for each RFQ, with the documents attached.
- **Details.** See `docs/odoo-integration.md`.

---

## Typography and imagery in brief

- **Typography.**
  - Headings use Archivo, slightly condensed for a firm, technical look.
  - Body text uses Source Sans 3, which stays readable at length.
  - IBM Plex Mono is used sparingly for reference numbers, step numbers and small labels, which gives the page the feel of a specification sheet.
- **Imagery.** Real photographs of the work itself: warehouses, palletized cargo, containers, inspection, paperwork, tools and equipment. No people in uniform, no weapons or military vehicles, no handshakes or globe graphics.
