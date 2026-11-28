/**
 * Renders each proposed photo option inside its real page section, at desktop (1440 px)
 * and mobile (390 px), as element screenshots. Nothing on the site is changed: the
 * candidate image is swapped in the browser only.
 *   BASE_URL=http://localhost:4329 node scripts/screenshot-photo-options.cjs manifest.json reports/photo-options/previews
 * manifest.json maps option names (e.g. "about-a") to {} or {"clean": true}; optional "_positions" sets object-position.
 * Candidate files must be served from /images/review/<name>.jpg (+ -600/-1200 or -1000/-2000 .webp).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:4329';
const [manifestPath, OUT] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const PLACES = {
  partner: { url: '/', sel: '#overview', img: '#overview .media-row__img', widths: [600, 1200] },
  supply: { url: '/', sel: '#capabilities', img: '#capabilities .media-row__img', widths: [600, 1200] },
  about: { url: '/about/', sel: '.page-hero', img: '.page-hero__bg', widths: [1000, 2000] },
  caps: { url: '/capabilities/', sel: '.page-hero', img: '.page-hero__bg', widths: [1000, 2000] },
  ind: { url: '/industries/', sel: '.page-hero', img: '.page-hero__bg', widths: [1000, 2000] },
  gov: { url: '/government-contracting/', sel: '.page-hero', img: '.page-hero__bg', widths: [1000, 2000] },
  contact: { url: '/contact/', sel: '.page-hero', img: '.page-hero__bg', widths: [1000, 2000] },
};
const POS = manifest._positions || {};
const SIZES = [['desktop', 1440, 900, 1], ['mobile', 390, 844, 2]];

(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync(OUT, { recursive: true });
  for (const [label, w, h, dpr] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    for (const [name, info] of Object.entries(manifest)) {
      if (name.startsWith('_')) continue;
      const p = PLACES[name.split('-')[0]];
      await page.goto(BASE + p.url, { waitUntil: 'networkidle' });
      await page.evaluate(async ({ name, info, p, pos }) => {
        const img = document.querySelector(p.img);
        const pic = img.closest('picture');
        if (info.clean) {
          pic.remove();
          document.querySelector('.page-hero').classList.remove('page-hero--photo');
          return;
        }
        const jpg = `/images/review/${name}.jpg`;
        pic.querySelector('source').srcset = p.widths.map((x) => `/images/review/${name}-${x}.webp ${x}w`).join(', ');
        img.loading = 'eager';
        img.src = jpg;
        if (pos) img.style.objectPosition = pos;
      }, { name, info, p, pos: POS[name] });
      if (!info.clean) {
        await page.locator(p.img).first().scrollIntoViewIfNeeded();
        await page.waitForFunction((sel) => { const i = document.querySelector(sel); return i.complete && i.naturalWidth > 0 && i.currentSrc.includes('/images/review/'); }, p.img, { timeout: 15000 });
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      // The header is sticky on the live site; made static so it does not overlap element captures.
      await page.addStyleTag({ content: '.site-header{position:static!important}' });
      await page.waitForTimeout(250);
      const file = path.join(OUT, `${name}-${label}.png`);
      await page.locator(p.sel).first().screenshot({ path: file });
      console.log(label, name);
    }
    await ctx.close();
  }
  await browser.close();
})();
