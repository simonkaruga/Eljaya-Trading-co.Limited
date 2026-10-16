import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { getSettings, getTestimonials } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { ReviewForm } from '@/components/ReviewForm';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { GoogleIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Client Reviews',
  description: 'What Kenyan businesses say about Eljaya Trading Co.’s branded merchandise, uniforms and eco packaging, and leave your own review.',
  alternates: { canonical: '/reviews' },
};

export default async function ReviewsPage() {
  const [reviews, s] = await Promise.all([getTestimonials(), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={<>What our clients <em className="font-light text-leaf">say.</em></>}
        intro="Honest feedback from businesses we’ve branded for across Kenya. Worked with us? We’d love to hear from you."
        crumbs={[{ href: '/reviews', label: 'Reviews' }]}
      >
        {s.googleReviewUrl && (
          <a href={s.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-line bg-white/60 px-4 py-3 hover:bg-white">
            <span className="grid size-9 place-items-center rounded-full bg-white shadow-sm"><GoogleIcon className="size-5" /></span>
            <span className="text-sm"><strong>{s.rating?.toFixed(1)} ★ on Google</strong><span className="block text-muted">See all Google reviews</span></span>
          </a>
        )}
      </PageHero>

      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {reviews.length ? (
              <ul className="columns-1 gap-5 sm:columns-2 [&>li]:mb-5">
                {reviews.map((r, i) => (
                  <Reveal as="li" key={r._id} delay={(i % 4) * 0.05} className="break-inside-avoid rounded-[1.5rem] border border-line bg-white/60 p-6">
                    <div className="flex gap-0.5 text-leaf" aria-label={`${r.rating ?? 5} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, k) => <Star key={k} className={`size-4 ${k < (r.rating ?? 5) ? 'fill-lime' : 'text-ink/20'}`} />)}
                    </div>
                    <blockquote className="mt-4 leading-relaxed text-ink">“{r.quote}”</blockquote>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-lime text-sm font-bold text-forest">
                        {r.photo ? <SmartImage image={r.photo} fill sizes="40px" className="object-cover" /> : r.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </span>
                      <span>
                        <span className="block font-semibold">{r.name}</span>
                        {r.role && <span className="text-sm text-muted">{r.role}</span>}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <p className="text-ink-2">No reviews yet. Be the first!</p>
            )}
          </div>
          <div className="lg:col-span-5">
            <div id="write" className="scroll-mt-28 lg:sticky lg:top-28"><ReviewForm googleReviewUrl={s.googleReviewUrl} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
