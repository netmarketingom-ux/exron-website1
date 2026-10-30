// Fails a production build while any [CONFIRM: ...] placeholder is still rendered.
// Deploy previews and branch deploys only report them.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SKIP = ['brand/'];  // the identity page shows a placeholder as an example
const RE = /\[CONFIRM[^\]]*\]/g;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const found = new Map();
for await (const file of htmlFiles(DIST)) {
  const rel = relative(DIST, file);
  if (SKIP.some((s) => rel.startsWith(s))) continue;
  const text = (await readFile(file, 'utf8')).replace(/<[^>]+>/g, ' ');
  const hits = [...new Set(text.match(RE) ?? [])];
  if (hits.length) found.set(rel, hits);
}

const total = [...found.values()].reduce((n, h) => n + h.length, 0);
if (!total) {
  console.log('check:placeholders: no [CONFIRM] placeholders found.');
  process.exit(0);
}

console.log(`check:placeholders: ${total} open placeholder(s)`);
for (const [file, hits] of found) {
  console.log(`  ${file}`);
  for (const h of hits) console.log(`    ${h}`);
}

const isProduction = process.env.CONTEXT === 'production' || process.argv.includes('--strict');
if (isProduction) {
  console.error('Production build stopped: replace every [CONFIRM] placeholder first.');
  process.exit(1);
}
console.log('Not a production build: continuing.');
