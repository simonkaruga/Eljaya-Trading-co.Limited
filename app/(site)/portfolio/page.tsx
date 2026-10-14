import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getIndustries, getProjects, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { PortfolioBrowser } from '@/components/Browsers';
import { ProjectCard } from '@/components/ProjectCard';
import { SmartImage } from '@/components/SmartImage';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { CtaBand } from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Portfolio: Branded Merchandise Projects in Kenya',
  description: 'See branded apparel, eco packaging, uniforms and merchandise Eljaya has produced for corporates, retailers, hotels, schools, healthcare and NGOs across Kenya.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const [projects, industries, s] = await Promise.all([getProjects(), getIndustries(), getSettings()]);
  const grid = 'grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3';

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={<>Brands we’ve <em className="font-light text-leaf">brought to life.</em></>}
        intro="A selection of merchandise, packaging and uniforms we’ve designed and produced for businesses across Kenya."
        crumbs={[{ href: '/portfolio', label: 'Portfolio' }]}
      />

      <section className="container-x section-y">
        <Suspense fallback={<ul className={grid}>{projects.map((p) => <li key={p._id}><ProjectCard project={p} /></li>)}</ul>}>
          <PortfolioBrowser projects={projects} className={grid} />
        </Suspense>
      </section>

      {industries.length > 0 && (
        <section className="bg-sand section-y">
          <div className="container-x">
            <SectionHeading eyebrow="Industries" title={<>Experience across <em className="font-light text-leaf">every sector.</em></>} className="mb-14" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => (
                <Reveal as="li" key={ind._id} delay={(i % 3) * 0.06} className="flex gap-5 rounded-[1.5rem] bg-paper p-4">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl"><SmartImage image={ind.image} fill sizes="96px" className="object-cover" /></div>
                  <div className="py-1">
                    <h3 className="text-xl">{ind.title}</h3>
                    {ind.stat && <p className="mt-1 text-sm font-bold text-leaf">{ind.stat}</p>}
                    <p className="mt-1 line-clamp-2 text-sm text-ink-2">{ind.description}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="pt-20 lg:pt-28" />
      <CtaBand heading="Your brand could be next." text="Share your idea and we’ll show you how it could look, with mock-ups before you commit." phone={s.phone} />
    </>
  );
}
