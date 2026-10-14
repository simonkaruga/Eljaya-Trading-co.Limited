import type { Metadata } from 'next';
import { getAbout, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { PortableBody } from '@/components/PortableBody';
import { ParallaxImage } from '@/components/ParallaxImage';
import { SectionHeading } from '@/components/SectionHeading';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { Counter } from '@/components/Counter';
import { Reveal } from '@/components/Reveal';
import { CtaBand } from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'About Us: Branding Company in Nairobi Since 2015',
  description: 'Eljaya Trading Co. is a Nairobi branding company producing custom merchandise, corporate apparel and eco-friendly packaging for 500+ Kenyan businesses since 2015.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [a, s] = await Promise.all([getAbout(), getSettings()]);

  return (
    <>
      <PageHero eyebrow="About us" title={a.heading} intro={a.intro} image={a.image} crumbs={[{ href: '/about', label: 'About' }]} />

      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal><p className="eyebrow">Our story</p></Reveal>
            {a.secondaryImage && (
              <ParallaxImage image={a.secondaryImage} className="mt-8 aspect-[4/5] rounded-[2rem]" sizes="(max-width:1024px) 100vw, 40vw" />
            )}
          </div>
          <Reveal className="lg:col-span-7 [&>p:first-child]:mt-0 [&>p:first-child]:font-display [&>p:first-child]:text-3xl [&>p:first-child]:leading-snug [&>p:first-child]:text-ink">
            <PortableBody value={a.story} />
          </Reveal>
        </div>
      </section>

      <section className="container-x">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line lg:grid-cols-4">
          {s.stats.map((st) => (
            <div key={st.label} className="bg-paper p-6 sm:p-10">
              <dt className="text-sm font-medium text-muted">{st.label}</dt>
              <dd className="mt-3 font-display text-5xl sm:text-6xl"><Counter value={st.value} suffix={st.suffix} /></dd>
            </div>
          ))}
        </dl>
      </section>

      {a.values.length > 0 && (
        <section className="container-x section-y">
          <SectionHeading eyebrow="What we stand for" title={<>Principles behind <em className="font-light text-leaf">every order.</em></>} className="mb-14" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.07} className="group rounded-[1.5rem] border border-line bg-white/50 p-7 transition-colors duration-500 hover:bg-forest hover:text-paper">
                <span className="font-display text-5xl text-leaf transition-colors group-hover:text-lime">0{i + 1}</span>
                <h3 className="mt-8 text-2xl">{v.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2 transition-colors group-hover:text-paper/70">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <section id="process" className="scroll-mt-24 bg-sand section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32"><SectionHeading eyebrow="Our process" title={a.processHeading} text={a.processIntro} /></div>
          </div>
          <div className="lg:col-span-7"><ProcessSteps steps={a.processSteps} /></div>
        </div>
      </section>

      <div className="pt-20 lg:pt-28" />
      <CtaBand heading="Let’s build your brand together." text="Visit us at Coffee Plaza, call, or send a brief online. We reply within 2 hours during business hours." phone={s.phone} />
    </>
  );
}
