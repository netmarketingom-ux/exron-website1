import site from '../../legacy/data/site.json';
import type { Attachment, ContactSubmission, RfqAdapter, RfqSubmission } from './types';

const RESEND_URL = 'https://api.resend.com/emails';
const FROM = process.env.RFQ_FROM ?? 'Exron Global Procurement <rfq@exronglobal.com>';

// Values in site.json that are still placeholders are left out of emails.
const confirmed = (v: string) => (/\[(CONFIRM|CLIENT TO PROVIDE)/.test(v) ? '' : v);
const responseTime = confirmed(site.rfqAcknowledgment) || 'as soon as possible';
const SECURE_NOTICE =
  'Do not send classified information, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission.';
/** Netlify's file links expire, so procurement receives the files themselves. Resend allows 40 MB per email. */
const MAX_ATTACH_BYTES = 30 * 1024 * 1024;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>');

interface Email {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
}

async function send(email: Email) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: email.replyTo,
      attachments: email.attachments,
    }),
  });
  // Status only: the response body may echo submission content.
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

/** RFQ_INBOX first; until it is set, the confirmed procurement address, then the general address. */
const inbox = () => {
  const to = (process.env.RFQ_INBOX ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (to.length) return to;
  return [confirmed(site.procurementEmail) || site.email];
};

/** Download uploaded files for attaching. A file that cannot be fetched stays as a link only. */
async function fetchAttachments(files: Attachment[]) {
  const attached: { filename: string; content: string }[] = [];
  const linkOnly: Attachment[] = [];
  let total = 0;
  for (const file of files) {
    try {
      const res = await fetch(file.url);
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      if (total + buf.length > MAX_ATTACH_BYTES) throw new Error('too large');
      total += buf.length;
      attached.push({ filename: file.filename, content: buf.toString('base64') });
    } catch {
      linkOnly.push(file);
    }
  }
  return { attached, linkOnly };
}

function rfqRows(rfq: RfqSubmission): [string, string][] {
  return [
    ['Reference', rfq.reference],
    ['Division', rfq.divisionLabel],
    ['Organization', rfq.organization],
    ['Contact person', rfq.contactName],
    ['Email', rfq.email],
    ['Phone', rfq.phone],
    ['RFQ / solicitation no.', rfq.solicitationNumber],
    ['Quotation due', rfq.quoteDue],
    ['Description', rfq.description],
    ['Line items', rfq.lineItems],
    ['Quantities', rfq.quantities],
    ['Delivery destination', rfq.destination],
    ['Requested delivery date', rfq.deliveryDate],
    ['Additional instructions', rfq.instructions],
  ];
}

const table = (rows: [string, string][]) =>
  `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;width:100%;max-width:680px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="width:190px;border-bottom:1px solid #D9DAE0;color:#5C6070;font-weight:normal">${esc(k)}</th><td style="border-bottom:1px solid #D9DAE0;color:#1E1E2A">${nl2br(v)}</td></tr>`
    )
    .join('')}</table>`;

const plainRows = (rows: [string, string][]) =>
  rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');

const wrap = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;color:#1E1E2A;line-height:1.5"><div style="background:#3C3B6E;color:#fff;padding:16px 20px;font-weight:bold;letter-spacing:.04em">EXRON GLOBAL</div><div style="padding:20px">${inner}</div><p style="padding:0 20px;font-size:12px;color:#5C6070">${esc(site.disclaimer)}</p></div>`;

