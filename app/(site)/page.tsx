import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import {
  getAbout, getClientLogos, getFaqs, getHome, getIndustries, getPosts, getProjects, getServices, getSettings, getTestimonials,
} from '@/lib/content';
import { Hero } from '@/components/home/Hero';
import { ServiceList } from '@/components/home/ServiceList';
import { IndustryScroller } from '@/components/home/IndustryScroller';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { Testimonials } from '@/components/home/Testimonials';
import { PhotoStrip } from '@/components/home/PhotoStrip';
import { Marquee } from '@/components/Marquee';
import { Counter } from '@/components/Counter';
import { SectionHeading } from '@/components/SectionHeading';
import { ParallaxImage } from '@/components/ParallaxImage';
import { ProjectCard } from '@/components/ProjectCard';
import { PostCard } from '@/components/PostCard';
import { ClientLogos } from '@/components/ClientLogos';
import { Faq } from '@/components/Faq';
import { CtaBand } from '@/components/CtaBand';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { GoogleIcon } from '@/components/icons';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [s, home, about, services, industries, projects, testimonials, logos, posts, faqs] = await Promise.all([
    getSettings(), getHome(), getAbout(), getServices(), getIndustries(), getProjects(), getTestimonials(), getClientLogos(), getPosts(), getFaqs(),
  ]);

  const featuredServices = services.filter((x) => x.featured);
  const shownServices = (featuredServices.length >= 4 ? featuredServices : services).slice(0, 7);
  const featuredProjects = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <>
      <Hero slides={home.heroSlides} rating={s.rating} reviewCount={s.reviewCount} reviewUrl={s.googleReviewUrl} tagline={s.tagline} />

      <Marquee items={home.marquee} className="mt-10 py-4 font-display text-3xl text-ink/80 sm:text-5xl" duration={55} />

      {/* Intro + numbers */}
      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 text-balance text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]">{home.introHeading}</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end gap-8 lg:col-span-5">
            <p className="text-lg leading-relaxed text-ink-2">{home.introText}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/about" variant="outline">Our story</Button>
              {s.googleReviewUrl && (
                <a href={s.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-2 hover:text-leaf">
                  <GoogleIcon className="size-4" /> Rated {s.rating?.toFixed(1)} on Google
                </a>
              )}
            </div>
          </Reveal>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line lg:grid-cols-4">
          {s.stats.map((st, i) => (
            <Reveal key={st.label} delay={i * 0.08} className="bg-paper p-6 sm:p-10">
              <dt className="text-sm font-medium text-muted">{st.label}</dt>
              <dd className="mt-3 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                <Counter value={st.value} suffix={st.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section className="container-x pb-24 lg:pb-32">
        <SectionHeading eyebrow="What we make" title={<>Branded products, <em className="font-light text-leaf">made to be used.</em></>} className="mb-14">
          <Button href="/services" variant="dark">All services</Button>
        </SectionHeading>
        <ServiceList services={shownServices} />
      </section>

      {/* Photo strip */}
      {home.showcase.length >= 4 && (
        <section className="pb-24 lg:pb-32" aria-label="Gallery">
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

      {/* Industries */}
      {industries.length > 0 && (
        <section className="bg-sand">
          <IndustryScroller
            industries={industries}
            intro={
              <SectionHeading
                eyebrow="Industries we serve"
                title={<>From boardrooms to <em className="font-light text-leaf">boutiques.</em></>}
                text="We’ve branded for corporates, retailers, hotels, hospitals, schools and NGOs, so we know what works in each world."
              />
            }
          />
        </section>
      )}

      {/* Eco */}
      <section className="container-x section-y">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <ParallaxImage image={home.ecoImage} className="aspect-[4/5] rounded-[2rem]" sizes="(max-width:1024px) 100vw, 50vw" />
            <Reveal delay={0.2} className="absolute -bottom-6 right-4 max-w-[15rem] rounded-2xl bg-lime p-5 text-forest shadow-xl sm:-right-6 sm:p-6">
              <p className="font-display text-4xl">100%</p>
              <p className="mt-1 text-sm font-medium">biodegradable options across our bag & packaging range</p>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Sustainability" title={home.ecoHeading} text={home.ecoText} />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {home.ecoPoints.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 0.06} className="flex gap-3 rounded-2xl border border-line bg-white/50 p-5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-leaf text-white"><Check className="size-4" /></span>
                  <span className="text-[0.95rem] font-medium leading-snug">{p}</span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-10"><Button href="/services?category=packaging" variant="dark">Explore eco packaging</Button></div>
          </div>
        </div>
      </section>

      {/* Projects */}
      {featuredProjects.length > 0 && (
        <section className="container-x pb-24 lg:pb-32">
          <SectionHeading eyebrow="Selected work" title={<>Work we’re <em className="font-light text-leaf">proud of.</em></>} className="mb-14">
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
          </div>
        </section>
      )}

      <ClientLogos logos={logos} />

      {/* News */}
      {posts.length > 0 && (
        <section className="container-x section-y">
          <SectionHeading eyebrow="News & insights" title={<>What’s happening <em className="font-light text-leaf">at Eljaya.</em></>} className="mb-14">
            <Button href="/news" variant="outline">All articles</Button>
          </SectionHeading>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p._id} delay={i * 0.08}><PostCard post={p} /></Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="container-x pb-24 lg:pb-32">
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
