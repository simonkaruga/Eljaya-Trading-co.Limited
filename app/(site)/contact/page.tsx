import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { getFaqs, getServices, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { Faq } from '@/components/Faq';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { GoogleIcon, WhatsAppIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact Us: Get a Free Quote in 24 Hours',
  description: 'Get a free quote for branded merchandise, apparel or eco packaging. Visit us at Coffee Plaza, Nairobi, call +254 718 146 386 or WhatsApp. We reply within 2 hours.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const [s, services, faqs] = await Promise.all([getSettings(), getServices(), getFaqs()]);
  const tel = s.phone.replace(/\s/g, '');

  const channels = [
    { icon: Phone, label: 'Call us', value: s.phone, href: `tel:${tel}` },
    { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${s.whatsapp}` },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: 'Visit', value: s.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery)}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let’s talk about <em className="font-light text-leaf">your brand.</em></>}
        intro="Tell us what you need, how many and when. We reply within 2 hours during business hours, with a detailed quote within 24 hours."
        crumbs={[{ href: '/contact', label: 'Contact' }]}
      />

      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 [&>li]:min-w-0">
              {channels.map(({ icon: Icon, label, value, href }, i) => (
                <Reveal as="li" key={label} delay={i * 0.05}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-2xl border border-line bg-white/50 p-5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lime text-forest"><Icon className="size-5" /></span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted group-hover:text-paper/60">{label}</span>
                      <span className="mt-0.5 block truncate font-semibold">{value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-2">
              <span className="flex items-center gap-2"><Clock className="size-4 text-leaf" />{s.hours}</span>
              {s.googleReviewUrl && (
                <a href={s.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold hover:text-leaf">
                  <GoogleIcon className="size-4" /> {s.rating?.toFixed(1)} ★ on Google · Leave a review
                </a>
              )}
            </div>
          </div>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
            <div className="rounded-[2rem] border border-line bg-sand/60 p-5 sm:p-8">
              <h2 className="mb-6 text-3xl">Request a free quote</h2>
              <Suspense>
                <ContactForm services={services.map((x) => x.title)} whatsapp={s.whatsapp} />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x">
        <div className="overflow-hidden rounded-[2rem] border border-line">
          <iframe
            title={`Map showing ${s.address}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`}
            className="block h-[420px] w-full grayscale-[40%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="container-x section-y">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4"><SectionHeading eyebrow="FAQ" title="Good to know" /></div>
            <div className="lg:col-span-8"><Faq items={faqs} /></div>
          </div>
        </section>
      )}
    </>
  );
}
