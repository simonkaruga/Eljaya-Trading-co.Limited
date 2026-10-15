/**
 * Built-in content (migrated from the original static site).
 *
 * Used when Sanity isn't connected yet, and imported into Sanity by
 * `npm run seed`. Once Sanity is connected, the owner edits everything
 * in /studio and this file is no longer read.
 *
 * Keep imports relative with `.ts` extensions — the seed script runs this
 * file directly with Node's type stripping.
 */
import { md } from './md.ts';
import type {
  About, Faq, Home, Img, Industry, LegalPage, Pack, Post, Project, Service, Settings, Testimonial,
} from './types.ts';

const img = (file: string, alt: string, w: number, h: number): Img => ({ src: `/images/${file}`, alt, w, h });

const I = {
  hero: img('eljaya-hero.webp', 'Eljaya branded merchandise: polo shirts, jute bags, notebooks and gift boxes', 1536, 1024),
  polo: img('polo-tshirts.webp', 'Custom branded corporate polo shirts', 1000, 1000),
  bottles: img('bottles.webp', 'Custom branded water bottles and flasks', 700, 700),
  mug: img('mug.webp', 'Branded ceramic mug', 1024, 975),
  banners: img('banners.webp', 'Custom printed banners and event signage', 1200, 902),
  reflectors: img('reflectors.webp', 'Branded safety reflectors', 2362, 2362),
  caps: img('caps.webp', 'Embroidered branded caps', 500, 500),
  jute: img('jute-bags.webp', 'Printed eco-friendly jute bags', 1100, 1100),
  laundryMfg: img('laundry-bag-manufacturing.webp', 'Laundry bag manufacturing', 600, 600),
  laundry: img('laundry-bag.webp', 'Branded hotel laundry bag', 1314, 1500),
  gift: img('gift-bags.webp', 'Custom branded gift bags and packaging', 1026, 1026),
  brochures: img('brochures.webp', 'Printed brochures and brand collateral', 1051, 591),
  notebooks: img('notebooks.webp', 'Branded corporate notebooks', 2048, 1977),
  corporate: img('corporate-finance.webp', 'Corporate branded merchandise set', 1024, 1024),
  retail: img('retail-ecommerce.webp', 'Retail and e-commerce branded packaging', 1024, 1024),
  hospitality: img('hospitality-tourism.webp', 'Hospitality branded uniforms and laundry bags', 1024, 1024),
  healthcare: img('healthcare-wellness.webp', 'Healthcare branded uniforms and materials', 1024, 1024),
  education: img('education.webp', 'School branded caps, uniforms and stationery', 1024, 1024),
  ngo: img('non-profit-ngos.webp', 'NGO eco-friendly branded merchandise', 1024, 1024),
};

const stock = (name: keyof typeof STOCK) => img(`stock/${name}.webp`, STOCK[name][2], STOCK[name][0], STOCK[name][1]);
const STOCK = {
  'tees-folded': [1024, 683, "Stack of folded cotton T-shirts in assorted colours"],
  'tees-fan': [1024, 683, "Folded T-shirts fanned out in brand colours"],
  'tees-hangers': [1024, 683, "Plain T-shirts on wooden hangers ready for printing"],
  'tees-stack': [1024, 683, "Folded T-shirts in layered colours"],
  'rack-hangers': [1024, 684, "Garments on a clothing rail"],
  'rack-shop': [960, 640, "Rail of shirts and jackets in a boutique"],
  'tailor': [2000, 1250, "Tailor stitching fabric on a sewing machine"],
  'tailor-street': [2000, 1456, "Tailor working at a treadle sewing machine"],
  'threads-jar': [1024, 768, "Colourful embroidery thread spools in a glass jar"],
  'threads-rainbow': [1024, 768, "Rainbow of embroidery threads"],
  'threads-pile': [1024, 683, "Pile of colourful thread spools"],
  'fabric-rolls': [2000, 1503, "Rolls of printed fabric"],
  'hats': [1024, 683, "Assorted hats and caps on display"],
  'pens': [1024, 685, "Pot of colourful pens and highlighters"],
  'markers': [1024, 683, "Tins of colourful markers"],
  'stationery-flatlay': [960, 640, "Notepad, pencil and stationery flat lay"],
  'notebook-coffee': [1920, 1280, "Notebook and pen beside a cup of coffee"],
  'notebook-vintage': [960, 720, "Open notebook with pencil on a desk"],
  'mug-enamel': [2000, 1333, "Printed enamel coffee mug"],
  'mug-white': [2000, 1333, "White ceramic mug on a café table"],
  'mug-zigzag': [2000, 1333, "Patterned ceramic mug on a woven placemat"],
  'mug-hand': [960, 636, "Hand holding a printed enamel mug"],
  'bottles-steel': [1920, 1288, "Stainless steel and glass water bottles"],
  'bottles-sport': [2000, 2000, "Reusable sports water bottles"],
  'hivis-team': [1600, 1067, "Team in high-visibility safety vests"],
  'hivis-runner': [2000, 1333, "Runner wearing a reflective safety vest"],
  'giftbox-black': [960, 640, "Black gift box with gold bow"],
  'kraft-bags': [1200, 1800, "Row of kraft paper carrier bags"],
  'cards-blue': [2000, 1604, "Printed business cards"],
  'banners-1': [2000, 1125, "Printed exhibition roll-up banners"],
  'banners-2': [2000, 1125, "Exhibition display banners in brand colours"],
  'sewing-1': [2000, 1333, "Machinist stitching on an industrial sewing machine"],
  'sewing-2': [2000, 1333, "Production team at work in a sewing workshop"],
  'sewing-4': [2000, 1289, "Machinist finishing a product on an industrial machine"],
  'burlap': [1024, 536, "Close-up of natural jute fabric"],
} as const;

