import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Clock, Package, Tag, Users } from 'lucide-react';
import { getService, getServices, getSettings } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Gallery } from '@/components/Gallery';
import { Button } from '@/components/Button';
import { Reveal, ImageReveal } from '@/components/Reveal';
import { ServiceCard, CATEGORY_LABELS } from '@/components/ServiceCard';
import { CtaBand } from '@/components/CtaBand';
import { WhatsAppIcon } from '@/components/icons';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return {
    title: `${s.title} in Nairobi`,
    description: s.description?.slice(0, 160) ?? s.excerpt,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { images: [{ url: s.image.src }] },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, all, settings] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!s) notFound();

  const related = all.filter((x) => x.slug !== s.slug && x.category === s.category).slice(0, 3);
  const facts = [
    { icon: Tag, label: 'Price', value: s.priceFrom && `from ${s.priceFrom}` },
    { icon: Clock, label: 'Turnaround', value: s.turnaround },
    { icon: Package, label: 'Minimum order', value: s.minOrder },
    { icon: Users, label: 'Popular with', value: s.popularWith },
  ].filter((f) => f.value);
  const wa = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi Eljaya, I'd like a quote for ${s.title}.`)}`;

  return (
    <>
      <section className="container-x pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/services" className="hover:text-ink">Services</Link> /{' '}
          <Link href={`/services?category=${s.category}`} className="hover:text-ink">{CATEGORY_LABELS[s.category]}</Link>
        </nav>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ImageReveal className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand lg:sticky lg:top-28 lg:self-start">
            <SmartImage image={s.image} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </ImageReveal>
          <div>
            <Reveal>
              <p className="eyebrow">{CATEGORY_LABELS[s.category]}</p>
              <h1 className="mt-5 text-balance text-5xl leading-[1.04] sm:text-6xl">{s.title}</h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-2">{s.description ?? s.excerpt}</p>
            </Reveal>

            {facts.length > 0 && (
              <Reveal delay={0.08}>
                <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-paper p-5">
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><Icon className="size-3.5 text-leaf" />{label}</dt>
                      <dd className="mt-2 font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {!!s.features?.length && (
              <Reveal delay={0.12}>
                <h2 className="mt-12 text-2xl">What’s included</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-3 rounded-xl bg-white/60 p-4 text-[0.95rem] font-medium">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-white"><Check className="size-3.5" /></span>{f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={0.16} className="mt-12 flex flex-wrap gap-3">
              <Button href={`/contact?service=${encodeURIComponent(s.title)}`}>Request a quote</Button>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white">
                <WhatsAppIcon className="size-5" /> Ask on WhatsApp
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {!!s.gallery?.length && (
        <section className="container-x section-y">
          <h2 className="mb-10 text-4xl">More photos</h2>
          <Gallery images={[s.image, ...s.gallery]} title={s.title} />
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x section-y">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="text-4xl">You might also need</h2>
            <Button href="/services" variant="outline" className="hidden sm:inline-flex">All services</Button>
          </div>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => <li key={r._id}><ServiceCard service={r} /></li>)}
          </ul>
        </section>
      )}

      <CtaBand heading="Ready when you are." text={`Tell us the quantity and deadline for your ${s.title.toLowerCase()} and we’ll send a detailed quote within 24 hours.`} phone={settings.phone} />
    </>
  );
}
