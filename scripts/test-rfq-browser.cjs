/**
 * End-to-end browser test of the RFQ workflow against a local build.
 *   npm run build && npx astro preview --port 4329 &
 *   node scripts/test-rfq-browser.cjs [outputDir]
 * The final POST is intercepted (Netlify Forms only exists on Netlify), so the test
 * records exactly what the browser would send, then shows the confirmation page.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:4329';
const OUT = process.argv[2] || 'test-results';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass: !!pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

(async () => {
  const browser = await chromium.launch();
  const tmp = fs.mkdtempSync(path.join(OUT, 'files-'));
  const pdf = path.join(tmp, 'specification.pdf');
  const xlsx = path.join(tmp, 'item-list.xlsx');
  const exe = path.join(tmp, 'setup.exe');
  fs.writeFileSync(pdf, '%PDF-1.4\n% test file\n');
  fs.writeFileSync(xlsx, 'PK test');
  fs.writeFileSync(exe, 'MZ test');

  for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    // 1. Homepage quick RFQ hands its details to the full form
    await page.goto(`${BASE}/`);
    await page.fill('#q-org', 'Test Organization LLC');
    await page.fill('#q-email', 'buyer@example.com');
    await page.fill('#q-sol', 'W912-TEST-0001');
    await page.fill('#q-desc', 'HVAC spare parts for building 12');
    await Promise.all([page.waitForURL('**/submit-rfq/**'), page.click('.quick__btn')]);
    const carried = {
      organization: await page.inputValue('#organization'),
      email: await page.inputValue('#email'),
      solicitation: await page.inputValue('#solicitation_number'),
      description: await page.inputValue('#description'),
    };
    check(`[${label}] Quick RFQ transfers organization, email, solicitation number and requirement`,
      carried.organization === 'Test Organization LLC' && carried.email === 'buyer@example.com' &&
      carried.solicitation === 'W912-TEST-0001' && carried.description === 'HVAC spare parts for building 12',
      JSON.stringify(carried));

    // 2. Required-field validation
    await page.fill('#organization', '');
    await page.click('[data-submit]');
    const summaryVisible = await page.isVisible('[data-error-summary]');
    const summaryItems = await page.$$eval('[data-error-list] li', (lis) => lis.map((l) => l.textContent.trim()));
    check(`[${label}] Empty required fields are blocked with an error summary`, summaryVisible && summaryItems.length >= 4,
      `${summaryItems.length} messages: ${summaryItems.join(' | ')}`);
    check(`[${label}] Form was not submitted while invalid`, page.url().includes('/submit-rfq/') && !page.url().includes('received'));

    const badEmail = await (async () => {
      await page.fill('#email', 'not-an-email');
      await page.click('[data-submit]');
      return page.$$eval('[data-error-list] li', (lis) => lis.map((l) => l.textContent).join(' '));
    })();
    check(`[${label}] Invalid email address is rejected`, /email/i.test(badEmail));

    // 3. Contact details, solicitation and deadline
    await page.fill('#organization', 'Test Organization LLC');
    await page.fill('#contact_name', 'Jordan Test');
    await page.fill('#email', 'buyer@example.com');
    await page.fill('#phone', '+971 50 000 0000');
    await page.fill('#quote_due', '2026-12-15');

    // 4. Quantities entered once: the free-text list is required until the table has complete lines
    const qtyRequiredBefore = await page.$eval('#quantities', (el) => el.required);
    const rows = [['Split AC unit 18,000 BTU', '12', 'EA'], ['Copper pipe 1/2 in', '200', 'M'], ['Refrigerant R410A', '24', 'CYL']];
    for (let i = 0; i < rows.length; i++) {
      if (i > 0) await page.click('[data-add-line]');
      const tr = page.locator('[data-lines-body] tr').nth(i);
      await tr.locator('[data-col="item"]').fill(rows[i][0]);
      await tr.locator('[data-col="qty"]').fill(rows[i][1]);
      await tr.locator('[data-col="unit"]').fill(rows[i][2]);
    }
    const qtyHiddenAfter = await page.$eval('[data-field="quantities"]', (el) => el.hidden);
    const qtyRequiredAfter = await page.$eval('#quantities', (el) => el.required);
    check(`[${label}] Multiple line items with quantities and units`, (await page.locator('[data-lines-body] tr').count()) === 3);
    check(`[${label}] Quantities are not asked twice (list hidden once table is used)`, qtyRequiredBefore && qtyHiddenAfter && !qtyRequiredAfter);

    // 5. Delivery location and date
    await page.fill('#destination', 'Abu Dhabi, United Arab Emirates');
    await page.fill('#delivery_date', '2027-01-20');
    await page.fill('#instructions', 'Deliver Sunday to Thursday, 08:00 to 14:00.');

    // 6. File upload restrictions
    await page.setInputFiles('#attachment_1', exe);
    const fileErr = await page.textContent('[data-files-error]');
    check(`[${label}] Disallowed file type (.exe) is refused`, /pdf|type|file/i.test(fileErr || ''), (fileErr || '').trim());
    await page.setInputFiles('#attachment_1', pdf);
    await page.setInputFiles('#attachment_2', xlsx);
    const fileErrHidden = await page.isHidden('[data-files-error]');
    check(`[${label}] Allowed files (PDF, Excel) are accepted`, fileErrHidden);

    // Controlled-information warning is present and must be confirmed
    const warning = await page.textContent('form');
    check(`[${label}] Classified / CUI / export-controlled warning is shown on the form`, /classified/i.test(warning) && /CUI|Controlled Unclassified/i.test(warning) && /export-controlled/i.test(warning));
    await page.check('input[name="no_controlled_info"]');
    await page.check('input[name="privacy_consent"]');

    // Mobile usability: nothing wider than the screen
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`[${label}] No horizontal scrolling on the RFQ form`, overflow <= 0, `overflow ${overflow}px`);
    await page.screenshot({ path: path.join(OUT, `rfq-filled-${label}.png`), fullPage: true });

    // 7. Submission: capture the POST, then show the confirmation page
    let posted = null;
    await page.route('**/submit-rfq/received/**', async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        posted = { contentType: req.headers()['content-type'], body: req.postDataBuffer()?.toString('latin1') || '' };
        const html = await (await fetch(`${BASE}/submit-rfq/received/`)).text();
        return route.fulfill({ status: 200, contentType: 'text/html', body: html });
      }
      return route.continue();
    });
    await Promise.all([page.waitForURL('**/received/**'), page.click('[data-submit]')]);
    const body = posted?.body || '';
    const field = (n) => (body.match(new RegExp(`name="${n}"\\r\\n\\r\\n([\\s\\S]*?)\\r\\n--`)) || [])[1];
    const reference = field('reference');
    check(`[${label}] Submission sent as multipart form data to Netlify Forms`, /multipart\/form-data/.test(posted?.contentType || '') && field('form-name') === 'rfq');
    check(`[${label}] Unique RFQ reference generated (EXR-RFQ-YYMMDD-XXXX)`, /^EXR-RFQ-\d{6}-[A-Z0-9]{4}$/.test(reference || ''), reference);
    check(`[${label}] Line items serialised with quantities and units`, /1\. Split AC unit 18,000 BTU \| Qty: 12 EA/.test(field('line_items') || ''), (field('line_items') || '').split('\n')[0]);
    check(`[${label}] Solicitation number, deadline, destination and date included`,
      field('solicitation_number') === 'W912-TEST-0001' && field('quote_due') === '2026-12-15' && /Abu Dhabi/.test(field('destination') || '') && field('delivery_date') === '2027-01-20');
    check(`[${label}] Both attachments included`, /filename="specification\.pdf"/.test(body) && /filename="item-list\.xlsx"/.test(body));
    const shownRef = await page.textContent('body');
    check(`[${label}] Confirmation page shows the same reference`, !!reference && shownRef.includes(reference));
    await page.screenshot({ path: path.join(OUT, `rfq-confirmation-${label}.png`), fullPage: true });
    check(`[${label}] No JavaScript errors`, errors.length === 0, errors.join('; '));
    await ctx.close();
  }

  // 8. Without the line-item table, the item list is required
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/submit-rfq/`);
    await page.click('[data-submit]');
    const msgs = await page.$$eval('[data-error-list] li', (lis) => lis.map((l) => l.textContent).join(' '));
    check('Item list is required when no line items are entered', /line items|quantit/i.test(msgs));
    await ctx.close();
  }

  // 9. Without JavaScript the form still works (native validation, standard POST)
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/submit-rfq/`);
    const req = await page.$$eval('form[name="rfq"] [required]', (els) => els.map((e) => e.name));
    check('Without JavaScript, required fields are enforced by the browser', req.includes('organization') && req.includes('quantities') && req.includes('destination'), req.join(', '));
    await ctx.close();
  }

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.writeFileSync(path.join(OUT, 'rfq-browser-results.json'), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})();
