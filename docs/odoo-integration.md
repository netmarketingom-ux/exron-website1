# Odoo integration

RFQ submissions are passed to a list of **adapters**. Each adapter delivers the submission to one system.

- **Today:** only the email adapter runs.
- **Ready to switch on:** an Odoo adapter is already written. It needs no code changes, only the settings below.

## How a submission flows

1. **Netlify Forms** receives the RFQ and its attachments.
2. Netlify triggers the `submission-created` function in `netlify/functions/submission-created.ts`.
3. The function rechecks every field (server-side validation).
4. It passes the cleaned submission to each active adapter, in turn:
   - **emailAdapter** sends the internal notification and the customer acknowledgment through Resend.
   - **odooAdapter** creates a CRM opportunity. It runs only when `ODOO_ENABLED=true`.
5. If one adapter fails, the failure is logged and the next adapter still runs.

Only the reference number and the result are logged, never the field contents.

## Code

| File | Purpose |
| --- | --- |
| `src/lib/rfq/types.ts` | `RfqSubmission` and the `RfqAdapter` interface |
| `src/lib/rfq/normalize.ts` | Server-side validation and cleanup of the raw form data |
| `src/lib/rfq/rules.ts` | Limits shared with the browser form (file types, sizes, reference format) |
| `src/lib/rfq/emailAdapter.ts` | Resend emails |
| `src/lib/rfq/odooAdapter.ts` | Odoo lead creation |
| `src/lib/rfq/index.ts` | `activeAdapters()`: decides which adapters run |

## What the Odoo adapter does

1. It signs in through Odoo's external JSON-RPC API (`/jsonrpc`, `common.authenticate`) using an API key.
2. It creates a `crm.lead` with these values:
   - `type: opportunity`
   - name: `<reference> <organization> / <solicitation no.>`
   - `partner_name`, `contact_name`, `email_from` and `phone`
   - a description listing the division, solicitation number, due date, description, line items, quantities, destination, delivery date and instructions
3. It downloads each attachment from Netlify and stores it as an `ir.attachment` on the lead. Netlify's file links expire, so the files are copied at once.

## Switching it on

1. **Create an integration user in Odoo.** Give it CRM user rights.
2. **Generate an API key for that user.** In Odoo, open the user's **Preferences → Account Security → New API Key**.
3. **Add the settings.** In Netlify, open **Site configuration → Environment variables** and add:

| Variable | Example |
| --- | --- |
| `ODOO_ENABLED` | `true` |
| `ODOO_URL` | `https://erp.exronglobal.com` |
| `ODOO_DB` | the database name |
| `ODOO_USER` | the integration user's login |
| `ODOO_API_KEY` | the API key from step 2 |

4. **Redeploy the site.** Netlify does not pick up the new variables until the next deploy.
5. **Test it.** Send a test RFQ, then confirm that the lead and its attachments appear in the CRM pipeline.

The email adapter keeps running alongside Odoo. To stop the emails later, remove `emailAdapter` from `activeAdapters()`.

## Notes for the Odoo implementation

- **Odoo versions.** The JSON-RPC external API works on Odoo 14 to 18.
  - Odoo 19 adds a newer JSON-2 API.
  - If your platform runs Odoo 19 or later, update `rpc()` in `odooAdapter.ts` to that API.
  - The rest of the adapter stays the same.
- **Custom fields.** If the platform adds its own lead fields (for example a solicitation number field or a division tag), map them in `leadValues()`.
- **Odoo website forms.** If the public site will later post RFQs to Odoo's own website forms instead, keep Netlify Forms as the intake. That keeps the spam protection and the acknowledgment email.
