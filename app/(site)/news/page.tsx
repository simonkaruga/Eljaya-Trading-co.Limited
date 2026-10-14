import type { Metadata } from 'next';
import { getPosts, getSettings } from '@/lib/content';
import { PageHero } from '@/components/PageHero';
import { PostCard } from '@/components/PostCard';
import { Reveal } from '@/components/Reveal';
import { CtaBand } from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'News & Branding Insights',
  description: 'Company news, new products, project spotlights and practical guides on branded merchandise, corporate gifting and eco-friendly packaging in Kenya.',
  alternates: { canonical: '/news' },
};

export default async function NewsPage() {
  const [posts, s] = await Promise.all([getPosts(), getSettings()]);
  const [first, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="News & insights"
        title={<>What’s new <em className="font-light text-leaf">at Eljaya.</em></>}
        intro="Company news, new products, project spotlights and practical guides for Kenyan businesses."
        crumbs={[{ href: '/news', label: 'News' }]}
      />
      <section className="container-x section-y">
        {!first ? (
          <p className="text-lg text-ink-2">No posts yet, check back soon.</p>
        ) : (
          <>
            <Reveal><PostCard post={first} large /></Reveal>
            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => <Reveal key={p._id} delay={(i % 3) * 0.07}><PostCard post={p} /></Reveal>)}
              </div>
            )}
          </>
        )}
      </section>
      <CtaBand heading="Have a question we haven’t covered?" text="Our team is happy to advise on products, pricing and timelines." phone={s.phone} />
    </>
  );
}
