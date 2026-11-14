---
# HOME PAGE (final design, per client reply of November 2026).
# Six sections: introduction, company overview, capabilities, competitive strengths,
# coverage and group affiliation, RFQ submission. Each section says something different;
# detail lives on the inner pages it links to.
# {tokens} such as {headquarters} are filled from src/legacy/data/site.json.
# Accuracy rule: never state contracts, certifications, registrations or relationships that are not verified.

seoTitle: "Government & Military Procurement Specialists | Exron Global"
seoDescription: "Exron Global sources, supplies and delivers for U.S. Government operations, military installations and defense support contractors. Submit an RFQ."

# 01 Introduction ------------------------------------------------------------
hero:
  kicker: "Exron Global"
  heading: ["Mission-Driven Procurement.", "Global Sourcing.", "Reliable Delivery."]
  positioning: "Government & Military Installation Support Procurement Specialists"
  text: "Sourcing, supply and logistics coordination for U.S. Government operations, military installations and defense support contractors."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Government Contracting", href: "/government-contracting/" }
  quick:
    label: "RFQ Desk"
    heading: "Start an RFQ"
    text: "Four details now. The full form opens with them filled in, ready for line items and documents."
    note: "Every RFQ is acknowledged {rfqAcknowledgment}, with a reference number and a named contact."
    button: "Continue to the full RFQ"
  figures:
    - { value: "{categories}", label: "Supply categories quoted in one response" }
    - { value: "Middle East", label: "Primary market, with international coverage" }
    - { value: "1", label: "Named contact per RFQ, from quote to delivery" }

# 02 Company overview ---------------------------------------------------------
overview:
  eyebrow: "02 · Company overview"
  heading: "A procurement partner for installation requirements"
  paragraphs:
    - "Exron Global General Trading LLC is a privately owned procurement and supply company. We source and deliver what government operations and military installations order, from RFQ to proof of delivery."
  link: { label: "About Exron", href: "/about/" }
  profile:
    title: "Company profile"
    rows:
      - { k: "Legal name", v: "Exron Global General Trading LLC" }
      - { k: "Headquarters", v: "{headquarters}" }
      - { k: "Focus", v: "Government & military installation support" }
      - { k: "SAM.gov / CAGE", v: "Registration in process" }
    link: { label: "Vendor information", href: "/government-contracting/" }

# 03 Capabilities --------------------------------------------------------------
capabilities:
  eyebrow: "03 · Capabilities"
  heading: "What we supply"
  lead: "Mixed requirements quoted together in one itemized response."
  items:
    - { icon: "package", title: "General supplies & commodities", link: { label: "Details", href: "/capabilities/#general-supplies" } }
    - { icon: "wrench", title: "Equipment, tools & machinery", link: { label: "Details", href: "/capabilities/#industrial-equipment" } }
    - { icon: "wind", title: "Electrical, HVAC & infrastructure", link: { label: "Details", href: "/capabilities/#hvac-plumbing" } }
    - { icon: "brick", title: "Building materials & facility maintenance", link: { label: "Details", href: "/capabilities/#building-materials" } }
    - { icon: "monitor", title: "IT hardware & networking", link: { label: "Details", href: "/capabilities/#it-networking" } }
    - { icon: "hardhat", title: "Safety equipment & PPE", link: { label: "Details", href: "/capabilities/#safety-ppe" } }
  link: { label: "View all capabilities", href: "/capabilities/" }

# 04 Competitive strengths -------------------------------------------------------
strengths:
  eyebrow: "04 · Competitive strengths"
  heading: "Why contracting officers work with us"
  items:
    - title: "Management experience"
      text: "Our managers bring [CLIENT TO PROVIDE: number] years of procurement and U.S. military installation support in the Middle East."
    - title: "Diverse requirements, one quotation"
      text: "From general supplies to hard-to-find items, quoted together to the specification."
    - title: "Logistics coordination"
      text: "Freight, customs clearance and delivery to the installation's receiving rules."
    - title: "Accuracy and accountability"
      text: "A reference number, a named contact and a quotation that matches the specification."
  notice: "Management experience was gained in previous roles, including at Expedition Trading & Services. That company's contracts and past performance are not represented as Exron Global's."

# 05 Geographic coverage & group affiliation -----------------------------------
coverage:
  eyebrow: "05 · Coverage & group affiliation"
  heading: "Middle East operations. International supply."
  text: "Our primary market is the Middle East, where our management team has supported installation requirements. We source internationally and take on requirements in other markets where we can perform reliably."
  rows:
    - { k: "Primary market", v: "Middle East" }
    - { k: "Other markets", v: "International, where we can perform reliably" }
    - { k: "Sourcing", v: "[CLIENT TO PROVIDE: main sourcing countries or regions]" }
  markers:
    - { label: "Middle East", lon: 47, lat: 26, primary: true }
  group:
    label: "Group affiliation"
    heading: "Part of {groupName}"
    text: "Exron Global is affiliated with {groupName}, whose companies work in [CLIENT TO PROVIDE: sectors, e.g. engineering, infrastructure, energy, construction]. The group adds market knowledge, supplier relationships and commercial backing."
    notice: "Each group company is a separate legal entity. Exron Global does not present their contracts or capabilities as its own."
    link: { label: "About the group", href: "/about/#group" }
    # Shown only once management approves: logo file in public/images/, and the group's website address.
    logo: ""
    website: ""

# 06 RFQ submission ---------------------------------------------------------------
rfq:
  eyebrow: "06 · Submit an RFQ"
  heading: "Have an open solicitation?"
  text: "Send the RFQ number, item list and documents in one submission. It goes straight to our procurement team, is acknowledged with a reference number, and is answered with an itemized quotation."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Contact procurement", href: "/contact/" }
  checklistTitle: "Have these ready"
  checklist:
    - "RFQ or solicitation number, if you have one"
    - "Line items and quantities"
    - "Delivery destination and required date"
    - "Specifications or documents (PDF, Word, Excel, CSV or images, up to 8 MB)"
  security: "Do not send classified information, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission."
---
