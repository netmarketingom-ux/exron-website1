import type { RfqAdapter, RfqSubmission } from './types';

/**
 * Creates a CRM lead in Odoo for each RFQ, with the uploaded documents attached.
 * Not active until ODOO_ENABLED=true. See docs/odoo-integration.md.
 */

interface OdooConfig { url: string; db: string; user: string; apiKey: string }

export const odooEnabled = () => process.env.ODOO_ENABLED === 'true';

function config(): OdooConfig {
  const { ODOO_URL, ODOO_DB, ODOO_USER, ODOO_API_KEY } = process.env;
  if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_API_KEY) {
    throw new Error('ODOO_URL, ODOO_DB, ODOO_USER and ODOO_API_KEY must all be set');
  }
  return { url: ODOO_URL.replace(/\/$/, ''), db: ODOO_DB, user: ODOO_USER, apiKey: ODOO_API_KEY };
}

async function rpc<T>(cfg: OdooConfig, service: string, method: string, args: unknown[]): Promise<T> {
  const res = await fetch(`${cfg.url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { service, method, args }, id: Date.now() }),
  });
  if (!res.ok) throw new Error(`Odoo responded ${res.status}`);
  const body = (await res.json()) as { result?: T; error?: { message?: string } };
  if (body.error) throw new Error(`Odoo error: ${body.error.message ?? 'unknown'}`);
  return body.result as T;
}

const execute = <T>(cfg: OdooConfig, uid: number, model: string, method: string, args: unknown[]) =>
  rpc<T>(cfg, 'object', 'execute_kw', [cfg.db, uid, cfg.apiKey, model, method, args]);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function leadValues(rfq: RfqSubmission) {
  const rows: [string, string][] = [
    ['Reference', rfq.reference],
    ['Division', rfq.divisionLabel],
    ['RFQ / solicitation no.', rfq.solicitationNumber],
    ['Quotation due', rfq.quoteDue],
    ['Description', rfq.description],
    ['Line items', rfq.lineItems],
    ['Quantities', rfq.quantities],
    ['Delivery destination', rfq.destination],
    ['Requested delivery date', rfq.deliveryDate],
    ['Additional instructions', rfq.instructions],
  ];
  return {
    name: `${rfq.reference} ${rfq.organization}${rfq.solicitationNumber ? ` / ${rfq.solicitationNumber}` : ''}`,
    type: 'opportunity',
    partner_name: rfq.organization,
    contact_name: rfq.contactName,
    email_from: rfq.email,
    phone: rfq.phone || false,
    description: rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<p><strong>${esc(k)}:</strong><br>${esc(v).replace(/\n/g, '<br>')}</p>`)
      .join(''),
  };
}

export const odooAdapter: RfqAdapter = {
  name: 'odoo',
  async handleRfq(rfq) {
    const cfg = config();
    const uid = await rpc<number | false>(cfg, 'common', 'authenticate', [cfg.db, cfg.user, cfg.apiKey, {}]);
    if (!uid) throw new Error('Odoo authentication failed');

    const leadId = await execute<number>(cfg, uid, 'crm.lead', 'create', [leadValues(rfq)]);

    // Netlify file links are signed and expire, so copy the files into Odoo now.
    for (const file of rfq.attachments) {
      const res = await fetch(file.url);
      if (!res.ok) throw new Error(`Attachment download failed (${res.status})`);
      const datas = Buffer.from(await res.arrayBuffer()).toString('base64');
      await execute<number>(cfg, uid, 'ir.attachment', 'create', [
        { name: file.filename, datas, res_model: 'crm.lead', res_id: leadId, mimetype: file.type || undefined },
      ]);
    }
  },
};
