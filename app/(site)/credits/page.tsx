import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { photoCredits } from '@/lib/photo-credits';

export const metadata: Metadata = {
  title: 'Photo credits',
  description: 'Credits and licences for the photographs used on this website.',
  alternates: { canonical: '/credits' },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Photo credits" intro="With thanks to the photographers whose work appears on this site." crumbs={[{ href: '/credits', label: 'Photo credits' }]} />
      <section className="container-x section-y">
        <div className="max-w-4xl">
          <p className="text-ink-2">
            Product photographs are Eljaya Trading Co.’s own. The photographs below are used under the licences shown;
            follow a link to see the original and its licence.
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {photoCredits.map((c) => (
              <li key={c.file} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm">
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-leaf">{c.title}</a>
                <span className="text-ink-2">
                  {c.creator ? <>{c.creator} · </> : null}
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-leaf">{c.license}</a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
