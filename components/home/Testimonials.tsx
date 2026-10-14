'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { SmartImage } from '../SmartImage';

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const n = items.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setTimeout(() => { setDir(1); setI((v) => (v + 1) % n); }, 8000);
    return () => clearTimeout(t);
  }, [i, n]);

  if (!n) return null;
  const t = items[i];
  const step = (d: number) => { setDir(d); setI((v) => (v + d + n) % n); };
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
      <div className="relative min-h-[19rem] sm:min-h-[16rem] lg:col-span-9">
                <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span aria-hidden className="pointer-events-none absolute -top-6 right-0 font-display text-[9rem] leading-none text-lime/20 sm:text-[14rem] lg:-right-40">”</span>
            <div className="flex gap-1 text-lime">{Array.from({ length: t.rating ?? 5 }, (_, k) => <Star key={k} className="size-5 fill-current" />)}</div>
            <blockquote className="mt-6 text-balance font-display text-2xl leading-snug sm:text-3xl lg:text-[2.6rem] lg:leading-[1.2]">
              {t.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-lime font-bold text-forest">
                {t.photo ? <SmartImage image={t.photo} fill sizes="48px" className="object-cover" /> : initials}
              </span>
              <span>
                <span className="block font-semibold">{t.name}</span>
                {t.role && <span className="text-sm text-paper/60">{t.role}</span>}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <div className="flex items-center gap-4 lg:col-span-3 lg:justify-end">
          <span className="font-display text-lg tabular-nums text-paper/60">
            <span className="text-paper">{String(i + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => step(-1)} aria-label="Previous testimonial" className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:bg-lime hover:text-forest">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next testimonial" className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:bg-lime hover:text-forest">
            <ArrowRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
