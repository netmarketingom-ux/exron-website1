---
# HOME PAGE — v2, rewritten per client feedback (30 Oct 2026).
# Section order follows feedback §13. Edit text here; layout lives in src/pages/index.astro.
# {tokens} such as {headquarters} are filled from src/data/site.json.
# [CLIENT TO PROVIDE: ...] is highlighted on the site until replaced with verified information.
# Accuracy rule: never state contracts, certifications, registrations or relationships that are not verified.

seoTitle: "Government & Military Procurement Specialists | Exron Global"
seoDescription: "Exron Global sources, supplies and delivers for U.S. Government operations, military installations and defense support contractors. Submit an RFQ."

# 1. Opening banner ----------------------------------------------------------
hero:
  kicker: "Exron Global"
  heading: "Government & Military Installation Support Procurement Specialists"
  text: "Exron Global specializes in strategic sourcing, procurement, supply and logistics coordination for U.S. Government operations, military installations, defense support contractors and institutional customers, while also serving commercial and industrial organizations."
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Government Contracting Information", href: "/government-contracting/" }
  panel:
    label: "RFQ Desk"
    heading: "Send us your requirement"
    items:
      - "RFQ or solicitation reference number"
      - "Item or service description and quantities"
      - "Delivery destination and required date"
      - "Specifications and supporting documents (PDF, Excel, Word)"
    note: "Every RFQ is acknowledged on receipt."
    button: { label: "Start an RFQ", href: "/submit-rfq/" }

# Answers the four questions from feedback §2 within the first screen
glance:
  - { q: "Who we are", a: "A procurement and supply company focused on government and military installation support.", href: "#about" }
  - { q: "What we provide", a: "Supplies, equipment, materials and logistics coordination across 11 procurement categories.", href: "#capabilities" }
  - { q: "Why consider us", a: "Management experience supporting U.S. military installation requirements across the Middle East.", href: "#experience" }
  - { q: "How to engage", a: "Submit an RFQ with your solicitation reference, specifications and delivery requirements.", href: "#rfq" }

# 2. Introduction ------------------------------------------------------------
intro:
  eyebrow: "About Exron Global"
  heading: "Procurement, supply and logistics coordination, managed from RFQ to delivery"
  paragraphs:
    - "Exron Global General Trading LLC sources and supplies the equipment, materials and commodities that government operations, military installations and their support contractors depend on."
    - "We take responsibility for the full requirement: reviewing the solicitation, identifying qualified suppliers, confirming technical compliance, preparing an accurate quotation, executing the purchase order, and coordinating freight, customs clearance and delivery."
  link: { label: "About Exron", href: "/about/" }
  profile:
    title: "Company profile"
    rows:
      - { k: "Legal name", v: "Exron Global General Trading LLC" }
      - { k: "Headquarters", v: "{headquarters}" }
      - { k: "Primary division", v: "Government & Military Installation Support" }
      - { k: "Second division", v: "Commercial & Industrial Procurement" }
      - { k: "Operating region", v: "Middle East and international markets" }
      - { k: "RFQ contact", v: "{procurementEmail}" }

# 3. Government & military installation support (primary focus) ------------
government:
  eyebrow: "Division One · Primary Focus"
  heading: "Government & Military Installation Support"
  lead: "Our principal division provides procurement, sourcing, supply, logistics coordination and operational support for U.S. Government and military installation requirements, particularly throughout the Middle East and in other international markets where we have the operational ability to perform."
  audienceTitle: "Who we support"
  audience:
    - "Contracting officers"
    - "Purchasing and procurement departments"
    - "Military installation support operations"
    - "Prime contractors and defense support contractors"
  practicesTitle: "Built around how installation procurement works"
  practices:
    - { icon: "clipboard", title: "Solicitation compliance", text: "Quotations are prepared against the solicitation: specifications, quantities, delivery terms, required dates and submission deadlines." }
    - { icon: "target", title: "Technical accuracy", text: "Offered items are checked against the stated specification. Any proposed alternate is identified clearly and supplied only with written approval." }
    - { icon: "file-check", title: "Documentation", text: "Itemized quotations, commercial invoices, packing lists and delivery records, prepared to the requirements stated in the order." }
    - { icon: "clock", title: "Delivery schedules", text: "Lead times are confirmed with suppliers before we quote, and shipments are tracked through to delivery at the installation or designated site." }
  vendor:
    title: "Vendor information"
    rows:
      - { k: "SAM.gov", v: "Registration in process" }
      - { k: "CAGE / NCAGE", v: "Registration in process" }
      - { k: "NAICS", v: "{naics}" }
    note: "Registration details are published only after they have been officially issued and verified."
    link: { label: "Government Contracting", href: "/government-contracting/" }

