import type { PortableTextBlock } from '@portabletext/react';

/** Image normalised from either Sanity (cdn.sanity.io) or the bundled /public fallbacks. */
export type Img = {
  src: string;
  alt?: string;
  w?: number;
  h?: number;
  lqip?: string;
  hotspot?: { x: number; y: number } | null;
};

export type RichText = PortableTextBlock[] | (PortableTextBlock | Record<string, unknown>)[];

export type Stat = { value: number; suffix?: string; label: string };

export type Settings = {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapQuery: string;
  hours: string;
  googleReviewUrl?: string;
  rating?: number;
  reviewCount?: number;
  socials: { facebook?: string; instagram?: string; linkedin?: string; tiktok?: string };
  announcement?: { enabled?: boolean; text?: string; link?: string };
  stats: Stat[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: Img;
};

export type HeroSlide = { image: Img; eyebrow?: string; heading: string; text?: string };

export type Home = {
  heroSlides: HeroSlide[];
  marquee: string[];
  showcase: Img[];
  introHeading: string;
  introText: string;
  ecoHeading: string;
  ecoText: string;
  ecoImage: Img;
  ecoPoints: string[];
  ctaHeading: string;
  ctaText: string;
};

export type ProcessStep = { title: string; duration?: string; text: string; points?: string[] };

export type About = {
  heading: string;
  intro: string;
  image: Img;
  secondaryImage?: Img;
  story: RichText;
  values: { title: string; text: string }[];
  processHeading: string;
  processIntro: string;
  processSteps: ProcessStep[];
};

export type ServiceCategory = 'merchandise' | 'packaging' | 'identity';

export type ServiceOption = { name: string; unitPrice?: number; minQty?: number; note?: string };

export type Pack = {
  _id: string;
  title: string;
  tagline: string;
  image: Img;
  items: string[];
  minQty?: number;
  badge?: string;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  excerpt: string;
  description?: string;
  image: Img;
  gallery?: Img[];
  turnaround?: string;
  minOrder?: string;
  priceFrom?: string;
  popularWith?: string;
  features?: string[];
  options?: ServiceOption[];
  featured?: boolean;
};

export type Industry = { _id: string; title: string; description: string; stat?: string; image: Img };

export type Project = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  industry?: string;
  year?: string;
  excerpt: string;
  cover: Img;
  gallery?: Img[];
  body?: RichText;
  tags?: string[];
  featured?: boolean;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  excerpt: string;
  cover?: Img;
  publishedAt: string;
  readTime?: number;
  body?: RichText;
};

export type Testimonial = { _id: string; name: string; role?: string; quote: string; rating?: number; photo?: Img };

export type Faq = { _id: string; question: string; answer: string };

export type ClientLogo = { _id: string; name: string; logo: Img; url?: string };

export type LegalPage = { title: string; updated?: string; body: RichText };
