---
# GOVERNMENT CONTRACTING. Edit text here; layout lives in src/legacy/pages/GovernmentContracting.astro.
# Accuracy rule: never show a registration number, certification or contract vehicle until it has been
# officially issued and verified. SAM.gov and CAGE/NCAGE show "Registration in process" until then.

seoTitle: "Government Contracting Information | Exron Global"
seoDescription: "Vendor information for contracting officers: registration status, NAICS codes, capability statement, how we respond to solicitations and procurement contact."

hero:
  eyebrow: "Government Contracting"
  title: "Information for contracting officers"
  lead: "Our registration status, capability statement, how we respond to solicitations, what we can supply and who to contact. Everything a contracting officer needs for the vendor file, on one page."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Contact procurement", href: "/contact/" }

statement:
  title: "Capability statement"
  text: "One page with our supply categories, coverage, registration status and contact details, for your vendor file."
  # When the approved PDF is ready: put it in public/documents/ and set file, e.g. "/documents/exron-capability-statement.pdf"
  file: ""
  updated: ""
  pending: "Our approved capability statement is being finalized. Request a copy and we will email it to you."
  requestSubject: "Capability statement request"

identity:
  title: "Company details"
  rows:
    - { k: "Legal name", v: "Exron Global General Trading LLC" }
    - { k: "Business type", v: "Privately owned company" }
    - { k: "Headquarters", v: "{headquarters}" }
    - { k: "Business registration", v: "[CLIENT TO PROVIDE: trade license or registration number and issuing authority]" }

registrations:
  eyebrow: "Registration status"
  heading: "U.S. Government registrations"
  lead: "Numbers appear here only once they have been officially issued and verified. Until then, the status shows where each registration stands."
  # status: active | in-process | pending | to-confirm. Add the number to value once issued.
  items:
    - { name: "SAM.gov", about: "System for Award Management entity registration", status: "in-process", value: "" }
    - { name: "UEI", about: "Unique Entity ID, assigned through SAM.gov", status: "pending", value: "" }
    - { name: "CAGE / NCAGE", about: "Commercial and Government Entity code", status: "in-process", value: "" }
    - { name: "NAICS codes", about: "Industry classification codes", status: "to-confirm", value: "" }
  statusLabels:
    active: "Active"
    in-process: "Registration in process"
    pending: "Issued after SAM.gov registration"
    to-confirm: "To be confirmed"
  checked: "[CLIENT TO PROVIDE: date this status was last confirmed]"

solicitations:
  eyebrow: "Responding to solicitations"
  heading: "How we respond to an RFQ or solicitation"
  lead: "What a contracting officer can expect from the moment a solicitation reaches us."
  steps:
    - { title: "Acknowledge and log", text: "The RFQ is given a reference number and acknowledged. We confirm the response deadline and delivery destination." }
    - { title: "Read the whole solicitation", text: "Specifications, quantities, delivery terms, required forms, clauses and submission instructions." }
    - { title: "Raise questions early", text: "Anything unclear is raised before the question deadline, not after award." }
    - { title: "Source to specification", text: "Exact items from manufacturers and authorized distributors, or clearly identified equals with data sheets." }
    - { title: "Quote in the required format", text: "Itemized unit prices, lead times and validity, submitted by the deadline in the format requested." }
    - { title: "Execute on award", text: "Supplier orders placed, production and dispatch confirmed, freight and customs coordinated." }
    - { title: "Deliver to receiving rules", text: "Deliveries scheduled to the installation's access and receiving requirements, with packing lists and proof of delivery." }
    - { title: "Close out", text: "Discrepancies, replacements and warranty questions handled by the same named contact." }

supply:
  eyebrow: "What we can supply"
  heading: "Supply categories"
  lead: "Mixed requirements across these categories can be quoted in a single response."
  link: { label: "View full capabilities", href: "/capabilities/" }
  items:
    - { label: "General supplies & commodities", href: "/capabilities/#general-supplies" }
    - { label: "Industrial equipment, tools & machinery", href: "/capabilities/#industrial-equipment" }
    - { label: "Electrical, mechanical & maintenance supplies", href: "/capabilities/#electrical-mechanical" }
    - { label: "Building materials & facility maintenance", href: "/capabilities/#building-materials" }
    - { label: "HVAC, plumbing & infrastructure equipment", href: "/capabilities/#hvac-plumbing" }
    - { label: "IT hardware, networking & office technology", href: "/capabilities/#it-networking" }
    - { label: "Safety equipment & PPE", href: "/capabilities/#safety-ppe" }
    - { label: "Office furniture & operational supplies", href: "/capabilities/#furniture" }
    - { label: "Specialized equipment sourcing", href: "/capabilities/#specialized" }
    - { label: "Logistics, freight & customs coordination", href: "/capabilities/#logistics" }

coverage:
  eyebrow: "Coverage"
  heading: "Geographic and operational coverage"
  rows:
    - { k: "Primary market", v: "Middle East" }
    - { k: "Other markets", v: "International requirements where we can perform reliably" }
    - { k: "Delivery destinations", v: "[CLIENT TO PROVIDE: countries or regions]" }
    - { k: "Sourcing", v: "[CLIENT TO PROVIDE: main sourcing countries or regions]" }

contact:
  title: "Procurement contact"
  rows:
    - { k: "RFQs & solicitations", v: "{procurementEmail}" }
    - { k: "General email", v: "{email}" }
    - { k: "Phone", v: "{phone}" }
    - { k: "Business hours", v: "{hours}" }
    - { k: "Named contact", v: "[CLIENT TO PROVIDE: name and title]" }

transparency:
  heading: "Transparency statement"
  items:
    - "Exron Global General Trading LLC is a privately owned company. It is not a government agency and is not affiliated with or endorsed by the U.S. Government."
    - "The experience described on this website was gained by members of our management team in previous roles, including at Expedition Trading & Services. Contracts and past performance of that company are not represented as those of Exron Global."
    - "We do not publish registration numbers, certifications or contract vehicles until they have been officially issued and verified."

security: "Do not send classified information, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission."

cta:
  heading: "Have an open solicitation?"
  text: "Send the RFQ number, item list and documents. Every request is acknowledged and answered with an itemized quotation."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Contact procurement", href: "/contact/" }
---
