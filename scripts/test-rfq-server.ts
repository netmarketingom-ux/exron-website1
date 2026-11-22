/**
 * Server-side test of what happens after Netlify Forms accepts a submission
 * (netlify/functions/submission-created.ts). The email service (Resend) and the
 * attachment download are simulated, so no real email is sent.
 *   npx tsx scripts/test-rfq-server.ts [outputDir]
 */
import fs from 'node:fs';
import path from 'node:path';

process.env.RESEND_API_KEY = 'test-key';
process.env.RFQ_INBOX = 'procurement@example.com';

const OUT = process.argv[2] || 'test-results';
fs.mkdirSync(OUT, { recursive: true });

type Sent = { to: string[]; subject: string; text: string; reply_to?: string; attachments?: { filename: string }[] };
let sent: Sent[] = [];
let resendStatus = 200;
const logs: string[] = [];
for (const level of ['log', 'warn', 'error'] as const) {
  console[level] = (...a: unknown[]) => logs.push(`${level}: ${a.join(' ')}`);
}

globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
  const u = String(url);
  if (u === 'https://api.resend.com/emails') {
    sent.push(JSON.parse(String(init?.body)));
    return new Response('{}', { status: resendStatus });
  }
  if (u.startsWith('https://files.example.com/')) return new Response(new Uint8Array([37, 80, 68, 70]), { status: 200 });
  return new Response('not found', { status: 404 });
}) as typeof fetch;

