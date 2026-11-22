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
    - { label: "Contact Us", href: "/contact/" }

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
  lead: "Registration numbers and statuses are published here only once they have been officially confirmed."
  # status: active | in-process | to-confirm. Change a status, or add a number to value, ONLY once officially confirmed by Exron management.
  # UEI assignment, active SAM.gov registration and CAGE/NCAGE are separate items with separate statuses.
  items:
    - { name: "UEI", about: "Unique Entity ID, assigned through SAM.gov. An entity can be assigned a UEI without completing full registration.", status: "to-confirm", value: "" }
    - { name: "SAM.gov registration", about: "Active entity registration in the System for Award Management", status: "to-confirm", value: "" }
    - { name: "CAGE / NCAGE", about: "Commercial and Government Entity code (NCAGE for entities outside the United States)", status: "to-confirm", value: "" }
    - { name: "NAICS codes", about: "Industry classification codes", status: "to-confirm", value: "" }
  statusLabels:
    active: "Active"
    in-process: "In process"
    to-confirm: "To be confirmed"
  checked: "[CLIENT TO PROVIDE: date this status was last confirmed]"

solicitations:
  eyebrow: "Responding to solicitations"
  heading: "How we respond to an RFQ or solicitation"
  lead: "What a contracting officer can expect from the moment a solicitation reaches us."
  steps:
    - { title: "Log the request", text: "The RFQ is given a reference number. We confirm the response deadline and delivery destination." }
    - { title: "Read the whole solicitation", text: "Specifications, quantities, delivery terms, required forms, clauses and submission instructions." }
    - { title: "Raise questions early", text: "Anything unclear is raised before the question deadline, not after award." }
    - { title: "Source to specification", text: "Exact items from manufacturers and authorized distributors, or clearly identified equals with data sheets." }
    - { title: "Quote in the required format", text: "Itemized unit prices, lead times and validity, submitted by the deadline in the format requested." }
    - { title: "Execute on award", text: "Supplier orders placed, production and dispatch confirmed, freight and customs coordinated." }
    - { title: "Deliver to receiving rules", text: "Deliveries scheduled to the installation's access and receiving requirements, with packing lists and proof of delivery." }
    - { title: "Close out", text: "Discrepancies, replacements and warranty questions handled by our procurement team." }

supply:
  eyebrow: "What we can supply"
  heading: "Supply categories"
  lead: "Our nine product and sourcing categories. Freight, logistics, customs clearance and delivery coordination are provided as supporting operational services."
  link: { label: "View All Capabilities", href: "/capabilities/" }
  items:
    - { label: "General supplies & commodities", href: "/capabilities/#general-supplies" }
    - { label: "Industrial equipment, tools & machinery", href: "/capabilities/#industrial-equipment" }
    - { label: "Electrical, mechanical & maintenance supplies", href: "/capabilities/#electrical-mechanical" }
    - { label: "Building materials & facility maintenance", href: "/capabilities/#building-materials" }
    - { label: "HVAC, plumbing & infrastructure equipment", href: "/capabilities/#hvac-plumbing" }
    - { label: "IT hardware, networking & office technology", href: "/capabilities/#it-networking" }
    - { label: "Safety equipment & PPE", href: "/capabilities/#safety-ppe" }
    - { label: "Office furniture, equipment & operational supplies", href: "/capabilities/#furniture" }
    - { label: "Specialized equipment & hard-to-find items", href: "/capabilities/#specialized" }

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
  text: "Send the RFQ number, item list and documents. Each request receives a reference number and is reviewed by our procurement team."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Contact Us", href: "/contact/" }
---
