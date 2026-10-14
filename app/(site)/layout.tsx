import { getServices, getSettings } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services] = await Promise.all([getSettings(), getServices()]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE_URL,
    name: 'Eljaya Trading Co. Limited',
    url: SITE_URL,
    image: `${SITE_URL}/logo-mark.png`,
    logo: `${SITE_URL}/logo-mark.png`,
    telephone: s.phone.replace(/\s/g, ''),
    email: s.email,
    priceRange: '$$',
    foundingDate: '2015',
    description: s.seoDescription,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'Nairobi', addressCountry: 'KE' },
    geo: { '@type': 'GeoCoordinates', latitude: -1.286389, longitude: 36.817223 },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' }],
    areaServed: [{ '@type': 'City', name: 'Nairobi' }, { '@type': 'Country', name: 'Kenya' }],
    sameAs: Object.values(s.socials).filter(Boolean),
    ...(s.rating && s.reviewCount
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: s.rating, reviewCount: s.reviewCount, bestRating: 5 } }
      : {}),
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <AnnouncementBar announcement={s.announcement} />
      <Header name={s.name} tagline={s.tagline} phone={s.phone} />
      <main id="main">{children}</main>
      <Footer settings={s} services={services} />
      <WhatsAppFloat number={s.whatsapp} />
      <div aria-hidden className="grain" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