const results: { name: string; pass: boolean; detail: string }[] = [];
const check = (name: string, pass: boolean, detail = '') => {
  results.push({ name, pass, detail });
  process.stdout.write(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}\n`);
};

const valid = {
  'form-name': 'rfq',
  division: 'government',
  organization: 'Test Organization LLC',
  contact_name: 'Jordan Test',
  email: 'buyer@example.com',
  phone: '+971 50 000 0000',
  solicitation_number: 'W912-TEST-0001',
  quote_due: '2026-12-15',
  description: 'HVAC spare parts for building 12',
  line_items: '1. Split AC unit 18,000 BTU | Qty: 12 EA\n2. Copper pipe 1/2 in | Qty: 200 M',
  quantities: '',
  destination: 'Abu Dhabi, United Arab Emirates',
  delivery_date: '2027-01-20',
  reference: 'EXR-RFQ-261122-AB2C',
  no_controlled_info: 'confirmed',
  privacy_consent: 'agreed',
  attachment_1: { url: 'https://files.example.com/spec.pdf', filename: 'spec.pdf', type: 'application/pdf', size: 4 },
  attachment_2: { url: 'https://files.example.com/virus.exe', filename: 'virus.exe', size: 4 },
};
const event = (form: string, data: Record<string, unknown>) => ({
  body: JSON.stringify({ payload: { form_name: form, created_at: '2026-11-22T09:30:00Z', data } }),
});

(async () => {
  const { handler } = await import('../netlify/functions/submission-created');

  // 1. Valid RFQ: internal notification with files, then acknowledgment to the requester
  sent = []; logs.length = 0;
  let res = await handler(event('rfq', valid));
  const internal = sent[0];
  const ack = sent[1];
  check('Valid RFQ: two emails sent (internal notification, then customer acknowledgment)', sent.length === 2 && res.statusCode === 200);
  check('Internal notification goes to the procurement inbox (RFQ_INBOX)', internal?.to?.[0] === 'procurement@example.com', internal?.subject);
  check('Internal notification includes reference, solicitation number and line items',
    /EXR-RFQ-261122-AB2C/.test(internal?.text) && /W912-TEST-0001/.test(internal?.text) && /Qty: 12 EA/.test(internal?.text));
  check('Allowed attachment is attached to the internal email', internal?.attachments?.some((a) => a.filename === 'spec.pdf') ?? false);
  check('Disallowed attachment (.exe) is refused and reported, not attached',
    !(internal?.attachments ?? []).some((a) => a.filename === 'virus.exe') && /virus\.exe/.test(internal?.text));
  check('Internal notification reply-to is the requester', internal?.reply_to === 'buyer@example.com');
  check('Acknowledgment goes to the requester with the reference in the subject', ack?.to?.[0] === 'buyer@example.com' && /EXR-RFQ-261122-AB2C/.test(ack?.subject), ack?.subject);
  check('Acknowledgment does not promise a response time that has not been confirmed', !/within|same business day|as soon as possible/i.test(ack?.text ?? ''));
  check('Acknowledgment repeats the classified / CUI / export-controlled warning', /classified/i.test(ack?.text) && /export-controlled/i.test(ack?.text));
  check('Logs contain no submitted values (privacy)', !logs.some((l) => /buyer@example\.com|Test Organization|W912/.test(l)), logs.join(' | '));

  // 2. Server-side validation: missing required fields
  sent = []; logs.length = 0;
  res = await handler(event('rfq', { ...valid, organization: '', email: 'not-an-email', destination: '' }));
  check('Invalid RFQ (missing organization/destination, bad email) is rejected; no emails sent', sent.length === 0 && res.statusCode === 200, logs.join(' | '));

  // 3. Quantities: either line items or the item list is required
  sent = []; logs.length = 0;
  await handler(event('rfq', { ...valid, line_items: '', quantities: '' }));
  check('RFQ without line items or item list is rejected', sent.length === 0, logs.join(' | '));
  sent = [];
  await handler(event('rfq', { ...valid, line_items: '', quantities: 'Cable ties, 40 EA' }));
  check('RFQ with item list instead of table is accepted', sent.length === 2);

  // 4. Spam honeypot
  sent = []; logs.length = 0;
  await handler(event('rfq', { ...valid, 'bot-field': 'http://spam.example' }));
  check('Submission with honeypot filled is ignored', sent.length === 0, logs.join(' | '));

  // 5. Reference generated on the server if the browser did not provide a valid one
  sent = [];
  await handler(event('rfq', { ...valid, reference: 'bogus' }));
  const ref = (sent[0]?.text.match(/EXR-RFQ-\d{6}-[A-Z0-9]{4}/) || [])[0];
  check('Missing or invalid reference is replaced by a server-generated one', !!ref, ref);

  // 6. Email service failure: logged, submission remains in Netlify Forms
  sent = []; logs.length = 0; resendStatus = 500;
  res = await handler(event('rfq', valid));
  check('Email service failure is logged without crashing (submission stays stored in Netlify Forms)',
    res.statusCode === 200 && logs.some((l) => /failed via email: Resend responded 500/.test(l)), logs.join(' | '));
  resendStatus = 200;

  // 7. Missing email configuration
  sent = []; logs.length = 0;
  const key = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY;
  await handler(event('rfq', valid));
  check('Without RESEND_API_KEY, no email is sent and the error is logged', sent.length === 0 && logs.some((l) => /RESEND_API_KEY is not set/.test(l)));
  process.env.RESEND_API_KEY = key;

  // 8. General contact form
  const contact = { 'form-name': 'contact', name: 'Alex Test', email: 'alex@example.com', subject: 'Supplier registration', message: 'Hello', privacy_consent: 'agreed' };
  sent = [];
  await handler(event('contact', { ...contact, privacy_consent: '' }));
  check('Contact message without privacy consent is rejected', sent.length === 0);
  sent = [];
  await handler(event('contact', contact));
  check('Contact form message is delivered to the inbox', sent.length === 1 && sent[0].to[0] === 'procurement@example.com' && sent[0].reply_to === 'alex@example.com');

  fs.writeFileSync(path.join(OUT, 'rfq-server-results.json'), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.pass).length;
  process.stdout.write(`\n${results.length - failed}/${results.length} checks passed\n`);
  process.exit(failed ? 1 : 0);
})();
