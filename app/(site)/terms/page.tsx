import type { Metadata } from 'next';
import { getLegal } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { PortableBody } from '@/components/PortableBody';
import { formatDate } from '@/components/PostCard';

export async function generateMetadata(): Promise<Metadata> {
  const p = await getLegal('terms');
  return { title: p.title, alternates: { canonical: '/terms' } };
}

export default async function Page() {
  const p = await getLegal('terms');
  return (
    <>
      <PageHero eyebrow="Legal" title={p.title} intro={p.updated ? `Last updated ${formatDate(p.updated)}` : undefined} crumbs={[{ href: '/terms', label: p.title }]} />
      <section className="container-x section-y">
        <div className="max-w-3xl"><PortableBody value={p.body} /></div>
      </section>
    </>
  );
}
