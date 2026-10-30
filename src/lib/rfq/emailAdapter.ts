import site from '../../content/site.json';
import type { ContactSubmission, RfqAdapter, RfqSubmission } from './types';

const RESEND_URL = 'https://api.resend.com/emails';
const FROM = process.env.RFQ_FROM ?? 'Exron Global Procurement <rfq@exronglobal.com>';

const confirmed = (v: string) => (/\[CONFIRM/.test(v) ? '' : v);
const responseTime = confirmed(site.rfq_acknowledgment) || 'as soon as possible';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>');

interface Email {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
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
    }),
  });
  // Status only: the response body may echo submission content.
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

const inbox = () => {
  const to = (process.env.RFQ_INBOX ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!to.length) throw new Error('RFQ_INBOX is not set');
  return to;
};

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
  const notice = site.secure_notice;
  return {
    to: [rfq.email],
    subject: `RFQ received: ${rfq.reference}${rfq.solicitationNumber ? ` (${rfq.solicitationNumber})` : ''}`,
    replyTo: confirmed(site.procurement_email) || undefined,
    html: wrap(
      `<p>Dear ${esc(rfq.contactName)},</p><p>${esc(intro)}</p>${table(summary)}<p>Please quote the reference in any correspondence about this request.</p><p style="font-size:13px;color:#5C6070">${esc(notice)}</p><p>Exron Global Procurement</p>`
    ),
    text: `Dear ${rfq.contactName},\n\n${intro}\n\n${plainRows(summary)}\n\nPlease quote the reference in any correspondence about this request.\n\n${notice}\n\nExron Global Procurement\n\n${site.disclaimer}`,
  };
}

export function internalEmail(rfq: RfqSubmission): Email {
  const files = rfq.attachments
    .map((a) => `<li><a href="${esc(a.url)}">${esc(a.filename)}</a>${a.size ? ` (${Math.round(a.size / 1024)} KB)` : ''}</li>`)
    .join('');
  const rejected = rfq.rejectedAttachments.length
    ? `Not delivered (file type not accepted): ${rfq.rejectedAttachments.join(', ')}`
    : '';
  return {
    to: inbox(),
    subject: `[${rfq.reference}] New RFQ: ${rfq.organization}${rfq.solicitationNumber ? ` / ${rfq.solicitationNumber}` : ''}`,
    replyTo: rfq.email,
    html: wrap(
      `<p><strong>New RFQ submitted through exronglobal.com</strong><br>Received ${esc(rfq.receivedAt)}</p>${table(rfqRows(rfq))}<p><strong>Attachments</strong></p>${files ? `<ul>${files}</ul><p style="font-size:12px;color:#5C6070">Links open the files stored in Netlify Forms. Sign in to Netlify if prompted.</p>` : '<p>None</p>'}${rejected ? `<p style="color:#B22234">${esc(rejected)}</p>` : ''}`
    ),
    text: `New RFQ submitted through exronglobal.com\nReceived ${rfq.receivedAt}\n\n${plainRows(rfqRows(rfq))}\n\nAttachments:\n${rfq.attachments.map((a) => `${a.filename}: ${a.url}`).join('\n') || 'None'}${rejected ? `\n${rejected}` : ''}`,
  };
}

export const emailAdapter: RfqAdapter = {
  name: 'email',
  async handleRfq(rfq) {
    // Internal notification first: if acknowledgment fails, procurement still has the request.
    await send(internalEmail(rfq));
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
      html: wrap(`<p><strong>General inquiry through exronglobal.com</strong><br>Received ${esc(msg.receivedAt)}</p>${table(rows)}`),
      text: `General inquiry through exronglobal.com\nReceived ${msg.receivedAt}\n\n${plainRows(rows)}`,
    });
  },
};
