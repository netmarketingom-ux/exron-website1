# Website ownership and handover

Recommendation for giving Exron Global full ownership and administrative control of the website, the hosting, submitted RFQs and customer attachments.

## Recommended arrangement

Every account that holds the website, its data or its email should belong to Exron Global, created with an Exron company email address (for example it@exronglobal.com, not a personal address). The developer is then invited as a team member with limited rights, and can be removed at any time.

| What | Service | Recommended owner | Developer access |
|---|---|---|---|
| Domain name (exronglobal.com) | Your domain registrar | Exron | None needed |
| Website hosting, RFQ submissions and attachments | Netlify | Exron Netlify team (free or Pro plan) | Developer role |
| Website source code | GitHub | Exron GitHub organization | Write access to the repository |
| RFQ notification and acknowledgment emails | Resend | Exron account | None needed after setup |
| Procurement mailbox | Your email provider | Exron | None |

## Steps

1. **Exron creates its own accounts** with a company email: a Netlify team, a GitHub organization and a Resend account. Each is free to start.
2. **Exron invites the developer** to the Netlify team and GitHub organization.
3. **The developer transfers the site and code.** Netlify can move an existing site to another team from the site settings; the website and its address stay the same. GitHub can transfer the repository to the Exron organization.
4. **Email sending is set up under Exron's Resend account.** Exron adds the Resend sending records to the exronglobal.com domain, so notifications are sent from an exronglobal.com address. The Resend key and procurement inbox are entered in Exron's Netlify settings.
5. **The domain is connected.** exronglobal.com is pointed to the Netlify site. HTTPS is issued automatically, and search-engine indexing switches on automatically.
6. **Live RFQ test.** One real RFQ is submitted on the live site. Exron confirms that both emails arrived: the internal procurement notification (with attachments) and the customer acknowledgment.
7. **Access review.** Exron confirms who keeps access. The developer's access can be reduced or removed after launch.

## Data, access, retention and backups

- **Where RFQs are stored:** in the Netlify team's form submissions, with attachments, and in the procurement mailbox (each notification includes the files).
- **Authorized access:** only members of the Exron Netlify team and users of the procurement mailbox. Exron decides who these are.
- **Retention:** Netlify keeps submissions until they are deleted. Exron should set a retention period (for example 12 or 24 months), which is then stated in the Privacy Policy, and delete older submissions on that schedule.
- **Backups:** the website itself is fully backed up in GitHub and every previous version can be restored on Netlify in one click. RFQ submissions should be exported from Netlify periodically (CSV export) and kept with Exron's business records. The procurement mailbox is a second copy of every RFQ.
- **Security:** two-factor authentication should be required on the Netlify, GitHub, Resend and email accounts. Shared passwords should not be used; each person has their own login.

## Optional: business platform integration

The website is prepared to send RFQs to Odoo as well as by email, if Exron adopts Odoo later. This can be switched on without changing the website.