export const settings: Settings = {
  name: 'Eljaya Trading Co.',
  tagline: 'Eco friendly at its peak',
  phone: '+254 718 146 386',
  whatsapp: '254718146386',
  email: 'info@eljayatradingco.com',
  address: 'Coffee Plaza, Mfangano St, Nairobi',
  mapQuery: 'Coffee Plaza, Mfangano Street, Nairobi',
  hours: 'Mon – Fri, 8AM – 6PM',
  googleReviewUrl: 'https://share.google/Cpvtg4LgfLfosmTzf',
  rating: 5,
  reviewCount: 5,
  socials: {
    facebook: 'https://www.facebook.com/ELJAYA-TRADING-CO-100069188101109/',
    instagram: 'https://www.instagram.com/eljaya_trading/',
    linkedin: 'https://www.linkedin.com/company/eljaya-trading-company-ltd/',
  },
  announcement: {
    enabled: true,
    text: 'Planning festive corporate gifts? Book your production slot before November.',
    link: '/news/corporate-gift-ideas-nairobi',
  },
  stats: [
    { value: 500, suffix: '+', label: 'Brands elevated' },
    { value: 1000, suffix: '+', label: 'Projects delivered' },
    { value: 11, suffix: ' yrs', label: 'In business' },
    { value: 100, suffix: '%', label: 'Client satisfaction' },
  ],
  seoTitle: 'Branded Merchandise & Eco Packaging in Nairobi | Eljaya Trading Co.',
  seoDescription:
    'Custom branded T-shirts, bottles, bags & eco-friendly packaging in Nairobi. 500+ businesses served. Free quote in 24 hours, call +254 718 146 386.',
  ogImage: I.hero,
};

export const home: Home = {
  heroSlides: [
    {
      image: I.hero,
      eyebrow: 'Branding company · Nairobi, Kenya',
      heading: 'Merchandise that carries your brand further',
      text: 'Custom apparel, eco-friendly packaging and brand essentials, produced with care and delivered on time for 500+ Kenyan businesses.',
    },
    {
      image: I.jute,
      eyebrow: 'Sustainable by default',
      heading: 'Eco packaging your customers keep',
      text: 'Jute, kraft and canvas alternatives to single-use plastic, printed with your logo in up to four colours.',
    },
    {
      image: stock('sewing-1'),
      eyebrow: 'Apparel · Uniforms · Bags',
      heading: 'Skilled hands, careful finishing',
      text: 'Screen printing, embroidery and stitching with quality checks at every stage, so every piece carries your brand properly.',
    },
    {
      image: stock('bottles-steel'),
      eyebrow: 'Corporate gifting',
      heading: 'Gifts your clients actually keep',
      text: 'Branded bottles, mugs, notebooks and gift sets that sit on desks for years, not drawers.',
    },
  ],
  marquee: [
    'Corporate apparel', 'Jute & eco bags', 'Branded bottles', 'Custom packaging', 'Caps & headwear',
    'Banners & signage', 'Safety reflectors', 'Notebooks & stationery', 'Laundry bags', 'Brand identity',
  ],
  introHeading: 'Nairobi’s partner for branded merchandise and sustainable packaging since 2015.',
  introText:
    'We’re not just a printing company. We’re brand builders who understand that every touchpoint matters, from the polo shirt your team wears to the bag your customer carries home. From brief to delivery, we turn your brand into things people use every day.',
  ecoHeading: 'Better for your brand. Better for Kenya.',
  ecoText:
    'Kenya’s plastic regulations and customers’ expectations are changing fast. We help brands make the switch with biodegradable jute, kraft and recycled materials that look premium and get reused for months.',
  ecoImage: stock('kraft-bags'),
  ecoPoints: [
    '100% biodegradable jute & canvas options',
    'Recycled-paper notebooks & kraft packaging',
    'Reusable bags that become walking advertising',
    'Phased switch plans that fit your budget',
  ],
  showcase: [
    stock('tees-hangers'), I.jute, stock('mug-zigzag'), I.caps, stock('threads-jar'), stock('notebook-coffee'), I.gift,
    stock('bottles-steel'), stock('sewing-2'), I.reflectors, stock('kraft-bags'), stock('tees-folded'), I.banners,
    stock('fabric-rolls'), I.notebooks, stock('cards-blue'), stock('hivis-team'), I.polo, stock('threads-rainbow'), stock('mug-enamel'),
  ],
  ctaHeading: 'Let’s make something your customers will keep.',
  ctaText: 'Tell us what you need, how many and when. We’ll send a detailed quote within 24 hours, with no obligation.',
};

