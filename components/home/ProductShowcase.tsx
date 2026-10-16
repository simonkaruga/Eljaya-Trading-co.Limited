import Link from 'next/link';
import { ArrowUpRight, Package } from 'lucide-react';
import type { Service } from '@/lib/types';
import { SmartImage } from '../SmartImage';
import { Reveal } from '../Reveal';

/**
 * Image-first product grid for the homepage: one hero tile plus seven
 * products and a "see everything" tile, each showing its starting price.
 */
export function ProductShowcase({ services }: { services: Service[] }) {
  const items = [...services.filter((s) => s.featured), ...services.filter((s) => !s.featured)].slice(0, 8);
  const rest = services.length - items.length;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((s, i) => {
        const big = i === 0;
        return (
          <Reveal as="li" key={s._id} delay={(i % 4) * 0.05} className={big ? 'col-span-2 lg:row-span-2' : 'min-w-0'}>
            <Link
              href={`/services/${s.slug}`}
              className={`group relative flex overflow-hidden lg:h-full rounded-[1.25rem] bg-sand sm:rounded-[1.5rem] ${big ? 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto' : 'aspect-[4/5]'}`}
            >
              <SmartImage
                image={s.image}
                fill
                sizes={big ? '(max-width:1024px) 100vw, 50vw' : '(max-width:1024px) 50vw, 25vw'}
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent" />

              {s.priceFrom && (
                <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-[0.7rem] font-bold text-forest sm:left-4 sm:top-4 sm:text-xs">
                  from {s.priceFrom}
                </span>
              )}
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-lime sm:right-4 sm:top-4 sm:size-10">
                <ArrowUpRight className="size-4" />
              </span>

              <div className="relative mt-auto w-full p-3.5 text-white sm:p-5">
                <h3 className={`leading-tight [text-shadow:0_1px_12px_rgb(0_0_0/0.4)] ${big ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-lg sm:text-2xl'}`}>{s.title}</h3>
                {big && <p className="mt-3 hidden max-w-md text-white/85 sm:block">{s.excerpt}</p>}
                <p className="mt-2 flex items-center gap-1.5 text-[0.72rem] font-medium text-white/80 sm:text-sm">
                  {s.minOrder && <><Package className="size-3.5" /> Min. {s.minOrder}</>}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lime sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:max-h-8 sm:group-hover:opacity-100 sm:text-sm">
                  Get instant price <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
      <Reveal as="li" delay={0.15} className="min-w-0">
        <Link href="/services" className="group flex h-full min-h-56 flex-col justify-between rounded-[1.25rem] bg-forest p-4 text-paper sm:rounded-[1.5rem] sm:p-6">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-lime">Full catalogue</span>
          <span>
            <span className="block font-display text-2xl leading-tight sm:text-3xl">
              {rest > 0 ? `+${rest} more products` : 'See every product'}
            </span>
            <span className="mt-2 block text-sm text-paper/70">Packaging, laundry bags, stationery & more</span>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-forest transition-colors group-hover:bg-paper">
              Browse all <ArrowUpRight className="size-4" />
            </span>
          </span>
        </Link>
      </Reveal>
    </ul>
  );
}
