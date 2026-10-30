import { ALLOWED_EXTENSIONS, DIVISIONS, EMAIL_RE, FIELD_LIMITS, MAX_FILES, REFERENCE_RE, extensionOf, makeReference } from './rules';
import type { Attachment, ContactSubmission, RfqSubmission } from './types';

type Raw = Record<string, unknown>;

const text = (data: Raw, key: string) => {
  const v = data[key];
  const s = typeof v === 'string' ? v.trim() : '';
  return s.slice(0, FIELD_LIMITS[key] ?? 5000);
};

/** Netlify passes uploaded files either as a URL string or as { url, filename, type, size }. */
function attachment(value: unknown): Attachment | null {
  if (!value) return null;
  if (typeof value === 'string') {
    if (!/^https:\/\//.test(value)) return null;
    const filename = decodeURIComponent(new URL(value).pathname.split('/').pop() ?? 'attachment');
    return { filename, url: value };
  }
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    const url = typeof v.url === 'string' ? v.url : '';
    if (!/^https:\/\//.test(url)) return null;
    return {
      url,
      filename: typeof v.filename === 'string' ? v.filename : 'attachment',
      type: typeof v.type === 'string' ? v.type : undefined,
      size: typeof v.size === 'number' ? v.size : undefined,
    };
  }
  return null;
}

export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export function normalizeRfq(data: Raw, createdAt?: string): Result<RfqSubmission> {
  const errors: string[] = [];
  const division = text(data, 'division');
  const reference = text(data, 'reference');

  const rfq: RfqSubmission = {
    reference: REFERENCE_RE.test(reference) ? reference : makeReference(),
    receivedAt: createdAt ?? new Date().toISOString(),
    division,
    divisionLabel: DIVISIONS[division] ?? '',
    organization: text(data, 'organization'),
    contactName: text(data, 'contact_name'),
    email: text(data, 'email'),
    phone: text(data, 'phone'),
    solicitationNumber: text(data, 'solicitation_number'),
    quoteDue: text(data, 'quote_due'),
    description: text(data, 'description'),
    lineItems: text(data, 'line_items'),
    quantities: text(data, 'quantities'),
    destination: text(data, 'destination'),
    deliveryDate: text(data, 'delivery_date'),
    instructions: text(data, 'instructions'),
    attachments: [],
    rejectedAttachments: [],
  };

  for (let n = 1; n <= MAX_FILES; n++) {
    const a = attachment(data[`attachment_${n}`]);
    if (!a) continue;
    // A file of the wrong type is dropped, not delivered; the request itself still goes through.
    if (!ALLOWED_EXTENSIONS.includes(extensionOf(a.filename))) rfq.rejectedAttachments.push(a.filename);
    else rfq.attachments.push(a);
  }

  if (!rfq.divisionLabel) errors.push('division: missing or unknown');
  if (!rfq.organization) errors.push('organization: required');
  if (!rfq.contactName) errors.push('contact_name: required');
  if (!EMAIL_RE.test(rfq.email)) errors.push('email: invalid');
  if (!rfq.description) errors.push('description: required');
  if (!rfq.quantities && !rfq.lineItems) errors.push('quantities: required when no line items');
  if (!rfq.destination) errors.push('destination: required');
  if (!data.no_controlled_info) errors.push('no_controlled_info: not confirmed');
  if (!data.privacy_consent) errors.push('privacy_consent: not given');

  return errors.length ? { ok: false, errors } : { ok: true, value: rfq };
}

export function normalizeContact(data: Raw, createdAt?: string): Result<ContactSubmission> {
  const msg: ContactSubmission = {
    receivedAt: createdAt ?? new Date().toISOString(),
    name: text(data, 'name').slice(0, 120),
    email: text(data, 'email'),
    subject: text(data, 'subject').slice(0, 200),
    message: text(data, 'message'),
  };
  const errors: string[] = [];
  if (!msg.name) errors.push('name: required');
  if (!EMAIL_RE.test(msg.email)) errors.push('email: invalid');
  if (!msg.subject) errors.push('subject: required');
  if (!msg.message) errors.push('message: required');
  if (!data.privacy_consent) errors.push('privacy_consent: not given');
  return errors.length ? { ok: false, errors } : { ok: true, value: msg };
}
