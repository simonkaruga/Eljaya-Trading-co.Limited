import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Img } from '@/lib/types';
import { Reveal } from './Reveal';
import { ParallaxImage } from './ParallaxImage';

export function PageHero({
  eyebrow, title, intro, image, crumbs = [], children,
}: { eyebrow?: string; title: React.ReactNode; intro?: string; image?: Img; crumbs?: { href: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <section className="container-x pt-10 sm:pt-16">
      <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        {crumbs.map((c) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5" />
            <Link href={c.href} className="hover:text-ink">{c.label}</Link>
          </span>
        ))}
      </nav>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-5 text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-[5.2rem]">{title}</h1>
        </Reveal>
        {(intro || children) && (
          <Reveal delay={0.1} className="lg:col-span-4">
            {intro && <p className="text-lg leading-relaxed text-ink-2">{intro}</p>}
            {children}
          </Reveal>
        )}
      </div>
      {image && (
        <ParallaxImage image={image} priority className="mt-14 aspect-[4/3] rounded-[2rem] sm:aspect-[16/9] lg:aspect-[21/9]" sizes="100vw" strength={8} />
      )}
    </section>
  );
}
