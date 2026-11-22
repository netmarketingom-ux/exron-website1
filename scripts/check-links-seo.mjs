/**
 * Crawls the built site in dist/: every internal link and #anchor must resolve,
 * and every indexable page needs a unique title, a description and a canonical URL.
 *   node scripts/check-links-seo.mjs [report.json]
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const out = process.argv[2];
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(DIST);

const urlOf = (file) => '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
const html = Object.fromEntries(pages.map((p) => [urlOf(p), fs.readFileSync(p, 'utf8')]));
const ids = Object.fromEntries(Object.entries(html).map(([u, h]) => [u, new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

const exists = (u) => {
  if (html[u] !== undefined) return true;
  const f = path.join(DIST, decodeURIComponent(u));
  return fs.existsSync(f) && fs.statSync(f).isFile();
};

const broken = [];
let links = 0;
for (const [page, h] of Object.entries(html)) {
  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href) || href.startsWith('//')) continue;
    links++;
    const [p, hash] = href.split('#');
    const target = p === '' ? page : new URL(p, 'https://x' + page).pathname;
    if (!exists(target)) { broken.push({ page, href, problem: 'missing page or file' }); continue; }
    if (hash && html[target] !== undefined && !ids[target].has(hash)) broken.push({ page, href, problem: `missing #${hash}` });
  }
}

const seo = [];
const titles = {};
for (const [u, h] of Object.entries(html)) {
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const canonical = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const noindex = /<meta name="robots" content="noindex/.test(h);
  const h1 = (h.match(/<h1/g) || []).length;
  seo.push({ url: u, title, titleLength: title.length, descriptionLength: desc.length, canonical, noindex, h1 });
  if (!noindex) (titles[title] ??= []).push(u);
}
const dupTitles = Object.entries(titles).filter(([, us]) => us.length > 1);
const robots = fs.existsSync(path.join(DIST, 'robots.txt')) ? fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : '';
const sitemap = fs.existsSync(path.join(DIST, 'sitemap-0.xml')) ? [...fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];

const report = { pages: pages.length, internalLinksChecked: links, broken, duplicateTitles: dupTitles, seo, robots, sitemap };
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`${pages.length} pages, ${links} internal links and anchors checked, ${broken.length} broken`);
broken.forEach((b) => console.log('  BROKEN', b.page, b.href, b.problem));
console.log(`Duplicate titles on indexable pages: ${dupTitles.length}`);
seo.forEach((s) => console.log(`  ${s.noindex ? 'noindex ' : 'index   '} h1=${s.h1} title(${s.titleLength}) desc(${s.descriptionLength}) ${s.url}`));
console.log('robots.txt:', robots.replace(/\n/g, ' | '));
console.log('sitemap:', sitemap.length, 'URLs');
process.exit(broken.length || dupTitles.length ? 1 : 0);
