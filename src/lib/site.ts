import site from '../data/site.json';

export const PLACEHOLDER_RE = /\[(?:CLIENT TO PROVIDE|CONFIRM)[^\]]*\]/g;

/** True when a value has been filled in (not empty, not a placeholder). */
export const isSet = (v?: string | null): v is string =>
  !!v && !/^\s*\[(CLIENT TO PROVIDE|CONFIRM)/.test(v);

const digits = (v: string) => v.replace(/[^\d+]/g, '');

export const telHref = isSet(site.phone) ? `tel:${digits(site.phone)}` : '/contact/#contact-details';
export const whatsappHref = isSet(site.whatsapp)
  ? `https://wa.me/${digits(site.whatsapp).replace('+', '')}`
  : '/contact/#contact-details';
export const mailHref = `mailto:${site.email}`;

/** Resolve special link keywords used in the data files. */
export function resolveHref(href: string): string {
  if (href === 'whatsapp') return whatsappHref;
  if (href === 'phone') return telHref;
  if (href === 'email') return mailHref;
  return href;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);

const tokens: Record<string, string> = {
  responseTime: site.responseTime,
  email: site.email,
  phone: site.phone,
  whatsapp: site.whatsapp,
  address: site.address,
  hours: site.hours,
  headquarters: site.headquarters,
  procurementEmail: site.procurementEmail,
  groupName: site.groupName,
  rfqAcknowledgment: site.rfqAcknowledgment,
  naics: site.vendor.naics,
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Turn a plain string from the content files into safe HTML:
 * - {responseTime}, {email}, {phone}... are replaced with values from site.json
 * - [CLIENT TO PROVIDE: ...] markers are highlighted so they are easy to spot
 */
export function rich(text = ''): string {
  const filled = text.replace(/\{(\w+)\}/g, (m, k) => tokens[k] ?? m);
  return esc(filled).replace(PLACEHOLDER_RE, (m) => `<mark class="ph">${m}</mark>`);
}

/** Plain-text version (for meta tags and JSON-LD): placeholders are dropped. */
export function plain(text = ''): string {
  return text
    .replace(/\{(\w+)\}/g, (m, k) => tokens[k] ?? m)
    .replace(PLACEHOLDER_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export { site };
