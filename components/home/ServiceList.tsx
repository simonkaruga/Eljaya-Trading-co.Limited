'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/lib/types';
import { SmartImage } from '../SmartImage';
import { Reveal } from '../Reveal';

/**
 * Editorial service index. Desktop: each row shows its photo, and hovering
 * floats a larger version beside the cursor. Phones/tablets: a two-column
 * grid of photo cards so every product is visible at a glance.
 */
export function ServiceList({ services }: { services: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });
  const dim = (i: number) => active !== null && active !== i;

  return (
    <>
      {/* Desktop */}
      <div
        className="relative hidden lg:block"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onMouseLeave={() => setActive(null)}
      >
        <ul className="border-t border-line">
          {services.map((s, i) => (
            <li key={s._id} onMouseEnter={() => setActive(i)} className="border-b border-line">
              <Link href={`/services/${s.slug}`} className="group grid grid-cols-12 items-center gap-6 py-5">
                <span className="col-span-1 text-sm font-medium text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className={`relative col-span-2 aspect-[4/3] overflow-hidden rounded-xl bg-sand transition-opacity duration-500 ${dim(i) ? 'opacity-40' : ''}`}>
                  <SmartImage image={s.image} fill sizes="200px" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110" />
                </span>
                <h3 className={`col-span-4 text-[1.9rem] leading-tight transition-all duration-500 ease-out-expo group-hover:translate-x-2 ${dim(i) ? 'text-ink/25' : 'text-ink'}`}>
                  {s.title}
                </h3>
                <p className={`col-span-3 text-sm leading-relaxed transition-colors duration-500 ${dim(i) ? 'text-ink/25' : 'text-ink-2'}`}>{s.excerpt}</p>
                <span className="col-span-2 flex items-center justify-end gap-4">
                  {s.priceFrom && <span className="text-sm font-semibold text-leaf">from {s.priceFrom}</span>}
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                    <ArrowUpRight className="size-5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-10">
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key="float"
                initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative ml-8 -mt-40 h-80 w-64 overflow-hidden rounded-2xl shadow-2xl shadow-forest/30"
              >
                {services.map((s, i) => (
                  <motion.div key={s._id} className="absolute inset-0" animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }} transition={{ duration: 0.5 }}>
                    <SmartImage image={s.image} fill sizes="256px" className="object-cover" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Phones & tablets */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:hidden">
        {services.map((s, i) => (
          <Reveal as="li" key={s._id} delay={(i % 2) * 0.06}>
            <Link href={`/services/${s.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <SmartImage image={s.image} fill sizes="(max-width:640px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-active:scale-105" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest/60 to-transparent" />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-paper/90 px-2 py-0.5 text-[0.7rem] font-semibold backdrop-blur">{String(i + 1).padStart(2, '0')}</span>
                {s.priceFrom && (
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-lime px-2.5 py-1 text-[0.7rem] font-bold text-forest">from {s.priceFrom}</span>
                )}
                <span className="absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-paper text-ink">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <h3 className="mt-3 text-lg leading-snug sm:text-xl">{s.title}</h3>
              <p className="mt-1 line-clamp-2 text-[0.8rem] leading-relaxed text-ink-2 sm:text-sm">{s.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