export const about: About = {
  heading: 'We build brands people can hold.',
  intro:
    'Eljaya Trading Co. Limited is a Nairobi branding company helping businesses build powerful, recognisable brands through custom merchandise, corporate apparel and eco-friendly packaging.',
  image: stock('sewing-2'),
  secondaryImage: stock('threads-rainbow'),
  story: md(`
Since 2015, Eljaya Trading Co. has been changing how Kenyan businesses approach brand development. We believe powerful branding isn’t just about a logo. It’s about consistent, memorable experiences at every touchpoint your customers meet.

Our team at Coffee Plaza, Nairobi combines creative expertise with sustainable manufacturing to deliver branded merchandise that doesn’t just look good, but positions your business as a leader in its field.

We’ve elevated over 500 brands across corporate, retail, hospitality, healthcare, education and NGO sectors, from 20-piece startup orders to 1,000-piece corporate rollouts.
`),
  values: [
    { title: 'Brand differentiation', text: 'We find what makes your business unique and amplify it through visual identity and messaging that cuts through the noise.' },
    { title: 'Audience connection', text: 'We understand your market deeply to create brand experiences that resonate and build lasting customer relationships.' },
    { title: 'Consistent excellence', text: 'Your brand stays consistent across every touchpoint, from digital to physical merchandise, building recognition and trust.' },
    { title: 'Sustainable growth', text: 'We build brands that succeed commercially and contribute positively to environmental and social responsibility.' },
  ],
  processHeading: 'From brief to doorstep in four clear steps',
  processIntro:
    'Every order follows the same proven process regardless of size, because consistency is how we guarantee quality every time. Standard orders run 15–22 business days; rush turnarounds of 5–7 days are available for select products.',
  processSteps: [
    { title: 'Discovery & brief', duration: '2–3 days', text: 'We capture your brand colours, logo files, audience and intended use, asking the right questions upfront so there are no surprises later.', points: ['Brand & audience brief', 'Product recommendations', 'Itemised quotation'] },
    { title: 'Design & mock-ups', duration: '5–7 days', text: 'Our design team produces digital mock-ups so you see exactly what the finished product will look like before a single item is made.', points: ['Digital mock-ups', 'Physical samples on request', 'Revisions until approved'] },
    { title: 'Production', duration: '7–10 days', text: 'Premium materials, careful printing and embroidery, and quality checks at every stage. Every order is inspected before dispatch.', points: ['Quality materials sourcing', 'Rigorous quality control', 'Progress updates'] },
    { title: 'Delivery & support', duration: '1–2 days', text: 'Delivery within Nairobi is included for most orders, with courier delivery countrywide. We stay on hand for reorders and rollouts.', points: ['Nairobi delivery included', 'Countrywide courier', 'Easy reorders'] },
  ],
};

