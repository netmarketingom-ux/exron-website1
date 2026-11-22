// Turns the cPanel build in dist/ into a ready-to-upload package:
// adds the PHP form handlers and server settings, removes Netlify-only parts, and zips it.
import { cpSync, rmSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const DIST = 'dist';
const OUT = 'release';
const ZIP = `${OUT}/exron-website-cpanel.zip`;

if (process.env.HOSTING !== 'cpanel') {
  console.error('Run with HOSTING=cpanel (use: npm run build:cpanel).');
  process.exit(1);
}

cpSync('hosting/cpanel', DIST, { recursive: true });               // .htaccess files, forms/*.php, .user.ini
copyFileSync('src/legacy/data/site.json', `${DIST}/forms/site.json`); // company details for the emails
rmSync(`${DIST}/admin`, { recursive: true, force: true });          // content manager needs Netlify Identity

mkdirSync(OUT, { recursive: true });
rmSync(ZIP, { force: true });
try {
  execFileSync('zip', ['-qr', `../${ZIP}`, '.'], { cwd: DIST });
  console.log(`Package ready: ${ZIP}. Upload its contents to public_html.`);
} catch {
  console.log(`Folder ready: ${DIST}/. Upload its contents (including hidden .htaccess files) to public_html.`);
}
if (!existsSync(`${DIST}/forms/rfq.php`)) process.exit(1);