export function acknowledgmentEmail(rfq: RfqSubmission): Email {
  const files = rfq.attachments.map((a) => a.filename);
  const summary: [string, string][] = [
    ['Reference', rfq.reference],
    ['RFQ / solicitation no.', rfq.solicitationNumber],
    ['Organization', rfq.organization],
    ['Delivery destination', rfq.destination],
    ['Requested delivery date', rfq.deliveryDate],
    ['Quotation due', rfq.quoteDue],
    ['Documents received', files.join(', ')],
  ];
  const intro = `We have received your request and logged it under reference ${rfq.reference}. A member of our procurement team will contact you ${responseTime} to confirm the response deadline and any points we need to clarify, then prepare an itemized quotation.`;
  const notice = SECURE_NOTICE;
  return {
    to: [rfq.email],
    subject: `RFQ received: ${rfq.reference}${rfq.solicitationNumber ? ` (${rfq.solicitationNumber})` : ''}`,
    replyTo: confirmed(site.procurementEmail) || site.email,
    html: wrap(
      `<p>Dear ${esc(rfq.contactName)},</p><p>${esc(intro)}</p>${table(summary)}<p>Please quote the reference in any correspondence about this request.</p><p style="font-size:13px;color:#5C6070">${esc(notice)}</p><p>Exron Global Procurement</p>`
    ),
    text: `Dear ${rfq.contactName},\n\n${intro}\n\n${plainRows(summary)}\n\nPlease quote the reference in any correspondence about this request.\n\n${notice}\n\nExron Global Procurement\n\n${site.disclaimer}`,
  };
}

type Fetched = Awaited<ReturnType<typeof fetchAttachments>>;

/** "14 Nov 2026, 09:30 UTC" */
const when = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  return `${date}, ${time} UTC`;
};

export function internalEmail(rfq: RfqSubmission, files: Fetched = { attached: [], linkOnly: rfq.attachments }): Email {
  const attachedList = files.attached.map((a) => `<li>${esc(a.filename)} <span style="color:#5C6070">(attached)</span></li>`).join('');
  const linkList = files.linkOnly
    .map((a) => `<li><a href="${esc(a.url)}">${esc(a.filename)}</a>${a.size ? ` (${Math.round(a.size / 1024)} KB)` : ''} <span style="color:#5C6070">(link: open from Netlify Forms if it has expired)</span></li>`)
    .join('');
  const rejected = rfq.rejectedAttachments.length
    ? `Not delivered (file type not accepted): ${rfq.rejectedAttachments.join(', ')}`
    : '';
  const fileText = [
    ...files.attached.map((a) => `${a.filename} (attached)`),
    ...files.linkOnly.map((a) => `${a.filename}: ${a.url}`),
  ].join('\n') || 'None';
  return {
    to: inbox(),
    subject: `[${rfq.reference}] New RFQ: ${rfq.organization}${rfq.solicitationNumber ? ` / ${rfq.solicitationNumber}` : ''}`,
    replyTo: rfq.email,
    attachments: files.attached.length ? files.attached : undefined,
    html: wrap(
      `<p><strong>New RFQ submitted through exronglobal.com</strong><br>Received ${esc(when(rfq.receivedAt))}</p>${table(rfqRows(rfq))}<p><strong>Documents</strong></p>${attachedList || linkList ? `<ul>${attachedList}${linkList}</ul>` : '<p>None</p>'}${rejected ? `<p style="color:#B22234">${esc(rejected)}</p>` : ''}<p style="font-size:12px;color:#5C6070">Reply to this email to answer the requester directly.</p>`
    ),
    text: `New RFQ submitted through exronglobal.com\nReceived ${when(rfq.receivedAt)}\n\n${plainRows(rfqRows(rfq))}\n\nDocuments:\n${fileText}${rejected ? `\n${rejected}` : ''}`,
  };
}

export const emailAdapter: RfqAdapter = {
  name: 'email',
  async handleRfq(rfq) {
    // Internal notification first: if acknowledgment fails, procurement still has the request.
    await send(internalEmail(rfq, await fetchAttachments(rfq.attachments)));
    await send(acknowledgmentEmail(rfq));
  },
  async handleContact(msg: ContactSubmission) {
    const rows: [string, string][] = [
      ['Name', msg.name],
      ['Email', msg.email],
      ['Subject', msg.subject],
      ['Message', msg.message],
    ];
    await send({
      to: inbox(),
      subject: `Website inquiry: ${msg.subject}`,
      replyTo: msg.email,
      html: wrap(`<p><strong>General inquiry through exronglobal.com</strong><br>Received ${esc(when(msg.receivedAt))}</p>${table(rows)}`),
      text: `General inquiry through exronglobal.com\nReceived ${when(msg.receivedAt)}\n\n${plainRows(rows)}`,
    });
  },
};
