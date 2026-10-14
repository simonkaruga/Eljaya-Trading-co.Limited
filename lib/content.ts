import 'server-only';
import { cache } from 'react';
import { client } from './sanity/client';
import { sanityEnabled } from './sanity/env';
import * as Q from './sanity/queries';
import * as F from './fallback';
import type {
  About, ClientLogo, Faq, Home, Industry, LegalPage, Pack, Post, Project, Service, Settings, Testimonial,
} from './types';

/** Revalidate at most every 5 minutes; the Sanity webhook (/api/revalidate) refreshes instantly on publish. */
const REVALIDATE = 300;
export const SANITY_TAG = 'sanity';

async function query<T>(q: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(q, params, { next: { revalidate: REVALIDATE, tags: [SANITY_TAG] } });
  } catch (err) {
    console.error('[sanity] query failed, using built-in content', err);
    return null;
  }
}

/** Drop null/empty values so a half-filled singleton in the studio never blanks a section. */
function clean<T extends object>(doc: T | null): Partial<T> {
  if (!doc) return {};
  return Object.fromEntries(
    Object.entries(doc).filter(([, v]) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  ) as Partial<T>;
}

/** Singletons: Sanity values override built-in content field by field. */
async function single<T extends object>(q: string, fallback: T, params?: Record<string, string>): Promise<T> {
  if (!sanityEnabled) return fallback;
  return { ...fallback, ...clean(await query<T>(q, params)) };
}

/** Collections: once Sanity is connected, its list is the source of truth (even if empty). */
async function many<T>(q: string, fallback: T[]): Promise<T[]> {
  if (!sanityEnabled) return fallback;
  return (await query<T[]>(q)) ?? fallback;
}

export const getSettings = cache(async (): Promise<Settings> => {
  const s = await single<Settings>(Q.settingsQ, F.settings);
  return { ...s, socials: { ...F.settings.socials, ...clean(s.socials ?? {}) } };
});
export const getHome = cache(() => single<Home>(Q.homeQ, F.home));
export const getAbout = cache(() => single<About>(Q.aboutQ, F.about));
export const getServices = cache(() => many<Service>(Q.servicesQ, F.services));
export const getPacks = cache(() => many<Pack>(Q.packsQ, F.packs));
export const getIndustries = cache(() => many<Industry>(Q.industriesQ, F.industries));
export const getProjects = cache(() => many<Project>(Q.projectsQ, F.projects));
export const getPosts = cache(() => many<Post>(Q.postsQ, F.posts.map(({ body: _body, ...p }) => p)));
export const getTestimonials = cache(() => many<Testimonial>(Q.testimonialsQ, F.testimonials));
export const getFaqs = cache(() => many<Faq>(Q.faqsQ, F.faqs));
export const getClientLogos = cache(() => many<ClientLogo>(Q.clientLogosQ, []));

export const getService = cache(async (slug: string) =>
  sanityEnabled ? query<Service>(Q.serviceQ, { slug }) : F.services.find((s) => s.slug === slug) ?? null,
);
export const getProject = cache(async (slug: string) =>
  sanityEnabled ? query<Project>(Q.projectQ, { slug }) : F.projects.find((p) => p.slug === slug) ?? null,
);
export const getPost = cache(async (slug: string) =>
  sanityEnabled ? query<Post>(Q.postQ, { slug }) : F.posts.find((p) => p.slug === slug) ?? null,
);
export const getLegal = cache((page: 'privacy' | 'terms') =>
  single<LegalPage>(Q.legalQ, F.legal[page], { id: `legal-${page}` }),
);