export const services: Service[] = [
  {
    _id: 'svc-apparel', slug: 'corporate-apparel', category: 'merchandise', featured: true,
    title: 'Corporate Apparel & Branded T-Shirts',
    excerpt: 'Polo shirts, T-shirts, hoodies and uniforms, screen-printed or embroidered in-house.',
    description: 'We brand polo shirts, T-shirts, hoodies and uniforms for businesses across Nairobi, from 20-piece startup orders to 500+ piece corporate rollouts. All apparel is screen-printed or embroidered in-house using premium 220–240 GSM cotton and poly-cotton blends that hold colour after repeated washing, ideal for hospitality and healthcare teams.',
    image: I.polo, gallery: [stock('tees-hangers'), stock('tees-folded'), stock('tees-stack'), stock('sewing-1'), stock('threads-rainbow'), stock('rack-hangers')], turnaround: '7–10 business days', minOrder: '20 pieces', priceFrom: 'KSh 650',
    popularWith: 'Corporates, schools, NGOs, hospitality',
    features: ['220–240 GSM cotton & poly-cotton blends', 'Screen printing & embroidery', 'All sizes including plus sizes', 'Sample provided before bulk production'],
    options: [{ name: 'Branded T-shirt (180gsm)', unitPrice: 650, minQty: 50 }, { name: 'Polo shirt (220gsm piqué)', unitPrice: 950, minQty: 30 }, { name: 'Premium polo (240gsm)', unitPrice: 1400, minQty: 20 }, { name: 'Staff uniform set', unitPrice: 2200, minQty: 20 }],
  },
  {
    _id: 'svc-bottles', slug: 'branded-bottles', category: 'merchandise', featured: true,
    title: 'Branded Water Bottles, Flasks & Mugs',
    excerpt: 'Stainless steel, aluminium and BPA-free bottles, printed or laser-engraved.',
    description: 'Custom branded water bottles and vacuum flasks for corporate gifting, events and staff use across Kenya. Available in 350ml, 500ml and 750ml capacities in stainless steel, aluminium and BPA-free plastic. Your logo is printed or laser-engraved for a premium finish that lasts.',
    image: I.bottles, gallery: [stock('bottles-steel'), stock('bottles-sport'), I.mug, stock('mug-zigzag'), stock('mug-enamel'), stock('mug-white')], turnaround: '5–7 business days', minOrder: '25 pieces', priceFrom: 'KSh 450',
    popularWith: 'Corporate events, staff gifts, schools',
    features: ['BPA-free & food-safe materials', '350ml, 500ml & 750ml options', 'Insulated stainless steel available', 'Print or laser engraving'],
    options: [{ name: 'Plastic bottle (500ml)', unitPrice: 450, minQty: 50 }, { name: 'Aluminium sports bottle', unitPrice: 750, minQty: 30 }, { name: 'Stainless steel tumbler', unitPrice: 1200, minQty: 20 }, { name: 'Ceramic mug', unitPrice: 550, minQty: 24 }],
  },
  {
    _id: 'svc-caps', slug: 'branded-caps', category: 'merchandise',
    title: 'Branded Caps & Headwear',
    excerpt: 'Baseball caps, bucket hats and beanies with embroidered or printed logos.',
    description: 'Custom branded caps, bucket hats and beanies for corporate teams, schools, sports clubs and promotional events in Nairobi. Available in structured and unstructured styles with embroidered or printed logos, in adjustable one-size-fits-most designs.',
    image: I.caps, gallery: [stock('hats'), stock('threads-jar'), stock('threads-pile')], turnaround: '7–10 business days', minOrder: '24 pieces', priceFrom: 'KSh 550',
    popularWith: 'Corporates, sports clubs, schools, events',
    features: ['Baseball caps, bucket hats & beanies', 'Embroidery & print options', 'Adjustable one-size-fits-most', 'Wide colour range'],
    options: [{ name: 'Baseball cap (embroidered)', unitPrice: 650, minQty: 24 }, { name: 'Trucker cap (mesh back)', unitPrice: 550, minQty: 24 }, { name: 'Bucket hat', unitPrice: 700, minQty: 30 }],
  },
  {
    _id: 'svc-reflectors', slug: 'safety-reflectors', category: 'merchandise',
    title: 'Branded Safety Reflectors',
    excerpt: 'Wristband, clip-on and keyring reflectors for road-safety campaigns.',
    description: 'Custom branded safety reflectors for road safety campaigns, NGO distributions, schools and community programmes across Kenya. Available in wristband, clip-on and keyring styles with your logo or message printed clearly.',
    image: I.reflectors, gallery: [stock('hivis-team'), stock('hivis-runner')], turnaround: '5–7 business days', minOrder: '100 pieces', priceFrom: 'KSh 120',
    popularWith: 'NGOs, schools, government, corporates',
    features: ['Wristband, clip-on & keyring styles', 'High-visibility certified materials', 'Custom logo & message printing', 'Bulk pricing for large campaigns'],
    options: [{ name: 'Snap-band reflector', unitPrice: 120, minQty: 100 }, { name: 'Reflector vest', unitPrice: 850, minQty: 20 }],
  },
  {
    _id: 'svc-notebooks', slug: 'notebooks-stationery', category: 'merchandise',
    title: 'Corporate Notebooks & Stationery',
    excerpt: 'A4 & A5 notebooks, diaries and pen sets, embossed or printed with your logo.',
    description: 'Custom branded notebooks, pens, diaries and desk accessories for corporate gifting, staff onboarding and conference packs. Notebooks come in A4 and A5 with hardcover or softcover binding, plain or ruled pages, and your logo embossed or printed on the cover.',
    image: I.notebooks, gallery: [stock('notebook-coffee'), stock('pens'), stock('markers'), stock('stationery-flatlay'), stock('notebook-vintage')], turnaround: '7–10 business days', minOrder: '25 pieces',
    popularWith: 'Corporates, conferences, staff gifting',
    features: ['A4 & A5 hardcover & softcover', 'Embossed or printed cover branding', 'Recycled-paper options', 'Matching pen sets available'],
    options: [{ name: 'A5 notebook', minQty: 25 }, { name: 'A4 notebook', minQty: 25 }, { name: 'Notebook + pen set', minQty: 25 }],
  },
  {
    _id: 'svc-jute', slug: 'jute-eco-bags', category: 'packaging', featured: true,
    title: 'Jute & Eco Bags',
    excerpt: 'Jute, canvas and non-woven reusable bags, the alternative to single-use plastic.',
    description: 'Custom printed jute bags, canvas totes and non-woven reusable bags for retail, events and corporate gifting across Kenya. Popular with supermarkets, boutiques, NGOs and eco-conscious brands, and printed with your logo in up to four colours.',
    image: I.jute, gallery: [stock('burlap'), stock('kraft-bags'), I.gift], turnaround: '7–10 business days', minOrder: '50 pieces', priceFrom: 'KSh 280',
    popularWith: 'Retail, NGOs, events, corporate gifting',
    features: ['Jute, canvas & non-woven options', '100% biodegradable materials', 'Up to 4-colour logo printing', 'Bulk discounts from 100 pieces'],
    options: [{ name: 'Jute tote bag', unitPrice: 280, minQty: 50 }, { name: 'Jute bag with gusset & handles', unitPrice: 380, minQty: 50 }, { name: 'Non-woven shopping bag', unitPrice: 180, minQty: 100 }, { name: 'Canvas tote bag', unitPrice: 420, minQty: 30 }],
  },
  {
    _id: 'svc-packaging', slug: 'custom-packaging', category: 'packaging', featured: true,
    title: 'Custom Branded Packaging',
    excerpt: 'Boxes, gift bags, tissue and mailers that make unboxing memorable.',
    description: 'Custom packaging boxes, gift bags, tissue paper and mailer bags for retail, e-commerce and corporate gifting. We design and produce packaging that matches your brand colours and creates a memorable unboxing experience, which matters for repeat purchases and social sharing.',
    image: I.gift, gallery: [stock('kraft-bags'), stock('giftbox-black'), I.jute], turnaround: '7–14 business days', minOrder: '50 pieces',
    popularWith: 'E-commerce, retail, corporate gifting',
    features: ['Boxes, bags, tissue & mailers', 'Full-colour custom printing', 'Eco-friendly material options', 'OEM & white-label available'],
    options: [{ name: 'Branded gift bags', minQty: 50 }, { name: 'Custom boxes', minQty: 50 }, { name: 'Mailer bags', minQty: 50 }, { name: 'Branded tissue paper', minQty: 50 }],
  },
  {
    _id: 'svc-laundry', slug: 'laundry-bag-manufacturing', category: 'packaging',
    title: 'Laundry Bag Manufacturing',
    excerpt: 'Custom laundry bags for hotels, hospitals and schools, with OEM available.',
    description: 'We manufacture custom laundry bags for hotels, hospitals, schools and laundry service providers across Kenya. Produced in polypropylene, cotton canvas or nylon in any size, with your branding stitched or printed on. OEM manufacturing is available for businesses that want bags under their own brand.',
    image: I.laundry, gallery: [I.laundryMfg, stock('sewing-2'), stock('sewing-4'), stock('tailor')], turnaround: '10–14 business days', minOrder: '100 pieces',
    popularWith: 'Hotels, hospitals, schools, laundry services',
    features: ['Polypropylene, canvas & nylon', 'Custom sizes & drawstring styles', 'OEM manufacturing available', 'Bulk production with QA checks'],
    options: [{ name: 'Polypropylene laundry bag', minQty: 100 }, { name: 'Cotton canvas laundry bag', minQty: 100 }, { name: 'Nylon laundry bag', minQty: 100 }],
  },
  {
    _id: 'svc-banners', slug: 'banners-signage', category: 'identity', featured: true,
    title: 'Banners & Signage',
    excerpt: 'Pull-up banners, backdrops, teardrop flags and outdoor signage.',
    description: 'We print pull-up banners, backdrop banners, teardrop flags and outdoor signage for events, exhibitions, retail and offices. Printed on 440gsm PVC or fabric with UV-resistant inks that stay vivid outdoors, in standard sizes or fully custom dimensions, with hardware supplied.',
    image: I.banners, gallery: [stock('banners-1'), stock('banners-2')], turnaround: '2–4 business days', minOrder: '1 piece', priceFrom: 'KSh 1,800',
    popularWith: 'Events, exhibitions, retail, NGOs',
    features: ['440gsm PVC & fabric options', 'UV-resistant outdoor inks', 'Custom dimensions available', 'Mounting hardware included'],
    options: [{ name: 'Pull-up banner (85 × 200cm)', unitPrice: 3500, minQty: 1 }, { name: 'Vinyl banner (1 × 2m)', unitPrice: 1800, minQty: 1 }, { name: 'Vinyl banner (2 × 4m)', unitPrice: 4500, minQty: 1 }, { name: 'Fabric backdrop (2 × 3m)', unitPrice: 6500, minQty: 1 }],
  },
  {
    _id: 'svc-collateral', slug: 'brand-collateral', category: 'identity', featured: true,
    title: 'Brand Identity & Print Collateral',
    excerpt: 'Logo design, brand guidelines, brochures, flyers and business cards.',
    description: 'We help businesses define a cohesive visual identity, then carry it into print: brochures, flyers, business cards and marketing materials on premium 300–350gsm coated stock with gloss or matte lamination. Ideal for trade shows, sales teams and product launches.',
    image: I.brochures, gallery: [stock('cards-blue'), stock('markers'), stock('stationery-flatlay')], turnaround: '3–5 business days', minOrder: '50 pieces',
    popularWith: 'Sales teams, trade shows, product launches',
    features: ['Logo & brand identity design', '300–350gsm coated stock', 'Gloss & matte lamination', 'Same-day proofs on request'],
    options: [{ name: 'Business cards', minQty: 50 }, { name: 'Brochures / flyers', minQty: 50 }, { name: 'Logo & brand identity design', minQty: 1 }],
  },
];