# 4. Core procurement capabilities + process ---------------------------------
capabilities:
  eyebrow: "Core Procurement Capabilities"
  heading: "What we source and supply"
  lead: "A requirement can be a single line item or span several categories. Either way, it is quoted, ordered and delivered as one coordinated package."
  items:
    - { icon: "package", title: "General Supplies & Commodities", text: "Consumables, janitorial and day-to-day operational supplies." }
    - { icon: "wrench", title: "Industrial Equipment, Tools & Machinery", text: "Hand and power tools, workshop equipment and machinery." }
    - { icon: "zap", title: "Electrical, Mechanical & Maintenance Supplies", text: "Cable, switchgear, fittings, bearings and MRO spares." }
    - { icon: "brick", title: "Building Materials & Facility Maintenance", text: "Construction materials and products for facility repair and upkeep." }
    - { icon: "wind", title: "HVAC, Plumbing & Infrastructure Equipment", text: "Air-conditioning units, pumps, pipe, valves and infrastructure components." }
    - { icon: "monitor", title: "IT Hardware, Networking & Office Technology", text: "Computers, servers, network equipment, printers and peripherals." }
    - { icon: "hardhat", title: "Safety Equipment & PPE", text: "Protective clothing, head, eye, hearing and hand protection, and site safety equipment." }
    - { icon: "sofa", title: "Office Furniture, Equipment & Operational Supplies", text: "Furniture, office equipment and administrative supplies." }
    - { icon: "search", title: "Specialized Equipment Sourcing", text: "Brand-specific, hard-to-find or specification-driven items." }
    - { icon: "truck", title: "Logistics, Freight & Customs Coordination", text: "Freight forwarding, customs clearance coordination and delivery support." }
    - { icon: "plus", title: "Other Authorized Requirements", text: "Further requirements within our operational capabilities. Send the specification to confirm." }
  link: { label: "View all capabilities", href: "/capabilities/" }
  processTitle: "How a requirement moves through Exron Global"
  process:
    - { title: "RFQ acknowledgment & processing", text: "Receipt confirmed; requirement logged and checked for completeness." }
    - { title: "Supplier identification & quotation evaluation", text: "Qualified sources identified; offers compared on price, lead time and origin." }
    - { title: "Technical specification compliance", text: "Each offered item verified against the stated requirement." }
    - { title: "Competitive pricing & proposal preparation", text: "Itemized quotation submitted by the solicitation deadline." }
    - { title: "Purchase order execution", text: "Orders placed, confirmed and expedited with suppliers." }
    - { title: "Freight & customs coordination", text: "Forwarding and customs clearance arranged to destination." }
    - { title: "Delivery scheduling & documentation", text: "Delivery booked with the receiving site; records issued." }
    - { title: "Communication & after-sales support", text: "Status updates throughout; follow-up after delivery." }

# 5. Management experience ----------------------------------------------------
experience:
  eyebrow: "Management Experience"
  heading: "Leadership with a background in U.S. military installation support"
  paragraphs:
    - "Exron Global's management brings extensive experience in procurement, sourcing, trading, logistics coordination and supporting U.S. military installation requirements through previous business operations."
    - "This includes work through Expedition Trading & Services, which supported U.S. military installations and government-related requirements across the Middle East. That experience informs how Exron Global prepares quotations, coordinates suppliers and plans delivery to installations."
  areas:
    - "Procurement & strategic sourcing"
    - "Trading & supplier coordination"
    - "Logistics coordination"
    - "Military installation requirements in the Middle East"
  team: "[CLIENT TO PROVIDE: management names, titles and years of experience, if approved for publication]"
  notice: "The experience described here was gained by members of Exron Global's management through previous business operations, including Expedition Trading & Services. Contracts performed by those businesses are not presented as contracts performed by Exron Global General Trading LLC."
  image: { label: "Exron Global management team (real photograph)", alt: "Exron Global management team" }

