/**
 * Full-page screenshots of every page at desktop, tablet and mobile widths,
 * plus a horizontal-overflow check.   node scripts/screenshot-pages.cjs [outputDir]
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:4329';
const OUT = process.argv[2] || 'test-results/screenshots';
const PAGES = [
  ['01-home', '/'],
  ['02-about', '/about/'],
  ['03-capabilities', '/capabilities/'],
  ['04-industries', '/industries/'],
  ['05-government-contracting', '/government-contracting/'],
  ['06-contact', '/contact/'],
  ['07-submit-rfq', '/submit-rfq/'],
  ['08-rfq-received', '/submit-rfq/received/'],
  ['09-contact-sent', '/contact/sent/'],
  ['10-privacy', '/privacy/'],
  ['11-terms', '/terms/'],
  ['12-not-found', '/404.html'],
];
const SIZES = [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 390, 844]];

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const [label, w, h] of SIZES) {
    fs.mkdirSync(path.join(OUT, label), { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: label === 'desktop' ? 1 : 2 });
    const page = await ctx.newPage();
    for (const [name, url] of PAGES) {
      const res = await page.goto(BASE + url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 400));
        window.scrollTo(0, 0);
      });
      await page.addStyleTag({ content: '.site-header{position:static!important}' });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      // The header is sticky on the live site; it is made static here so it is not repeated mid-page in full-page captures.
      await page.screenshot({ path: path.join(OUT, label, `${name}.png`), fullPage: true });
      rows.push({ page: url, size: label, status: res.status(), overflowPx: overflow });
      console.log(`${label.padEnd(7)} ${String(res.status())} overflow=${overflow}px ${url}`);
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'responsive-results.json'), JSON.stringify(rows, null, 2));
})();