export const packs: Pack[] = [
  { _id: 'pack-onboarding', title: 'New-hire welcome kit', badge: 'Most popular', tagline: 'Make day one memorable and keep your brand on every desk.', image: stock('tees-hangers'), items: ['Branded polo or T-shirt', 'A5 notebook & pen', 'Stainless steel bottle', 'Jute tote to carry it all'], minQty: 20 },
  { _id: 'pack-festive', title: 'Festive client hamper', badge: 'Book by November', tagline: 'Year-end thank-you gifts that clients actually keep.', image: stock('giftbox-black'), items: ['Branded gift box', 'Premium notebook', 'Steel tumbler or mug', 'Optional Kenyan coffee or honey'], minQty: 25 },
  { _id: 'pack-conference', title: 'Conference & event pack', tagline: 'Everything delegates need, with your logo front and centre.', image: stock('notebook-coffee'), items: ['Printed jute or canvas bag', 'Notebook & pen', 'Branded cap or lanyard', 'Pull-up banner for the venue'], minQty: 50 },
  { _id: 'pack-eco', title: 'Eco brand starter', badge: 'Plastic-free', tagline: 'Switch to sustainable packaging and branded reusables in one order.', image: stock('kraft-bags'), items: ['Kraft paper carrier bags', 'Printed jute totes', 'Recycled-paper notebooks', 'Reusable bottles'], minQty: 50 },
];

export const industries: Industry[] = [
  { _id: 'ind-corporate', title: 'Corporate & Finance', stat: '120+ clients', image: stock('notebook-coffee'), description: 'Polo shirts, notebooks and stationery that build trust and credibility in B2B markets.' },
  { _id: 'ind-retail', title: 'Retail & E-commerce', stat: '80+ brands', image: stock('kraft-bags'), description: 'Custom packaging and branded bags that elevate unboxing and customer experience.' },
  { _id: 'ind-hospitality', title: 'Hospitality & Tourism', stat: '50+ properties', image: stock('mug-white'), description: 'Laundry bags, uniforms and brand touchpoints that create memorable guest experiences.' },
  { _id: 'ind-healthcare', title: 'Healthcare & Wellness', stat: '40+ facilities', image: stock('hivis-runner'), description: 'Reflectors, uniforms and hygienic branded materials for medical and wellness facilities.' },
  { _id: 'ind-education', title: 'Education', stat: '60+ schools', image: stock('markers'), description: 'Caps, uniforms and stationery that foster institutional pride and identity.' },
  { _id: 'ind-ngo', title: 'Non-Profit & NGOs', stat: '45+ organisations', image: stock('hivis-team'), description: 'Eco-friendly jute bags and sustainable merchandise aligned with mission and community.' },
];

