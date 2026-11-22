# Technical test report

Tested on 22 November 2026, on the review build of the website. Detailed Lighthouse reports (HTML) and full-page screenshots are supplied separately.

## 1. Lighthouse: speed, accessibility, best practices

Google Lighthouse 13.6, run on each main page. Mobile uses Lighthouse's standard simulation of a mid-range phone on a slow 4G connection; desktop uses its desktop preset. Scores are out of 100.

| Page | Mobile: performance / accessibility / best practices | Desktop: performance / accessibility / best practices | Mobile largest content shown | Layout shift | Page weight (mobile) |
|---|---|---|---|---|---|
| Home | 92 / 100 / 100 | 100 / 100 / 100 | 3.3 s | 0 | 476 KB |
| About Us | 96 / 100 / 100 | 100 / 100 / 100 | 2.7 s | 0 | 288 KB |
| Capabilities | 96 / 100 / 100 | 100 / 100 / 100 | 2.7 s | 0 | 293 KB |
| Industries We Serve | 94 / 100 / 100 | 100 / 100 / 100 | 3.2 s | 0 | 385 KB |
| Government Contracting | 97 / 100 / 100 | 100 / 100 / 100 | 2.6 s | 0 | 275 KB |
| Contact Us | 96 / 100 / 100 | 100 / 100 / 100 | 2.7 s | 0 | 293 KB |
| Submit an RFQ | 100 / 100 / 100 | 100 / 100 / 100 | 0.9 s | 0 | 263 KB |

**SEO score.** On the temporary review address the SEO score is 69 on every page. This is intentional: the review site tells search engines not to index it, and Lighthouse deducts for that. Run on the launch configuration (indexing on, as it will be on exronglobal.com), the SEO score is 100 on mobile and desktop (checked on Home, Contact and Government Contracting).

**Remaining performance note.** Mobile performance is lowest on the homepage (92) because of the large banner photograph. The photo is already compressed and served in a smaller version to phones; the remaining cost is the photo itself. If the homepage photo is not approved, this figure will change.

## 2. Accessibility

- Lighthouse accessibility: 100 on every tested page, mobile and desktop.
- One issue was found and fixed during testing: the Contact page skipped a heading level. A heading was added and the page now scores 100.
- Every page has one main heading (H1), descriptive link text, labelled form fields, visible keyboard focus and sufficient colour contrast.
- Form errors are announced in a summary at the top of the form and next to each field.
- Decorative banner photos are hidden from screen readers; content photos have text descriptions.

## 3. Links and navigation

Automated crawl of the built site: 13 pages, 464 internal links and in-page anchors checked, **0 broken**. Navigation labels are identical on every page. Every page returned status 200 at desktop, tablet and mobile widths.

## 4. Responsive layout

Every page was loaded at 1440 px (desktop), 768 px (tablet) and 390 px (mobile). Sideways scrolling: **0 px on all 36 page and size combinations**. Full-page screenshots of all pages at all three sizes are supplied.

## 5. RFQ workflow

### Browser tests (36 checks, all passed)

Run on desktop and mobile in a real browser:

| Check | Result |
|---|---|
| Homepage quick RFQ transfers organization, email, solicitation number and requirement to the full form | Pass |
| Required fields blocked, with an error summary (organization, contact person, items, destination, two confirmations) | Pass |
| Invalid email address rejected | Pass |
| Organization and contact details, solicitation number and quotation deadline captured | Pass |
| Multiple line items with quantities and units | Pass |
| Quantities not asked twice: the separate quantities box hides once the table has complete lines | Pass |
| Item list required only when the table is not used | Pass |
| Delivery location and required date captured | Pass |
| Disallowed file type (.exe) refused with a clear message | Pass |
| Allowed files (PDF, Excel) accepted; both included in the submission | Pass |
| Classified / CUI / export-controlled warning shown, with a required confirmation box | Pass |
| Submission sent to Netlify Forms with all fields and files | Pass |
| Unique reference generated (format EXR-RFQ-YYMMDD-XXXX) and shown on the confirmation page | Pass |
| No sideways scrolling on mobile; no JavaScript errors | Pass |
| Without JavaScript, the browser still enforces required fields | Pass |

### Server tests (19 checks, all passed)

What happens after a submission is accepted, with the email service simulated so no real email was sent:

