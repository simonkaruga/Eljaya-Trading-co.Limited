'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/lib/types';
import { SmartImage } from '../SmartImage';

/**
 * Editorial service index: on desktop, hovering a row floats that service's
 * photo beside the cursor. On touch screens it becomes a swipeable card rail.
 */
export function ServiceList({ services }: { services: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

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
              <Link href={`/services/${s.slug}`} className="group grid grid-cols-12 items-center gap-6 py-7">
                <span className="col-span-1 text-sm font-medium text-muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`col-span-6 text-[2.1rem] leading-tight transition-all duration-500 ease-out-expo ${active === null || active === i ? 'text-ink' : 'text-ink/25'} group-hover:translate-x-3`}>
                  {s.title}
                </h3>
                <p className={`col-span-3 text-sm leading-relaxed transition-colors duration-500 ${active === null || active === i ? 'text-ink-2' : 'text-ink/25'}`}>{s.excerpt}</p>
                <span className="col-span-2 flex items-center justify-end gap-4">
                  {s.priceFrom && <span className="text-sm font-semibold text-leaf">from {s.priceFrom.replace(/^from\s*/i, '')}</span>}
                  <span className="grid size-11 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
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
                className="relative -ml-36 -mt-48 h-[22rem] w-72 overflow-hidden rounded-2xl shadow-2xl shadow-forest/30"
              >
                {services.map((s, i) => (
                  <motion.div key={s._id} className="absolute inset-0" animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }} transition={{ duration: 0.5 }}>
                    <SmartImage image={s.image} fill sizes="288px" className="object-cover" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile / tablet */}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden">
        {services.map((s, i) => (
          <li key={s._id} className="w-[78%] shrink-0 snap-start sm:w-[45%]">
            <Link href={`/services/${s.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <SmartImage image={s.image} fill sizes="(max-width:640px) 80vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold backdrop-blur">{String(i + 1).padStart(2, '0')}</span>
                {s.priceFrom && <span className="absolute bottom-4 left-4 rounded-full bg-lime px-3 py-1 text-xs font-bold text-forest">from {s.priceFrom}</span>}
              </div>
              <h3 className="mt-4 text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-2">{s.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