export const projects: Project[] = [
  { _id: 'prj-corporate', slug: 'corporate-onboarding-kit', featured: true, title: 'Corporate onboarding kit', industry: 'Corporate & Finance', year: '2026', cover: I.corporate, gallery: [I.notebooks, stock('tees-hangers'), stock('bottles-steel'), stock('pens'), stock('mug-zigzag')], tags: ['Apparel', 'Stationery', 'Drinkware'], excerpt: 'A complete welcome pack of branded polos, notebooks and bottles that new hires actually use.' },
  { _id: 'prj-retail', slug: 'retail-eco-packaging', featured: true, title: 'Retail eco-packaging switch', industry: 'Retail & E-commerce', year: '2026', cover: I.retail, gallery: [I.gift, stock('kraft-bags'), I.jute, stock('giftbox-black')], tags: ['Packaging', 'Jute bags'], excerpt: 'Branded kraft boxes, gift bags and jute totes replacing single-use plastic at checkout.' },
  { _id: 'prj-hospitality', slug: 'hospitality-guest-collection', featured: true, title: 'Hotel guest-room collection', industry: 'Hospitality & Tourism', year: '2025', cover: I.hospitality, gallery: [I.laundry, I.laundryMfg, stock('sewing-4'), stock('rack-hangers')], tags: ['Laundry bags', 'Uniforms'], excerpt: 'Drawstring laundry bags, staff uniforms and in-room touchpoints in one consistent identity.' },
  { _id: 'prj-healthcare', slug: 'healthcare-staff-programme', title: 'Healthcare staff programme', industry: 'Healthcare & Wellness', year: '2025', cover: I.healthcare, gallery: [I.reflectors, stock('hivis-runner'), stock('tees-stack')], tags: ['Uniforms', 'Reflectors'], excerpt: 'Hard-wearing branded uniforms and high-visibility reflectors for facility teams.' },
  { _id: 'prj-education', slug: 'school-identity-refresh', title: 'School identity refresh', industry: 'Education', year: '2025', cover: I.education, gallery: [I.caps, stock('notebook-coffee'), stock('markers'), stock('stationery-flatlay')], tags: ['Caps', 'Stationery'], excerpt: 'Caps, uniforms and stationery that carry a school’s crest with pride.' },
  { _id: 'prj-ngo', slug: 'ngo-sustainable-campaign', title: 'NGO sustainable campaign', industry: 'Non-Profit & NGOs', year: '2024', cover: I.ngo, gallery: [I.jute, stock('banners-1'), stock('hivis-team'), stock('burlap')], tags: ['Jute bags', 'Banners'], excerpt: 'Campaign jute bags and event banners aligned with a community-first mission.' },
];

