export interface Attachment {
  filename: string;
  url: string;
  type?: string;
  size?: number;
}

export interface RfqSubmission {
  reference: string;
  receivedAt: string;
  division: string;
  divisionLabel: string;
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  solicitationNumber: string;
  quoteDue: string;
  description: string;
  lineItems: string;
  quantities: string;
  destination: string;
  deliveryDate: string;
  instructions: string;
  attachments: Attachment[];
  /** Files dropped by server validation (wrong type), by file name. */
  rejectedAttachments: string[];
}

export interface ContactSubmission {
  receivedAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Every system that should receive a submission implements this interface.
 * Today: email (Resend). Later: Odoo CRM, switched on with ODOO_ENABLED=true.
 */
export interface RfqAdapter {
  name: string;
  handleRfq(rfq: RfqSubmission): Promise<void>;
  handleContact?(msg: ContactSubmission): Promise<void>;
}
