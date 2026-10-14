'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { Industry } from '@/lib/types';
import { SmartImage } from '../SmartImage';

/**
 * Desktop: the section pins while vertical scrolling slides the industry
 * cards sideways. Mobile: a regular swipeable rail.
 */
export function IndustryScroller({ industries, intro }: { industries: Industry[]; intro: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the card track must travel so the last card ends inside the viewport
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 48));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, reduce ? 0 : -distance]);

  const card = (ind: Industry, i: number) => (
    <article key={ind._id} className="group relative h-full w-full overflow-hidden rounded-[1.75rem] bg-forest text-white">
      <SmartImage image={ind.image} fill sizes="(max-width:1024px) 80vw, 30vw" className="object-cover opacity-90 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
      <span className="absolute left-6 top-6 font-display text-sm text-white/70">{String(i + 1).padStart(2, '0')}</span>
      {ind.stat && <span className="absolute right-6 top-6 rounded-full bg-lime px-3 py-1 text-xs font-bold text-forest">{ind.stat}</span>}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <h3 className="text-3xl leading-tight">{ind.title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75 transition-all duration-500 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {ind.description}
        </p>
      </div>
    </article>
  );

  return (
    <>
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${Math.max(200, industries.length * 45)}vh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16">
          <div className="container-x mb-10">{intro}</div>
          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
            {industries.map((ind, i) => (
              <div key={ind._id} className="h-[52vh] max-h-[520px] w-[30vw] max-w-[420px] shrink-0">{card(ind, i)}</div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="section-y lg:hidden">
        <div className="container-x mb-10">{intro}</div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8">
          {industries.map((ind, i) => (
            <div key={ind._id} className="aspect-[3/4] w-[78%] shrink-0 snap-start sm:w-[45%]">{card(ind, i)}</div>
          ))}
        </div>
      </div>
    </>
  );
}