export const posts: Post[] = [
  {
    _id: 'post-cost', slug: 'branded-merchandise-cost-kenya', category: 'Pricing guide', publishedAt: '2026-07-03', readTime: 7, cover: stock('tees-folded'),
    title: 'How Much Does Branded Merchandise Cost in Kenya? 2026 Price Guide',
    excerpt: 'Real KSh prices for branded T-shirts, bottles, jute bags, banners, caps and more. Plan your corporate order budget with confidence.',
    body: md(`
One of the first questions we get from new clients is: “How much is this going to cost me?” The honest answer is that it varies more than most people expect. The price of branded merchandise in Kenya depends on the product, the quantity you order, the printing method, and the quality of materials.

This guide breaks down real 2026 prices for the most popular categories we handle at Eljaya Trading Co. in Nairobi. No vague ranges, just actual KSh figures you can use to plan your budget.

## Branded T-Shirts & Polo Shirts

Corporate apparel is still the most requested item we produce. T-shirts and polo shirts get your brand seen everywhere: at events, in the office, on the street.

| Item | Min. order | Price per unit |
| Branded T-shirt (180gsm) | 50 pcs | From KSh 650 |
| Polo shirt (220gsm piqué) | 30 pcs | From KSh 950 |
| Premium polo (240gsm) | 20 pcs | From KSh 1,400 |
| Staff uniform set | 20 sets | From KSh 2,200 |

Prices include single-colour screen printing on one side. Additional print positions, embroidery, or full-colour DTF printing add to the cost. For large orders (200+ pieces), prices drop considerably, so always ask for a bulk quote.

## Branded Water Bottles & Mugs

Bottles and mugs sit on desks, go to meetings, and get used daily, which means your brand gets seen constantly.

| Item | Min. order | Price per unit |
| Branded plastic bottle (500ml) | 50 pcs | From KSh 450 |
| Aluminium sports bottle | 30 pcs | From KSh 750 |
| Stainless steel tumbler | 20 pcs | From KSh 1,200 |
| Branded ceramic mug | 24 pcs | From KSh 550 |

> Stainless steel bottles cost more upfront but clients keep them for years. For high-value corporate gifts, they’re worth the extra spend.

## Eco-Friendly Bags (Jute & Non-Woven)

Jute bags have become one of our most popular products, especially for NGOs, retail brands, and companies with sustainability commitments.

| Item | Min. order | Price per unit |
| Jute tote bag (branded) | 50 pcs | From KSh 280 |
| Jute bag with gusset & handles | 50 pcs | From KSh 380 |
| Non-woven shopping bag | 100 pcs | From KSh 180 |
| Canvas tote bag | 30 pcs | From KSh 420 |

## Banners & Outdoor Signage

Banners are one of the most cost-effective ways to get your brand visible at events, trade shows, and storefronts.

| Item | Size | Price |
| Pull-up / roll-up banner | 85cm × 200cm | From KSh 3,500 |
| Vinyl banner (outdoor) | 1m × 2m | From KSh 1,800 |
| Vinyl banner (outdoor) | 2m × 4m | From KSh 4,500 |
| Fabric backdrop banner | 2m × 3m | From KSh 6,500 |

## Branded Caps

| Item | Min. order | Price per unit |
| Baseball cap (embroidered logo) | 24 pcs | From KSh 650 |
| Trucker cap (mesh back) | 24 pcs | From KSh 550 |
| Bucket hat (branded) | 30 pcs | From KSh 700 |

## Safety Reflectors

| Item | Min. order | Price per unit |
| Snap-band reflector (branded) | 100 pcs | From KSh 120 |
| Reflector vest (branded) | 20 pcs | From KSh 850 |

## What Affects the Final Price?

- **Quantity:** the single biggest factor. 200 T-shirts cost significantly less per unit than 30.
- **Number of print colours:** screen printing charges per colour.
- **Print method:** screen printing suits large runs, embroidery feels premium, DTF suits full-colour designs.
- **Material quality:** a 180gsm T-shirt and a 240gsm polo are very different products.
- **Turnaround time:** standard lead times are 7–14 days; rush orders (3–5 days) carry a premium.
- **Delivery:** included within Nairobi; upcountry delivery is available at additional cost.

## How to Get an Accurate Quote

Contact us with three things: what you want, how many you need, and when you need it. We’ll come back with a detailed quote within 24 hours. [Request a free quote](/contact).
`),
  },
  {
    _id: 'post-gifts', slug: 'corporate-gift-ideas-nairobi', category: 'Corporate gifting', publishedAt: '2026-07-17', readTime: 5, cover: stock('giftbox-black'),
    title: 'Corporate Gift Ideas for Nairobi Businesses This Festive Season',
    excerpt: 'Practical, well-received corporate gift ideas ranked by budget, from branded notebooks to premium executive hampers.',
    body: md(`
Corporate gifting season sneaks up fast, and generic gifts rarely leave an impression. The best corporate gifts are practical, well-branded, and feel considered rather than obligatory. Here are ideas Nairobi businesses have used successfully, ranked by budget.

## Budget-Friendly Options

Branded notebooks paired with a pen set remain a reliable choice for client appreciation. They’re practical, reused daily, and keep your logo visible long after the holidays. Branded caps and jute tote bags also work well at this tier, particularly for larger teams.

The key at this level is quality over quantity. A single well-made branded item leaves a better impression than a bag of cheap giveaways.

## Mid-Range: Client and Partner Gifts

Branded travel mugs or stainless steel bottles strike a good balance between cost and perceived value. Pair with a locally sourced treat such as Kenyan coffee or honey for a gift that feels considered.

At this level, packaging matters. A branded gift box or quality jute bag elevates even a simple item, because the unboxing is part of the gift.

## Premium: Executive and VIP Gifts

For senior stakeholders, a curated hamper with premium branded items signals more thought than a single item. A quality notebook, a leather-look portfolio and a branded stainless steel bottle together create a cohesive set.

## Eco-Conscious Options

More Kenyan businesses are asking for sustainable gifting. Jute totes, bamboo pen sets and recycled-paper notebooks let you gift meaningfully while aligning with sustainability goals. See our [eco-friendly range](/services/jute-eco-bags).

## Planning Ahead

Orders spike in November and December, so production slots fill quickly. Ordering by early November gives enough buffer for design approval, production and delivery. For 100+ pieces, get in touch at least 6 weeks before your delivery date.

> Order a sample of your chosen gift before committing to the full quantity. It takes 2–3 extra days but eliminates the risk of a quality surprise.
`),
  },
  {
    _id: 'post-eco', slug: 'eco-friendly-packaging-kenya', category: 'Sustainable packaging', publishedAt: '2026-07-31', readTime: 6, cover: stock('kraft-bags'),
    title: 'Eco-Friendly Packaging Options for Kenyan Retail Brands',
    excerpt: 'Kraft paper, jute bags, recycled cardboard and biodegradable alternatives: what is available and what to consider when switching from plastic.',
    body: md(`
Kenya’s plastic regulations, along with growing customer demand for sustainability, have pushed many retail brands to reconsider their packaging. The good news: the alternatives have improved significantly in quality and availability.

## Kraft Paper Bags

Kraft paper is one of the most cost-effective eco-friendly switches available. It’s biodegradable, takes branding well, and reads as premium without a premium price tag. With twisted paper handles it works beautifully for boutiques, bakeries and gift shops.

## Jute and Canvas Bags

More durable than paper, jute bags are reusable and become a secondary form of advertising as customers carry them for months. The higher upfront cost is offset by extended brand visibility. See our [branded jute bags](/services/jute-eco-bags).

## Recycled Cardboard Boxes

For product packaging, recycled cardboard with minimal ink coverage is cheaper to produce and more sustainable than virgin cardboard with full-colour printing. For e-commerce brands this is often the highest-impact switch.

## Biodegradable Poly Alternatives

Where you need plastic-style flexibility, such as shipping mailers, biodegradable poly alternatives look and function like standard plastic but break down significantly faster under composting conditions.

> Kenya’s plastic bag ban covers single-use carrier bags. Product packaging falls under different regulations. If you’re unsure what applies to you, we can advise during a packaging consultation.

## Making the Switch Without Disrupting Operations

You don’t need to convert everything overnight. Many clients start with customer-facing packaging, such as shopping bags and gift boxes, before moving to shipping materials. A phased approach keeps costs manageable and lets you test customer response.
`),
  },
];

export const testimonials: Testimonial[] = [
  { _id: 't1', name: 'Sarah Kimani', role: 'CEO, TechHub Africa', rating: 5, quote: 'Eljaya transformed our brand identity completely. Their strategic approach and attention to detail resulted in a cohesive brand that truly represents our values. Our market presence has never been stronger.' },
  { _id: 't2', name: 'David Ochieng', role: 'Marketing Director, Green Valley Resorts', rating: 5, quote: 'Working with Eljaya was a game-changer. They didn’t just provide products; they helped us develop a brand strategy that resonates with our audience. Highly recommended!' },
  { _id: 't3', name: 'Mary Wanjiru', role: 'HR Manager, Nairobi International School', rating: 5, quote: 'The quality of work and professionalism is outstanding. They delivered our branded merchandise on time and exceeded our expectations. Our team loves the new uniforms!' },
  { _id: 't4', name: 'James Mwangi', role: 'Founder, EcoMart Kenya', rating: 5, quote: 'Exceptional service and innovative solutions. Eljaya helped us position our brand as a market leader through eco-friendly packaging. Our customers have noticed the difference.' },
];

