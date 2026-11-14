# Hosting the website on Namecheap (cPanel), with no other services

The site can run entirely on a Namecheap shared hosting plan, using only the hosting account and the domain.

| What | How it works on Namecheap |
| --- | --- |
| Web pages | Static files in `public_html` |
| RFQ and contact forms | PHP scripts in `public_html/forms/` |
| Emails | Sent through the hosting account's own mail server, from your own mailbox |
| Spam protection | A hidden trap field, a check that the form wasn't filled in within seconds, and a limit of 10 submissions an hour per visitor. No Google reCAPTCHA. |
| Copy of every RFQ | Saved privately with its documents in `/home/<account>/exron-submissions`, outside the public website |
| HTTPS and security headers | The `.htaccess` file, plus Namecheap's free SSL certificate |

**Not available on this hosting:**
- **Preview links:** changes go live when you upload them.
- **The `/admin` content manager:** text is changed in the files and the site is rebuilt.

## 1. Build the package

On a computer with Node.js 22:

```bash
npm install
npm run build:cpanel
```

This creates `release/exron-website-cpanel.zip`, which contains:
- the website;
- `forms/` (the PHP handlers, settings and company details);
- the `.htaccess` files.

## 2. Prepare the hosting (one time)

1. **Domain:** point `exronglobal.com` at the hosting.
   - If both are with Namecheap: **Domain List → Manage → Nameservers → Namecheap Web Hosting DNS**.
2. **SSL:** in cPanel → **SSL/TLS Status**, run AutoSSL so `https://` works.
3. **Mailbox:** in cPanel → **Email Accounts**, create `rfq@exronglobal.com`. The website sends from it, and replies to it land there.
   - Create the inbox that should receive RFQs too, for example `procurement@exronglobal.com`, or forward `rfq@` to the right people.
4. **Mail authentication:** in cPanel → **Email Deliverability**, make sure SPF and DKIM show as valid for exronglobal.com. Click **Repair** if not. This keeps the emails out of spam folders.
5. **PHP version:** in cPanel → **Select PHP Version** (or **MultiPHP Manager**), choose PHP 8.1 or newer.

## 3. Upload

1. In cPanel → **File Manager**, open `public_html`.
2. Delete any old placeholder files (such as Namecheap's default `index.html`).
3. Click **Upload** and upload `exron-website-cpanel.zip`.
4. Right-click the zip, choose **Extract** into `public_html`, then delete the zip.
5. In **Settings**, tick **Show Hidden Files**, and check that `.htaccess` is present in `public_html`.

## 4. Settings: `public_html/forms/config.php`

| Setting | What it does |
| --- | --- |
| `from_email` | The mailbox the site sends from (step 2.3). |
| `rfq_inbox`, `contact_inbox` | Who receives submissions, for example `['procurement@exronglobal.com']`. If left empty, the procurement email in the site's company details is used, then `info@exronglobal.com`. |
| `save_copies` | Keeps private copies. On by default. |
| `rate_limit_per_hour`, `max_total_bytes` | Spam and upload limits. |

Company details used in the emails (procurement email, acknowledgment time, disclaimer) come from `forms/site.json`, which is generated from the website's data at build time.

## 5. Test after every upload (5 minutes)

1. Open `https://exronglobal.com/submit-rfq/`.
2. Submit a test RFQ using your own email, with a PDF and an Excel file attached.
3. Check that:
   - the confirmation page shows an `EXR-RFQ-…` reference;
   - the procurement inbox receives the RFQ with both files attached;
   - your inbox receives the acknowledgment;
   - in File Manager, `/home/<account>/exron-submissions/<year-month>/<reference>/` holds the copy.
4. Send a message through the form on `https://exronglobal.com/contact/`.

**If an email doesn't arrive:** check the spam folder, then cPanel → **Track Delivery** and **Email Deliverability**. Errors are also written to `forms/error_log` (reference numbers only, never form contents).

## Updating the site later

Change the text, run `npm run build:cpanel` again and upload the new zip as in step 3.

Before extracting the new zip, keep a copy of your edited `forms/config.php`, then put it back afterwards. The saved RFQ copies are outside `public_html`, so they are never touched by an upload.
