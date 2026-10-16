import type { Metadata } from 'next';
import {
  getAbout, getClientLogos, getFaqs, getHome, getPacks, getProjects, getServices, getSettings, getTestimonials,
} from '@/lib/content';
import { Packs } from '@/components/Packs';
import { TrustStrip } from '@/components/TrustStrip';
import { HeroShowcase } from '@/components/home/HeroShowcase';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { LogoPreview } from '@/components/home/LogoPreview';
import { ClientLogos } from '@/components/ClientLogos';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { Testimonials } from '@/components/home/Testimonials';
import { PhotoStrip } from '@/components/home/PhotoStrip';
import { Marquee } from '@/components/Marquee';
import { Counter } from '@/components/Counter';
import { SectionHeading } from '@/components/SectionHeading';
import { ProjectCard } from '@/components/ProjectCard';
import { Faq } from '@/components/Faq';
import { CtaBand } from '@/components/CtaBand';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [s, home, about, services, projects, testimonials, faqs, packs, logos] = await Promise.all([
    getSettings(), getHome(), getAbout(), getServices(), getProjects(), getTestimonials(), getFaqs(), getPacks(), getClientLogos(),
  ]);

  const chips = [...services.filter((x) => x.featured), ...services.filter((x) => !x.featured)]
    .filter((x) => x.priceFrom)
    .map(({ title, slug, image, priceFrom }) => ({ title, slug, image, priceFrom }));
  const featuredProjects = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <>
      <HeroShowcase
        slides={home.heroSlides}
        words={home.marquee.filter((w) => w.length <= 17)}
        chips={chips}
        rating={s.rating}
        reviewCount={s.reviewCount}
        reviewUrl={s.googleReviewUrl}
        whatsapp={s.whatsapp}
      />

      {/* Dark product ticker: a colour shift that signals "the catalogue starts here" */}
      <div className="bg-forest py-6 text-paper">
        <Marquee items={home.marquee} className="font-display text-3xl sm:text-5xl [&_svg]:text-lime" duration={45} />
      </div>

      {/* Client logo wall: shows automatically once logos are added in the studio */}
      <ClientLogos logos={logos} />

      {/* Products first: what clients came for */}
      <section id="products" className="container-x scroll-mt-24 section-y">
        <SectionHeading
          eyebrow="Shop by product"
          title={<>What would you like <em className="font-light text-leaf">to brand?</em></>}
          text="Tap any product for real KSh prices and an instant estimate. No obligation, reply within 2 hours."
          className="mb-10 lg:mb-14"
        >
          <Button href="/services" variant="dark">All products</Button>
        </SectionHeading>
        <ProductShowcase services={services} />
      </section>

      <TrustStrip />

      {/* Signature interactive moment: see your logo on real products */}
      <section id="preview" className="relative mt-24 scroll-mt-24 overflow-hidden bg-sand section-y lg:mt-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Try it now"
            title={<>See your logo <em className="font-light text-leaf">on our products.</em></>}
            text="Drop in your logo and watch it appear on T-shirts, polos, bags, mugs, caps and bottles, in any colour. Click a product to see it up close."
            className="mb-12 lg:mb-16"
          />
          <LogoPreview whatsapp={s.whatsapp} />
        </div>
      </section>

      {/* Projects */}
      {featuredProjects.length > 0 && (
        <section className="container-x section-y">
          <SectionHeading eyebrow="Recent work" title={<>Jobs we’ve delivered <em className="font-light text-leaf">across Kenya.</em></>} text="Uniforms, gift sets, packaging and event branding produced for real businesses, from brief to doorstep." className="mb-14">
            <Button href="/portfolio" variant="outline">View portfolio</Button>
          </SectionHeading>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
            {featuredProjects.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.08} className={i === 0 ? 'md:col-span-2 lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'}>
                <ProjectCard project={p} aspect={i === 0 ? 'aspect-[4/5] lg:aspect-[5/6]' : 'aspect-[16/11]'} sizes={i === 0 ? '(max-width:1024px) 100vw, 58vw' : '(max-width:768px) 100vw, 42vw'} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Who we are, in one compact band */}
      <section className="relative overflow-hidden bg-forest py-16 text-paper lg:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-20 size-[30rem] rounded-full bg-lime/10 blur-3xl" />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow !text-lime">Who we are</p>
            <h2 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl">{home.introHeading}</h2>
            <div className="mt-6"><Button href="/about" variant="light">Our story</Button></div>
          </Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-white/10 lg:col-span-7 lg:grid-cols-4">
            {s.stats.map((st, i) => (
              <Reveal key={st.label} delay={i * 0.06} className="bg-forest p-5 sm:p-6">
                <dd className="font-display text-4xl font-medium tracking-tight sm:text-5xl [&_.text-leaf]:text-lime">
                  <Counter value={st.value} suffix={st.suffix} />
                </dd>
                <dt className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper/60">{st.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Gift packs */}
      {packs.length > 0 && (
        <section id="packs" className="scroll-mt-24 section-y">
          <div className="container-x">
            <SectionHeading eyebrow="Ready-made gift packs" title={<>Bundles that make <em className="font-light text-leaf">ordering easy.</em></>} text="Pick a pack, tell us how many and we’ll brand every item to match. Each pack is fully customisable." className="mb-14">
              <Button href="/quote" variant="dark">View my quote</Button>
            </SectionHeading>
            <Packs packs={packs} />
          </div>
        </section>
      )}

      {/* Photo strip */}
      {home.showcase.length >= 4 && (
        <section className="section-y" aria-label="Gallery">
          <div className="container-x mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <p className="eyebrow">In the making</p>
              <h2 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">From thread to <em className="font-light text-leaf">finished brand.</em></h2>
            </Reveal>
            <Reveal delay={0.1}><p className="max-w-sm text-ink-2">Apparel, drinkware, stationery and packaging, printed, stitched and checked before it reaches you.</p></Reveal>
          </div>
          <PhotoStrip images={home.showcase} />
        </section>
      )}

      {/* Process */}
      <section className="bg-sand section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="How it works" title={about.processHeading} text={about.processIntro} />
              <Reveal delay={0.15} className="mt-8"><Button href="/contact">Start your brief</Button></Reveal>
            </div>
          </div>
          <div className="lg:col-span-7"><ProcessSteps steps={about.processSteps} /></div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="overflow-x-clip bg-forest text-paper section-y">
          <div className="container-x">
            <p className="eyebrow !text-lime">Client stories</p>
            <div className="mt-16"><Testimonials items={testimonials} /></div>
            <div className="mt-14 flex flex-wrap gap-3 border-t border-white/10 pt-10">
              <Button href="/reviews" variant="light">Read all reviews</Button>
              <Button href="/reviews#write" variant="ghost-light" icon={false}>Write a review</Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="container-x section-y">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Questions, answered." text="Can’t find what you need? Call or WhatsApp us and we’ll reply within 2 hours during business hours." />
            </div>
            <div className="lg:col-span-8"><Faq items={faqs} /></div>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
        </section>
      )}

      <CtaBand heading={home.ctaHeading} text={home.ctaText} phone={s.phone} />
    </>
  );
}
