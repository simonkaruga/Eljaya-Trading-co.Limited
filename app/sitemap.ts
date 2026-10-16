import type { MetadataRoute } from 'next';
import { getPosts, getProjects, getServices } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getPosts()]);
  const page = (path: string, priority: number, lastModified?: string) => ({ url: `${SITE_URL}${path}`, priority, lastModified: lastModified ?? new Date() });
  return [
    page('/', 1),
    page('/services', 0.9),
    page('/portfolio', 0.8),
    page('/about', 0.7),
    page('/news', 0.7),
    page('/contact', 0.9),
    page('/reviews', 0.6),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/portfolio/${p.slug}`, 0.6)),
    ...posts.map((p) => page(`/news/${p.slug}`, 0.6, p.publishedAt)),
    page('/privacy', 0.2),
    page('/terms', 0.2),
  ];
}
