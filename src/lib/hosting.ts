/**
 * Which host the site is built for.
 * `npm run build` targets Netlify (Netlify Forms + function).
 * `npm run build:cpanel` targets standard cPanel hosting such as Namecheap: the forms post to
 * PHP scripts in hosting/cpanel/forms/ and no outside service is used.
 */
export const CPANEL = process.env.HOSTING === 'cpanel';

/** Form attributes that only Netlify understands. */
export const netlifyFormAttrs = (): Record<string, string> =>
  CPANEL ? {} : { 'data-netlify': 'true', 'netlify-honeypot': 'bot-field', 'data-netlify-recaptcha': 'true' };
