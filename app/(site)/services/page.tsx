import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getFaqs, getServices, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { ServicesBrowser } from '@/components/Browsers';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Faq } from '@/components/Faq';
import { CtaBand } from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Branded Merchandise & Eco Packaging Services',
  description: 'Corporate apparel, branded bottles, caps, reflectors, jute bags, custom packaging, banners and brand collateral, produced in Nairobi with free quotes in 24 hours.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  const [services, faqs, s] = await Promise.all([getServices(), getFaqs(), getSettings()]);
  const grid = 'grid gap-5 md:grid-cols-2 xl:grid-cols-3';

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Everything your brand needs, <em className="font-light text-leaf">made well.</em></>}
        intro="From one pull-up banner to a thousand branded polos, we handle design, production and delivery under one roof, with eco-friendly options across the range."
        crumbs={[{ href: '/services', label: 'Services' }]}
      />

      <section className="container-x section-y">
        <Suspense fallback={<ul className={grid}>{services.map((sv) => <li key={sv._id}><ServiceCard service={sv} /></li>)}</ul>}>
          <ServicesBrowser services={services} className={grid} />
        </Suspense>
      </section>

      {faqs.length > 0 && (
        <section className="container-x pb-24 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHeading eyebrow="FAQ" title="Before you order" /></div>
            <div className="lg:col-span-8"><Faq items={faqs} /></div>
          </div>
        </section>
      )}

      <CtaBand heading="Can’t find what you’re looking for?" text="We produce custom items all the time. Tell us your idea and we’ll tell you what’s possible." phone={s.phone} />
    </>
  );
}