| Check | Result |
|---|---|
| Valid RFQ: internal notification to the procurement inbox, then acknowledgment to the requester | Pass |
| Internal notification contains the reference, solicitation number and line items, with allowed files attached | Pass |
| Disallowed attachment refused on the server too, and reported to procurement | Pass |
| Reply to the internal notification goes straight to the requester | Pass |
| Acknowledgment subject contains the reference; no response time promised; controlled-information warning repeated | Pass |
| Invalid submissions (missing fields, bad email, no items) rejected on the server; no emails sent | Pass |
| Spam trap (honeypot) submissions ignored | Pass |
| Missing or invalid reference replaced by a server-generated one | Pass |
| Email service failure logged; the submission remains stored | Pass |
| Email not configured: nothing sent, error logged | Pass |
| General contact form delivered; rejected without privacy consent | Pass |
| Server logs contain no submitted personal data | Pass |

### Live email delivery: still to be confirmed

Real email delivery cannot be confirmed in a test environment. It depends on two settings in the Netlify account (the Resend email key and the procurement inbox address) and on the procurement email address you will supply. Once these are in place, we will send one real test RFQ on the live site and send you the two emails received (internal notification and acknowledgment) as evidence.

### RFQ storage and notifications

- **Where RFQs and attachments are stored:** in the Netlify account that hosts the website (Netlify Forms). Each submission, with its files, is kept there until it is deleted.
- **Who can access them:** only people who are members of that Netlify account. At present this is the developer's account; we recommend Exron management decides who should have access before launch.
- **How the procurement team is notified:** an email to the procurement inbox for every RFQ, with the details in a table and the files attached, sent through the Resend email service. The requester receives an acknowledgment email with the reference number.
- **If email fails:** the submission is still stored in Netlify and can be viewed there; the failure is recorded in the site's function log.

## 6. Images

All photographs are compressed and served in WebP format at two sizes, so phones download the smaller version. JPEG versions are kept for older browsers. Sizes in kilobytes:

| Photo | JPEG (fallback) | WebP for phones | WebP for large screens |
|---|---|---|---|
| Homepage banner | 359 | 61 | 214 |
| About Us banner | 165 | 27 | 81 |
| Capabilities banner | 191 | 32 | 88 |
| Industries We Serve banner | 286 | 126 | 323 |
| Government Contracting banner | 132 | 15 | 43 |
| Contact Us banner | 220 | 34 | 129 |
| Your Procurement Partner | 73 | 8 | 21 |
| Supply Capabilities | 213 | 42 | 133 |
| Regional Presence | 94 | 17 | 57 |

Photos below the first screen load only when the visitor scrolls to them. Layout shift is 0 on every page.

## 7. Security and attachment handling

- **HTTPS** on all pages, with HSTS.
- **Security headers:** Content-Security-Policy, X-Frame-Options (DENY), X-Content-Type-Options, Referrer-Policy, Permissions-Policy and Cross-Origin-Opener-Policy on every response.
- **Attachments:** only PDF, Word, Excel, CSV, JPG and PNG; at most three files and 8 MB in total. Checked in the browser and again on the server.
- **Spam protection:** Google reCAPTCHA and a hidden spam trap (honeypot), checked again on the server.
- **Controlled information:** the forms require the sender to confirm that no classified, CUI or export-controlled information is included.
- **Privacy in logs:** server logs record only the reference and outcome, never names, emails or file contents.

## 8. SEO, sitemap and indexing

- Every public page has a unique title, a meta description and a canonical address on exronglobal.com. There are no duplicate titles.
- **Sitemap:** 7 public pages (Home, About Us, Capabilities, Industries We Serve, Government Contracting, Contact Us, Submit an RFQ). Confirmation pages, legal drafts and the 404 page are excluded and marked not to be indexed.
- **Temporary site not indexed:** on the netlify.app address, robots.txt blocks all crawling and every page carries a noindex tag. When the site runs on exronglobal.com, indexing switches on automatically, and robots.txt then points search engines to the sitemap.
- **Legal pages:** the Privacy Policy and Terms of Use stay marked not to be indexed while they are drafts.

## 9. Consistency, spelling and accuracy check

- All pages were read through for spelling, consistent terminology and the nine-category structure.
- Search of the public pages for unfinished placeholder text: none on any public page except the Privacy Policy and Terms of Use, where the draft notices remain by instruction.
- No statistics, registration numbers, certifications, contracts or response times are published.

## How to repeat these tests

From the project folder: `npm run build`, start the preview, then run `node scripts/test-rfq-browser.cjs`, `npx tsx scripts/test-rfq-server.ts`, `node scripts/check-links-seo.mjs` and `node scripts/screenshot-pages.cjs`.
