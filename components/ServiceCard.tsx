import Link from 'next/link';
import { ArrowUpRight, Clock, Package } from 'lucide-react';
import type { Service } from '@/lib/types';
import { SmartImage } from './SmartImage';

export const CATEGORY_LABELS: Record<string, string> = {
  merchandise: 'Promotional merchandise',
  packaging: 'Eco packaging',
  identity: 'Identity & print',
};

export function ServiceCard({ service: s }: { service: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white/50 transition-colors duration-500 hover:bg-white">
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-sand">
        <SmartImage image={s.image} fill sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold backdrop-blur">{CATEGORY_LABELS[s.category]}</span>
        {s.priceFrom && <span className="absolute bottom-3 left-3 rounded-full bg-lime px-3 py-1 text-xs font-bold text-forest">from {s.priceFrom}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-tight">{s.title}</h3>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <p className="mt-3 flex-1 text-ink-2">{s.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs font-medium text-muted">
          {s.turnaround && <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{s.turnaround}</span>}
          {s.minOrder && <span className="flex items-center gap-1.5"><Package className="size-3.5" />Min. {s.minOrder}</span>}
        </div>
      </div>
    </Link>
  );
}
