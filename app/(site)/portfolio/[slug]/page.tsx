import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getProject, getProjects, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { PortableBody } from '@/components/PortableBody';
import { Gallery } from '@/components/Gallery';
import { SmartImage } from '@/components/SmartImage';
import { CtaBand } from '@/components/CtaBand';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/portfolio/${p.slug}` }, openGraph: { images: [{ url: p.cover.src }] } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getProject(slug), getProjects(), getSettings()]);
  if (!p) notFound();

  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const meta = [
    { label: 'Client', value: p.client },
    { label: 'Industry', value: p.industry },
    { label: 'Year', value: p.year },
    { label: 'Products', value: p.tags?.join(', ') },
  ].filter((m) => m.value);

  return (
    <>
      <PageHero eyebrow={p.industry ?? 'Project'} title={p.title} intro={p.excerpt} image={p.cover} crumbs={[{ href: '/portfolio', label: 'Portfolio' }]} />

      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          {meta.length > 0 && (
            <dl className="grid h-fit grid-cols-2 gap-6 lg:col-span-4 lg:grid-cols-1">
              {meta.map((m) => (
                <div key={m.label} className="border-t border-line pt-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{m.label}</dt>
                  <dd className="mt-1.5 text-lg font-medium">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="lg:col-span-8">
            {p.body?.length ? <PortableBody value={p.body} /> : <p className="font-display text-3xl leading-snug">{p.excerpt}</p>}
          </div>
        </div>
      </section>

      {!!p.gallery?.length && (
        <section className="container-x pb-24 lg:pb-32">
          <Gallery images={p.gallery} title={p.title} />
        </section>
      )}

      {next && (
        <section className="container-x pb-24 lg:pb-32">
          <Link href={`/portfolio/${next.slug}`} className="group relative block overflow-hidden rounded-[2rem] bg-forest text-white">
            <SmartImage image={next.cover} fill sizes="100vw" className="object-cover opacity-50 transition-all duration-[1.2s] ease-out-expo group-hover:scale-105 group-hover:opacity-60" />
            <div className="relative flex min-h-72 flex-col justify-end p-8 sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">Next project</p>
              <p className="mt-3 flex items-center gap-4 font-display text-4xl sm:text-6xl">
                {next.title} <ArrowRight className="size-10 transition-transform duration-500 group-hover:translate-x-3" />
              </p>
            </div>
          </Link>
        </section>
      )}

      <CtaBand heading="Want something like this?" text="Tell us about your brand and we’ll put together ideas, mock-ups and a quote." phone={s.phone} />
    </>
  );
}
