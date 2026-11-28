/**
 * Builds a client preview of the site with the proposed photos, AFTER `npm run build`.
 *   node scripts/build-photo-preview.mjs
 *
 * Writes dist/photo-preview/ only: an index page plus copies of the six photo pages for
 * option sets A, B and C (/photo-preview/a/, /b/, /c/). The real pages and photos in dist/
 * are not touched. Every preview page is noindex and nothing links to it from the site.
 * Source images: docs/review/photo-options/images/ (see docs/image-sources.md).
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT = path.join(DIST, 'photo-preview');
const IMG_SRC = 'docs/review/photo-options/images';

const PAGES = ['', 'about', 'capabilities', 'industries', 'government-contracting', 'contact'];
const PLACEMENTS = [
  // [current file stem, option prefix, label, page]
  ['procurement-partner', 'partner', 'Your Procurement Partner', ''],
  ['supply-capabilities', 'supply', 'Supply Capabilities', ''],
  ['about-banner', 'about', 'About Us banner', 'about'],
  ['capabilities-banner', 'caps', 'Capabilities banner', 'capabilities'],
  ['industries-banner', 'ind', 'Industries We Serve banner', 'industries'],
  ['government-banner', 'gov', 'Government Contracting banner', 'government-contracting'],
  ['contact-banner', 'contact', 'Contact Us banner', 'contact'],
];
const ALT = {
  'partner-a': 'Machined parts on engineering drawings',
  'partner-b': 'Two people reviewing notes beside laptops',
  'partner-c': 'Hands reviewing a printed report on a clipboard',
  'supply-a': 'New pressure regulators lined up on a shelf',
  'supply-b': 'Brass valves on a bench',
  'supply-c': 'Industrial pipework with red hand-wheel valves',
};
const POSITION = { 'ind-a': 'center 85%' };
const CLEAN = new Set(['contact-a']); // clean navy banner, no photo

const OPTIONS = ['a', 'b', 'c'];

function bar(opt, page) {
  const links = OPTIONS.map((o) => o === opt
    ? `<strong style="color:#fff;padding:2px 8px;border:1px solid #fff;border-radius:4px">Option ${o.toUpperCase()}</strong>`
    : `<a href="/photo-preview/${o}/${page ? page + '/' : ''}" style="color:#cfe0f5;padding:2px 8px">Option ${o.toUpperCase()}</a>`).join(' ');
  return `<div style="position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#7a1f1f;color:#fff;font:14px/1.4 system-ui,sans-serif;padding:10px 16px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 8px rgba(0,0,0,.25)">`
    + `<span><strong>Photo preview</strong>, not the live site</span><span>${links}</span>`
    + `<a href="/photo-preview/" style="color:#cfe0f5">All options</a></div><div style="height:56px"></div>`;
}

function transform(html, opt, page) {
  for (const [stem, prefix] of PLACEMENTS) {
    const name = `${prefix}-${opt}`;
    if (!html.includes(`/images/photos/${stem}`)) continue;
    if (CLEAN.has(name)) {
      html = html.replace(/<picture[^>]*>\s*<source[^>]*\/images\/photos\/contact-banner[\s\S]*?<\/picture>/, '');
      html = html.replace('class="page-hero page-hero--photo"', 'class="page-hero"');
      continue;
    }
    html = html.split(`/images/photos/${stem}`).join(`/photo-preview/img/${name}`);
    if (ALT[name]) {
      html = html.replace(new RegExp(`(src="/photo-preview/img/${name}\\.jpg" alt=")[^"]*"`), `$1${ALT[name]}"`);
    }
    if (POSITION[name]) {
      html = html.replace(new RegExp(`(src="/photo-preview/img/${name}\\.jpg"[^>]*style=")object-position:[^"]*"`), `$1object-position:${POSITION[name]}"`);
    }
  }
  // keep visitors inside the preview set for the six photo pages
  for (const p of PAGES) {
    const from = `href="/${p ? p + '/' : ''}"`;
    html = html.split(from).join(`href="/photo-preview/${opt}/${p ? p + '/' : ''}"`);
  }
  html = html.replace(/<meta name="robots"[^>]*>/g, '');
  html = html.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');
  html = html.replace(/<title>/, `<title>[Preview ${opt.toUpperCase()}] `);
  html = html.replace('</body>', `${bar(opt, page)}</body>`);
  return html;
}

function indexPage() {
  const rows = PLACEMENTS.map(([, prefix, label, page]) => {
    const cells = OPTIONS.map((o) => {
      const name = `${prefix}-${o}`;
      const href = `/photo-preview/${o}/${page ? page + '/' : ''}${page ? '' : (prefix === 'partner' ? '#overview' : '#capabilities')}`;
      const thumb = CLEAN.has(name)
        ? `<div style="aspect-ratio:3/2;background:#102338;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#cfe0f5;font-size:13px">No photo (navy)</div>`
        : `<img src="/photo-preview/img/${name}-${['partner', 'supply'].includes(prefix) ? 600 : 1000}.webp" alt="" style="width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:6px;display:block">`;
      return `<td><a href="${href}" style="color:inherit;text-decoration:none">${thumb}<span style="display:block;margin-top:6px;font-weight:600;color:#1f5fa8">Option ${o.toUpperCase()} &rarr; view on page</span></a></td>`;
    }).join('');
    return `<tr><th>${label}</th>${cells}</tr>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Exron Global: photo options preview</title>
<style>body{margin:0;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;color:#1d2733;background:#f4f6f9}header{background:#102338;color:#fff;padding:28px 16px}header div,main{max-width:1100px;margin:0 auto}h1{margin:0 0 6px;font-size:26px}main{padding:24px 16px 60px}.sets a{display:inline-block;margin:0 8px 8px 0;padding:10px 16px;background:#102338;color:#fff;border-radius:6px;text-decoration:none;font-weight:600}table{width:100%;border-collapse:separate;border-spacing:12px}th{text-align:left;vertical-align:top;width:18%;font-size:15px}td{vertical-align:top;width:27%}@media(max-width:700px){table,tbody,tr,th,td{display:block;width:auto}tr{margin-bottom:20px}}</style></head>
<body><header><div><h1>Photo options preview</h1><p style="margin:0;color:#cfe0f5">Proposed replacement photos shown on the real pages. For review only: this is not the live site and nothing here has been published.</p></div></header>
<main><p>View the whole site with every placement set to one option, then switch with the red bar at the bottom of each page:</p>
<p class="sets"><a href="/photo-preview/a/">Site with all options A</a><a href="/photo-preview/b/">Site with all options B</a><a href="/photo-preview/c/">Site with all options C</a></p>
<p>Or open one placement directly:</p><table>${rows}</table>
<p style="color:#5b6573;font-size:13px">The homepage banner (container ship) and Regional Presence (Abu Dhabi at night) are unchanged in every option. Details for each photo (photographer, Unsplash link, licence) are in the photography proposal PDF.</p></main></body></html>`;
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ not found: run npm run build first');
  process.exit(1);
}
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
for (const f of fs.readdirSync(IMG_SRC)) fs.copyFileSync(path.join(IMG_SRC, f), path.join(OUT, 'img', f));
for (const opt of OPTIONS) {
  for (const p of PAGES) {
    const src = path.join(DIST, p, 'index.html');
    const dest = path.join(OUT, opt, p, 'index.html');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, transform(fs.readFileSync(src, 'utf8'), opt, p));
  }
}
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
// keep crawlers out of the preview
const robots = path.join(DIST, 'robots.txt');
if (fs.existsSync(robots)) {
  const txt = fs.readFileSync(robots, 'utf8');
  if (!txt.includes('/photo-preview/')) {
    fs.writeFileSync(robots, /User-agent: \*\n/.test(txt)
      ? txt.replace(/User-agent: \*\n/, 'User-agent: *\nDisallow: /photo-preview/\n')
      : txt + '\nUser-agent: *\nDisallow: /photo-preview/\n');
  }
}
console.log('Photo preview written to dist/photo-preview/ (options a, b, c)');
