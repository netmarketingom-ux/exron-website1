---
# CONTACT. Edit text here; layout lives in src/legacy/pages/Contact.astro.
# Contact details themselves are in src/legacy/data/site.json.

seoTitle: "Contact Exron Global | Procurement Team"
seoDescription: "Contact Exron Global's procurement team by email, phone or WhatsApp, or send a general inquiry. To request a quotation, submit an RFQ."

hero:
  eyebrow: "Contact"
  title: "Contact our procurement team"
  lead: "For a quotation, use the RFQ form so your solicitation number, line items and documents reach procurement together. For anything else, write to us or call."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }

routes:
  - { icon: "file", title: "Request a quotation", text: "Solicitations, item lists and specifications. Logged with a reference number.", link: { label: "Submit an RFQ", href: "/submit-rfq/" } }
  - { icon: "mail", title: "General inquiries", text: "Questions about Exron Global, partnerships or supplier registration.", link: { label: "Use the form below", href: "#inquiry" } }
  - { icon: "phone", title: "Urgent requirements", text: "Call or message us, then send the details through the RFQ form.", link: { label: "Phone and WhatsApp", href: "#contact-details" } }

details:
  title: "Contact details"
  rows:
    - { k: "RFQs & procurement", v: "{procurementEmail}" }
    - { k: "General email", v: "{email}" }
    - { k: "Phone", v: "{phone}" }
    - { k: "WhatsApp", v: "{whatsapp}" }
    - { k: "Office", v: "{address}" }
    - { k: "Business hours", v: "{hours}" }

form:
  eyebrow: "General inquiry"
  heading: "Send us a message"
  text: "We reply by email. For quotations, the RFQ form is faster: it captures everything procurement needs in one submission."

security: "Do not send classified information, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission."
---
