import { activeAdapters, normalizeContact, normalizeRfq } from '../../src/lib/rfq';

/**
 * Runs automatically after Netlify Forms accepts a verified (non-spam) submission.
 * Logs only form name, reference, outcome and field names. Never field values or files.
 */

interface SubmissionEvent {
  body: string;
}

interface Payload {
  form_name?: string;
  created_at?: string;
  data?: Record<string, unknown>;
}

const ok = { statusCode: 200, body: '' };

export const handler = async (event: SubmissionEvent) => {
  let payload: Payload;
  try {
    payload = (JSON.parse(event.body) as { payload: Payload }).payload;
  } catch {
    console.error('submission-created: unreadable event body');
    return ok;
  }
  const data = payload?.data ?? {};
  const adapters = activeAdapters();

  // The honeypot should already have been caught by Netlify; this is a second check.
  if (typeof data['bot-field'] === 'string' && data['bot-field'].trim()) {
    console.warn(`submission-created: ${payload.form_name} ignored (honeypot filled)`);
    return ok;
  }

  if (payload.form_name === 'rfq') {
    const result = normalizeRfq(data, payload.created_at);
    if (!result.ok) {
      console.warn(`submission-created: rfq rejected by server validation (${result.errors.map((e) => e.split(':')[0]).join(', ')})`);
      return ok;
    }
    const rfq = result.value;
    for (const adapter of adapters) {
      try {
        await adapter.handleRfq(rfq);
        console.log(`submission-created: ${rfq.reference} delivered via ${adapter.name}`);
      } catch (err) {
        console.error(`submission-created: ${rfq.reference} failed via ${adapter.name}: ${(err as Error).message}`);
      }
    }
    return ok;
  }

  if (payload.form_name === 'contact') {
    const result = normalizeContact(data, payload.created_at);
    if (!result.ok) {
      console.warn(`submission-created: contact rejected by server validation (${result.errors.map((e) => e.split(':')[0]).join(', ')})`);
      return ok;
    }
    for (const adapter of adapters) {
      if (!adapter.handleContact) continue;
      try {
        await adapter.handleContact(result.value);
        console.log(`submission-created: contact message delivered via ${adapter.name}`);
      } catch (err) {
        console.error(`submission-created: contact message failed via ${adapter.name}: ${(err as Error).message}`);
      }
    }
    return ok;
  }

  console.warn(`submission-created: unknown form ${payload?.form_name ?? '(none)'}`);
  return ok;
};
