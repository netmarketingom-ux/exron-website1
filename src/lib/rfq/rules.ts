/** Rules shared by the browser form and the submission-created function. */

export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
export const MAX_FILES = 3;
/** Netlify Forms accepts up to 8 MB per submission, fields included. */
export const MAX_TOTAL_BYTES = 8 * 1024 * 1024 - 256 * 1024;

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
export const REFERENCE_RE = /^EXR-RFQ-\d{6}-[A-Z0-9]{4}$/;

export const DIVISIONS: Record<string, string> = {
  government: 'Government / military installation',
  contractor: 'Prime or defense support contractor',
  commercial: 'Commercial / industrial',
};

export const FIELD_LIMITS: Record<string, number> = {
  organization: 200,
  contact_name: 120,
  email: 200,
  phone: 40,
  solicitation_number: 100,
  quote_due: 20,
  description: 5000,
  line_items: 20000,
  quantities: 5000,
  destination: 300,
  delivery_date: 20,
  instructions: 5000,
  reference: 30,
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** EXR-RFQ-YYMMDD-XXXX, using the date the request is sent (UTC). */
export function makeReference(now = new Date(), random?: Uint8Array): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const bytes = random ?? crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `EXR-RFQ-${yy}${mm}${dd}-${suffix}`;
}

export const extensionOf = (name: string) => (name.split('.').pop() ?? '').toLowerCase();