export const faqs: Faq[] = [
  { _id: 'f1', question: 'How much does branded merchandise cost in Nairobi?', answer: 'Prices vary by product and quantity. As a guide: branded T-shirts start from KSh 650 per piece (50+), water bottles from KSh 450, jute bags from KSh 280 and banners from KSh 1,800. Larger orders attract bulk discounts. Contact us for a free itemised quote.' },
  { _id: 'f2', question: 'How long does an order take?', answer: 'Most standard orders are completed within 7–14 business days. The full process from brief to delivery typically runs 15–22 business days. Rush orders of 5–7 days are available for select products.' },
  { _id: 'f3', question: 'Can I order a small batch?', answer: 'Yes. Minimums start from 1 piece for banners, 20 for apparel, 24 for caps and 25 for bottles. Small batch orders are welcome. Tell us what you need and we’ll advise on the best option for your budget.' },
  { _id: 'f4', question: 'Do you deliver outside Nairobi?', answer: 'Yes. We deliver across Kenya, including Mombasa, Kisumu, Nakuru and Eldoret, via courier. Delivery within Nairobi is included for most orders.' },
  { _id: 'f5', question: 'What file format do you need for my logo?', answer: 'Vector files (AI, EPS or PDF with outlined fonts) are best. High-resolution PNG or JPEG (300 DPI+) works for most jobs. If you only have a low-resolution logo, our designers can redraw it in vector for a small fee.' },
  { _id: 'f6', question: 'Do you provide samples before bulk production?', answer: 'Yes. For most products we provide a physical sample or digital proof first. Samples typically take 2–3 business days, so you can approve colour, print quality and sizing before the full run.' },
  { _id: 'f7', question: 'Do you offer eco-friendly options?', answer: 'Absolutely, it’s our speciality. We offer jute and canvas bags, kraft and recycled packaging, recycled-paper notebooks and other sustainable branded products.' },
  { _id: 'f8', question: 'How do I pay?', answer: 'A 50% deposit starts production, with the balance due on completion before delivery. We accept M-Pesa, bank transfer and cash.' },
];

export const legal: Record<'privacy' | 'terms', LegalPage> = {
  privacy: {
    title: 'Privacy Policy',
    updated: '2026-10-15',
    body: md(`
## 1. Information we collect
When you contact us through our website, we collect your name, email address, phone number, company name and the details of your enquiry. We only collect information you voluntarily provide.

## 2. How we use your information
We use your information solely to respond to your enquiry, provide quotes and deliver the services you request. We do not sell, rent or share your personal data with third parties for marketing purposes.

## 3. How enquiries are handled
When you submit our contact form, your enquiry is emailed to our team and stored securely in our website’s content management system so we can follow up. If you choose to message us on WhatsApp, WhatsApp’s own privacy policy applies to those messages.

## 4. Cookies
Our website does not use tracking cookies or third-party advertising. We use only essential browser storage for site functionality.

## 5. Data security
We take reasonable precautions to protect your information. All communication with our website is encrypted via HTTPS.

## 6. Your rights
You may request access to, correction of, or deletion of any personal information we hold about you. Email info@eljayatradingco.com to exercise these rights.

## 7. Contact
Eljaya Trading Co. Limited, Coffee Plaza, Mfangano St, Nairobi. Email: info@eljayatradingco.com. Phone: +254 718 146 386.
`),
  },
  terms: {
    title: 'Terms of Service',
    updated: '2026-01-01',
    body: md(`
## 1. Services
Eljaya Trading Co. Limited provides branding, promotional merchandise, eco-friendly packaging and custom manufacturing services. All services are subject to availability and confirmation by our team.

## 2. Orders & quotations
All quotations are valid for 14 days from the date of issue. Orders are confirmed only upon receipt of a signed purchase order or written confirmation and the agreed deposit payment.

## 3. Payment terms
A deposit of 50% is required to commence production on all orders. The remaining balance is due upon completion and before delivery. We accept M-Pesa, bank transfer and cash payments.

## 4. Turnaround time
Standard production timelines are provided at the time of quotation. Timelines begin from the date of deposit payment and approval of final artwork. Rush orders may attract additional charges.

## 5. Artwork & design
Clients are responsible for providing print-ready artwork or approving designs before production. Eljaya Trading Co. is not liable for errors in client-supplied artwork. Once production begins, changes cannot be made.

## 6. Quality & returns
We guarantee the quality of all our products. If goods are defective due to our error, we will replace them at no cost. Returns due to client-side errors (incorrect artwork, wrong specifications) are not accepted.

## 7. Intellectual property
Clients retain ownership of their brand assets. By placing an order, clients confirm they have the right to use all logos, images and content provided for production.

## 8. Limitation of liability
Eljaya Trading Co. Limited’s liability is limited to the value of the order in question. We are not liable for indirect losses, loss of business or consequential damages.

## 9. Governing law
These terms are governed by the laws of Kenya. Any disputes shall be resolved under the jurisdiction of Kenyan courts.

## 10. Contact
Eljaya Trading Co. Limited, Coffee Plaza, Mfangano St, Nairobi. Email: info@eljayatradingco.com. Phone: +254 718 146 386.
`),
  },
};
