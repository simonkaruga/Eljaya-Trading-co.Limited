import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPost, getPosts, getSettings } from '@/lib/content';
import { toPlainText } from '@/lib/md';
import { SITE_URL } from '@/lib/site';
import { PortableBody } from '@/components/PortableBody';
import { SmartImage } from '@/components/SmartImage';
import { PostCard, formatDate } from '@/components/PostCard';
import { Reveal, ImageReveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { CtaBand } from '@/components/CtaBand';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/news/${p.slug}` },
    openGraph: { type: 'article', publishedTime: p.publishedAt, images: p.cover ? [{ url: p.cover.src }] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!p) notFound();

  const readTime = p.readTime ?? Math.max(1, Math.round(toPlainText(p.body as unknown[]).split(/\s+/).length / 220));
  const more = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.publishedAt,
    image: p.cover?.src,
    author: { '@type': 'Organization', name: 'Eljaya Trading Co.' },
    publisher: { '@type': 'Organization', name: 'Eljaya Trading Co.', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-mark.png` } },
    mainEntityOfPage: `${SITE_URL}/news/${p.slug}`,
  };

  return (
    <>
      <article>
        <header className="container-x pt-10 sm:pt-16">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> All news
          </Link>
          <Reveal className="mx-auto mt-10 max-w-4xl text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {p.category && <span className="rounded-full bg-lime/40 px-3 py-1 text-forest">{p.category}</span>}
              <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
              <span className="size-1 rounded-full bg-muted" />
              <span>{readTime} min read</span>
            </div>
            <h1 className="mt-7 text-balance text-4xl leading-[1.06] sm:text-5xl lg:text-6xl">{p.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-2">{p.excerpt}</p>
          </Reveal>
          {p.cover && (
            <ImageReveal className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[2rem] bg-sand">
              <SmartImage image={p.cover} fill priority sizes="100vw" className="object-cover" />
            </ImageReveal>
          )}
        </header>

        <div className="container-x">
          <div className="mx-auto max-w-[44rem] py-16 lg:py-20">
            <PortableBody value={p.body} />
            <div className="mt-14 flex flex-col items-start gap-5 rounded-[1.5rem] bg-sand p-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-2xl">Need a quote for your next order?</p>
              <Button href="/contact" variant="dark">Get a free quote</Button>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="container-x pb-24 lg:pb-32">
          <h2 className="mb-10 text-4xl">Keep reading</h2>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => <PostCard key={m._id} post={m} />)}
          </div>
        </section>
      )}

      <CtaBand heading="Let’s make something your customers will keep." text="Tell us what you need and we’ll reply within 24 hours." phone={s.phone} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
    </>
  );
}
