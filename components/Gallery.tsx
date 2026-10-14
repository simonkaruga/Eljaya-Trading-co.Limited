'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { Img } from '@/lib/types';
import { SmartImage } from './SmartImage';

/** Photo grid with a full-screen, keyboard- and swipe-friendly lightbox. */
export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [open, step]);

  if (!n) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src + i} className={i % 5 === 0 ? 'col-span-2 row-span-2' : ''}>
            <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-sand" aria-label={`Open photo ${i + 1} of ${n}`}>
              <SmartImage image={img} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
              <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-paper/90 opacity-0 transition-opacity group-hover:opacity-100"><Expand className="size-4" /></span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title}: photo ${open + 1} of ${n}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-forest/95 p-4 backdrop-blur"
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) step(info.offset.x < 0 ? 1 : -1); }}
              className="relative h-[80svh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage image={images[open]} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
            {n > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-lime hover:text-forest sm:grid"><ArrowLeft /></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-lime hover:text-forest sm:grid"><ArrowRight /></button>
                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">{open + 1} / {n}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
