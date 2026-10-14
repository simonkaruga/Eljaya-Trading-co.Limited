import { Check } from 'lucide-react';
import type { Pack } from '@/lib/types';
import { SmartImage } from './SmartImage';
import { Reveal } from './Reveal';
import { AddPack } from './quote/AddPack';

export function Packs({ packs }: { packs: Pack[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {packs.map((p, i) => (
        <Reveal as="li" key={p._id} delay={(i % 4) * 0.06} className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white/60">
          <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-sand">
            <SmartImage image={p.image} fill sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
            {p.badge && <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-xs font-bold text-forest">{p.badge}</span>}
          </div>
          <div className="flex flex-1 flex-col p-5 pt-3">
            <h3 className="text-2xl leading-tight">{p.title}</h3>
            <p className="mt-2 text-sm text-ink-2">{p.tagline}</p>
            <ul className="mt-4 flex-1 space-y-2">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-leaf" />{it}</li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="text-xs font-semibold text-muted">{p.minQty ? `From ${p.minQty} packs` : 'Any quantity'} · fully customisable</span>
            </div>
            <div className="mt-3"><AddPack title={p.title} minQty={p.minQty} image={p.image.src} /></div>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
