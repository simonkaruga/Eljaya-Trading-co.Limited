import type { Metadata } from 'next';
import { getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { QuoteRequest } from '@/components/quote/QuoteRequest';
import { TrustStrip } from '@/components/TrustStrip';

export const metadata: Metadata = {
  title: 'Your Quote Request',
  description: 'Review your selected branded products and request a detailed quote. We reply within 2 hours during business hours.',
  alternates: { canonical: '/quote' },
  robots: { index: false },
};

export default async function QuotePage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Request a quote" title={<>One request, <em className="font-light text-leaf">every product.</em></>} intro="Adjust quantities and branding, tell us your deadline and we’ll send an itemised quote within 24 hours." crumbs={[{ href: '/quote', label: 'Quote' }]} />
      <section className="container-x section-y">
        <QuoteRequest whatsapp={s.whatsapp} />
      </section>
      <TrustStrip className="pb-24 lg:pb-32" />
    </>
  );
}
