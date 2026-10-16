/**
 * One-time import of the built-in content (lib/fallback.ts) and the photos in
 * public/images into Sanity, so the owner starts with a fully populated admin.
 *
 *   npm run seed            → creates documents that don't exist yet
 *   npm run seed -- --force → overwrites them with the built-in content
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';
import * as F from '../lib/fallback.ts';
import type { Img } from '../lib/types.ts';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.');
  process.exit(1);
}
const force = process.argv.includes('--force');

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  token,
  useCdn: false,
});

const assetIds = new Map<string, string>();
async function image(img?: Img | null) {
  if (!img) return undefined;
  let id = assetIds.get(img.src);
  if (!id) {
    const file = path.join(process.cwd(), 'public', img.src);
    const asset = await client.assets.upload('image', await readFile(file), { filename: path.basename(file) });
    id = asset._id;
    assetIds.set(img.src, id);
    console.log(`  ↑ ${img.src}`);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: id }, ...(img.alt ? { alt: img.alt } : {}) };
}

const gallery = async (imgs?: Img[]) =>
  imgs ? Promise.all(imgs.map(async (i, k) => ({ _key: `g${k}`, ...(await image(i)) }))) : undefined;
const keyed = <T extends object>(arr: T[], p: string) => arr.map((x, i) => ({ _key: `${p}${i}`, ...x }));
const slug = (current: string) => ({ _type: 'slug', current });

type Doc = { _id: string; _type: string; [k: string]: unknown };
const docs: Doc[] = [];

async function build() {
  const s = F.settings;
  docs.push({
    _id: 'siteSettings', _type: 'siteSettings',
    name: s.name, tagline: s.tagline, phone: s.phone, whatsapp: s.whatsapp, email: s.email, address: s.address,
    mapQuery: s.mapQuery, hours: s.hours, googleReviewUrl: s.googleReviewUrl, rating: s.rating, reviewCount: s.reviewCount,
    socials: s.socials, announcement: s.announcement, stats: keyed(s.stats, 'st'),
    seoTitle: s.seoTitle, seoDescription: s.seoDescription, ogImage: await image(s.ogImage),
  });

  const h = F.home;
  docs.push({
    _id: 'homePage', _type: 'homePage',
    heroSlides: await Promise.all(h.heroSlides.map(async (sl, i) => ({ _key: `s${i}`, _type: 'slide', eyebrow: sl.eyebrow, heading: sl.heading, text: sl.text, image: await image(sl.image) }))),
    marquee: h.marquee, showcase: await gallery(h.showcase), introHeading: h.introHeading, introText: h.introText,
    ecoHeading: h.ecoHeading, ecoText: h.ecoText, ecoImage: await image(h.ecoImage), ecoPoints: h.ecoPoints,
    ctaHeading: h.ctaHeading, ctaText: h.ctaText,
  });

  const a = F.about;
  docs.push({
    _id: 'aboutPage', _type: 'aboutPage',
    heading: a.heading, intro: a.intro, image: await image(a.image), secondaryImage: await image(a.secondaryImage),
    story: a.story, values: keyed(a.values, 'v'), processHeading: a.processHeading, processIntro: a.processIntro,
    processSteps: keyed(a.processSteps, 'p'),
  });

  for (const [i, sv] of F.services.entries()) {
    docs.push({
      _id: sv._id, _type: 'service', order: i + 1, title: sv.title, slug: slug(sv.slug), category: sv.category,
      excerpt: sv.excerpt, description: sv.description, featured: sv.featured ?? false, priceFrom: sv.priceFrom,
      turnaround: sv.turnaround, minOrder: sv.minOrder, popularWith: sv.popularWith, features: sv.features,
      options: sv.options?.map((o, k) => ({ _key: `o${k}`, _type: 'option', ...o })),
      image: await image(sv.image), gallery: await gallery(sv.gallery),
    });
  }
  for (const [i, pk] of F.packs.entries()) {
    docs.push({ _id: pk._id, _type: 'pack', order: i + 1, title: pk.title, badge: pk.badge, tagline: pk.tagline, items: pk.items, minQty: pk.minQty, image: await image(pk.image) });
  }
  for (const [i, ind] of F.industries.entries()) {
    docs.push({ _id: ind._id, _type: 'industry', order: i + 1, title: ind.title, description: ind.description, stat: ind.stat, image: await image(ind.image) });
  }
  for (const [i, p] of F.projects.entries()) {
    docs.push({
      _id: p._id, _type: 'project', order: i + 1, title: p.title, slug: slug(p.slug), client: p.client, industry: p.industry,
      year: p.year, excerpt: p.excerpt, tags: p.tags, featured: p.featured ?? false,
      cover: await image(p.cover), gallery: await gallery(p.gallery),
    });
  }
  for (const p of F.posts) {
    docs.push({
      _id: p._id, _type: 'post', title: p.title, slug: slug(p.slug), publishedAt: p.publishedAt, category: p.category,
      excerpt: p.excerpt, cover: await image(p.cover), body: p.body,
    });
  }
  F.testimonials.forEach((t, i) => docs.push({ _id: t._id, _type: 'testimonial', status: 'approved', source: 'manual', order: i + 1, name: t.name, role: t.role, quote: t.quote, rating: t.rating }));
  F.faqs.forEach((f, i) => docs.push({ _id: f._id, _type: 'faq', order: i + 1, question: f.question, answer: f.answer }));
  for (const key of ['privacy', 'terms'] as const) {
    const l = F.legal[key];
    docs.push({ _id: `legal-${key}`, _type: 'legalPage', title: l.title, updated: l.updated, body: l.body });
  }
}

async function main() {
  console.log(`Seeding Sanity project ${projectId}${force ? ' (overwriting)' : ''}…`);
  await build();
  const tx = client.transaction();
  docs.forEach((d) => (force ? tx.createOrReplace(d) : tx.createIfNotExists(d)));
  await tx.commit();
  console.log(`✓ ${docs.length} documents, ${assetIds.size} images. Open /studio to edit.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
