import { emailAdapter } from './emailAdapter';
import { odooAdapter, odooEnabled } from './odooAdapter';
import type { RfqAdapter } from './types';

export { normalizeRfq, normalizeContact } from './normalize';
export type { RfqSubmission, ContactSubmission, RfqAdapter } from './types';

/** Adapters that receive each submission, in order. */
export function activeAdapters(): RfqAdapter[] {
  const adapters: RfqAdapter[] = [emailAdapter];
  if (odooEnabled()) adapters.push(odooAdapter);
  return adapters;
}
