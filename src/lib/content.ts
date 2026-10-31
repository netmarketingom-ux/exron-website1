import yaml from 'js-yaml';
import site from '../content/site.json';
import homeRaw from '../content/home.yml?raw';
import vendorRaw from '../content/vendor.yml?raw';
import type { ImageMetadata } from 'astro';

export { site };

/* eslint-disable @typescript-eslint/no-explicit-any */
export const home = yaml.load(homeRaw) as any;

export interface VendorField {
  label: string;
  value: string;
  file?: string;
  show: boolean;
}
export const vendor = yaml.load(vendorRaw) as Record<string, VendorField>;
export const visibleVendorFields = Object.entries(vendor)
  .filter(([, f]) => f.show)
  .map(([key, f]) => ({ key, ...f }));

export const CONFIRM_RE = /\[CONFIRM[^\]]*\]/g;

/** True when a value has been filled in (not empty, not a placeholder). */
export const isSet = (v?: string | null): v is string => !!v && !/\[CONFIRM/.test(v);

const tokens: Record<string, string> = {
  headquarters: site.headquarters,
  rfq_acknowledgment: site.rfq_acknowledgment,
  procurement_email: site.procurement_email,
};

const fill = (text: string) => text.replace(/\{(\w+)\}/g, (m, k) => tokens[k] ?? m);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Highlight [CONFIRM: ...] markers in a string that is already HTML. */
export const markConfirm = (html: string) =>
  html.replace(CONFIRM_RE, (m) => `<mark class="confirm">${m}</mark>`);

/** Content string to safe HTML: tokens filled, placeholders highlighted. */
export const rich = (text = '') => markConfirm(escapeHtml(fill(text)));

/** Plain text for meta tags and structured data: placeholders removed. */
export const plain = (text = '') =>
  fill(text).replace(CONFIRM_RE, '').replace(/\s{2,}/g, ' ').trim();

const digits = (v: string) => v.replace(/[^\d+]/g, '');
export const procurementEmail = isSet(site.procurement_email) ? site.procurement_email : '';
export const telHref = isSet(site.phone) ? `tel:${digits(site.phone)}` : '';
export const whatsappHref = isSet(site.whatsapp) ? `https://wa.me/${digits(site.whatsapp).replace('+', '')}` : '';

/**
 * Images uploaded through the CMS are stored in src/assets/images and
 * referenced as "/src/assets/images/<file>". They are optimized at build time.
 */
const uploads = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});
export const resolveImage = (path?: string): ImageMetadata | undefined =>
  path ? uploads[path]?.default : undefined;