# 6. Why consider Exron Global -----------------------------------------------
why:
  eyebrow: "Why Exron Global"
  heading: "Why consider Exron Global"
  lead: "What a contracting officer or procurement manager can expect when they send us a requirement."
  items:
    - { title: "Experienced management", text: "Procurement and operations leadership with prior experience supporting U.S. military installation requirements in the Middle East." }
    - { title: "Knowledge of installation procurement", text: "We work to the solicitation's terms: specifications, quantities, delivery destinations and deadlines." }
    - { title: "International sourcing", text: "Suppliers identified across multiple countries to meet specification, price and lead time." }
    - { title: "Flexible across categories", text: "General supplies, equipment, IT and PPE can be combined in one RFQ and quoted as one package." }
    - { title: "Responsive RFQ management", text: "Every RFQ is acknowledged, tracked and answered. Questions on the requirement are raised early, not after award." }
    - { title: "Logistics and delivery coordination", text: "Freight forwarding, customs clearance coordination and delivery scheduling handled for you." }
    - { title: "Quality-focused supplier selection", text: "Suppliers assessed on specification compliance, reliability and documentation before we quote." }
    - { title: "Commercially competitive sourcing", text: "Multiple supplier offers compared so the price we submit is competitive and sustainable." }
    - { title: "Accuracy and accountability", text: "Quotations checked line by line, with one named point of contact responsible for each requirement." }
    - { title: "Affiliated business network", text: "Access to commercial and industry expertise across our group of affiliated businesses." }

# 7. International sourcing & coverage ---------------------------------------
coverage:
  eyebrow: "International Sourcing & Coverage"
  heading: "Middle East operations. International supply."
  text: "Our primary area of operations is the Middle East, where our management has supported U.S. military installation requirements. We source internationally, selecting suppliers by specification, price, lead time and origin, and coordinate freight forwarding and customs clearance to the point of delivery."
  rows:
    - { k: "Primary operations", v: "Middle East" }
    - { k: "Customer regions", v: "North America · Middle East · Asia · Europe" }
    - { k: "Sourcing", v: "[CLIENT TO PROVIDE: main sourcing countries or regions]" }
    - { k: "Logistics", v: "Freight forwarding and customs clearance coordination" }
  markers:
    - { label: "Middle East", lon: 47, lat: 26, primary: true }
    - { label: "Europe", lon: 10, lat: 50 }
    - { label: "North America", lon: -100, lat: 41 }
    - { label: "Asia", lon: 104, lat: 33 }

# 8. Commercial & industrial division ----------------------------------------
commercial:
  eyebrow: "Division Two"
  heading: "Commercial & Industrial Procurement"
  text: "Our second division provides procurement and sourcing for affiliated companies, construction and infrastructure projects, industrial operations and external commercial customers. It runs on the same RFQ discipline, supplier evaluation and delivery coordination as our government work."
  items:
    - { icon: "building", text: "Affiliated companies" }
    - { icon: "hardhat", text: "Construction & infrastructure projects" }
    - { icon: "wrench", text: "Industrial operations" }
    - { icon: "globe", text: "External commercial customers" }
  link: { label: "Industries We Serve", href: "/industries/" }
  image: { label: "Construction / industrial project site (real photograph)", alt: "Materials delivered to an industrial project site – commercial and industrial procurement" }

# 9. Group affiliation --------------------------------------------------------
group:
  eyebrow: "Group Affiliation"
  heading: "Backed by a broader business network"
  text: "Exron Global is associated with {groupName} and its affiliated businesses, whose activities include engineering, infrastructure, energy and construction. This network gives Exron additional commercial strength, industry knowledge and operational support."
  sectors:
    - { icon: "layers", title: "Engineering" }
    - { icon: "building", title: "Infrastructure" }
    - { icon: "zap", title: "Energy" }
    - { icon: "hardhat", title: "Construction" }
  notice: "Affiliated companies are separate legal entities. Their resources and capabilities are presented as Exron Global's only where they are available to Exron under an established arrangement."

# 10. RFQ call to action ------------------------------------------------------
rfq:
  eyebrow: "Submit an RFQ"
  heading: "Have a requirement? Send us the RFQ."
  text: "Submit your solicitation or requirement with specifications and supporting documents. Every submission is acknowledged on receipt and reviewed by our procurement team, who will raise any questions before quoting."
  checklistTitle: "Your RFQ can include"
  checklist:
    - "Company or government organization name"
    - "Contact person and official email address"
    - "RFQ or solicitation reference number"
    - "Product or service description"
    - "Required quantities"
    - "Delivery destination"
    - "Requested delivery date"
    - "Technical specifications and supporting documents"
    - "Additional instructions or special requirements"
  buttons:
    - { label: "Submit an RFQ", href: "/submit-rfq/" }
    - { label: "Contact the procurement team", href: "/contact/" }
  security: "Do not send classified information, Controlled Unclassified Information (CUI) or other controlled data through this website. If your requirement includes sensitive or controlled information, contact us first so it can be transmitted through an approved secure channel."
---
