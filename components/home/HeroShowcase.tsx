'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import type { HeroSlide, Img } from '@/lib/types';
import { SmartImage } from '../SmartImage';
import { GoogleIcon, LeafMark, WhatsAppIcon } from '../icons';

const ease = [0.16, 1, 0.3, 1] as const;

type Chip = { title: string; slug: string; image: Img; priceFrom?: string };

/**
 * Editorial split hero: monumental type with a rotating product word on the
 * left, a cross-fading photo collage with floating price cards on the right.
 * Words come from the homepage "scrolling product words", photos from the
 * slideshow, price cards from products marked "show on homepage".
 */
export function HeroShowcase({
  slides, words, chips, rating, reviewCount, reviewUrl, whatsapp,
}: { slides: HeroSlide[]; words: string[]; chips: Chip[]; rating?: number; reviewCount?: number; reviewUrl?: string; whatsapp: string }) {
  const reduce = useReducedMotion();
  const [w, setW] = useState(0);
  const [img, setImg] = useState(0);
  const list = words.length ? words : ['your products'];

  useEffect(() => {
    if (reduce) return;
    const a = setInterval(() => setW((v) => (v + 1) % list.length), 2400);
    const b = setInterval(() => setImg((v) => (v + 1) % Math.max(1, slides.length)), 5200);
    return () => { clearInterval(a); clearInterval(b); };
  }, [list.length, slides.length, reduce]);

  // Gentle pointer parallax for the floating cards
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const nearX = useTransform(sx, (v) => v * 18);
  const nearY = useTransform(sy, (v) => v * 18);
  const farX = useTransform(sx, (v) => v * -10);
  const farY = useTransform(sy, (v) => v * -10);

  const lead = slides[0];
  // Scale the rotating line so the longest product name always fits on one line
  const fit = Math.min(1, 11 / Math.max(...list.map((x) => x.length)));
  const [c1, c2] = chips;

  return (
    <section
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* soft brand glow */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[42rem] rounded-full bg-lime/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 size-[34rem] rounded-full bg-leaf/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 pb-16 pt-6 lg:gap-12 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-6">
        {/* Copy */}
        <div className="lg:col-span-7">
          {rating && (
            <motion.a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur hover:bg-white"
            >
              <span className="grid size-7 place-items-center rounded-full bg-white shadow-sm"><GoogleIcon className="size-4" /></span>
              <span className="flex text-leaf">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-3.5 fill-lime" />)}</span>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted">{reviewCount ? `${reviewCount} Google reviews` : 'on Google'}</span>
            </motion.a>
          )}

          <h1 className="mt-7 font-display text-[clamp(2.6rem,7.4vw,6.6rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            {['Your brand on', null, 'that people keep.'].map((line, i) => (
              <span
                key={i}
                className="block overflow-hidden pb-[0.06em]"
                style={line === null ? { fontSize: `${fit}em`, lineHeight: 1.05 } : undefined}
              >
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease }}
                >
                  {line ?? (
                    <span className="relative inline-flex items-baseline">
                      <span className="relative inline-grid">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.em
                            key={w}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ duration: 0.7, ease }}
                            className="col-start-1 row-start-1 whitespace-nowrap font-light italic text-leaf"
                          >
                            {list[w].toLowerCase()}
                          </motion.em>
                        </AnimatePresence>
                      </span>
                    </span>
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg"
          >
            {lead?.text ?? 'Custom apparel, eco-friendly packaging and brand essentials, made in Nairobi and delivered across Kenya.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="#products" className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition-colors hover:bg-leaf">
              See products & prices
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
            <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi Eljaya, I would like a quote for…')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/60 px-7 py-4 font-semibold transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white">
              <WhatsAppIcon className="size-5" /> Quote on WhatsApp
            </a>
          </motion.div>

          {chips.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-2"
            >
              <li className="mr-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">Popular</li>
              {chips.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/services/${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 py-1 pl-1 pr-3.5 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                    <span className="relative size-7 overflow-hidden rounded-full bg-sand"><SmartImage image={c.image} fill sizes="28px" className="object-cover" /></span>
                    {c.title.split(/ &| and|,/)[0].replace(/^Branded /, '')}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        {/* Collage */}
        <div className="relative order-first px-4 sm:px-8 lg:order-none lg:col-span-5 lg:px-0">
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 2rem)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
            style={{ x: farX, y: farY }}
            className="relative mx-auto aspect-[5/4] w-full max-w-md overflow-hidden sm:aspect-[4/5] rounded-[2rem] bg-sand shadow-[0_40px_80px_-30px_rgb(15_36_26/0.45)] lg:ml-auto lg:max-w-none"
          >
            <AnimatePresence initial={false}>
              <motion.div key={img} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease }}>
                {slides[img] && <SmartImage image={slides[img].image} fill priority={img === 0} sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute right-5 top-5 flex gap-1.5">
              {slides.map((_, i) => (
                <button key={i} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${i === img ? 'w-6 bg-lime' : 'w-1.5 bg-white/70'}`} />
              ))}
            </div>
          </motion.div>

          {/* Floating price cards */}
          {c1 && (
            <motion.div style={{ x: nearX, y: nearY }} className="absolute -left-2 top-[12%] sm:-left-8 lg:-left-16">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.9, ease }}>
                <FloatCard chip={c1} />
              </motion.div>
            </motion.div>
          )}
          {c2 && (
            <motion.div style={{ x: nearX, y: nearY }} className="absolute -right-2 bottom-[14%] sm:-right-6">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 1.1, ease }}>
                <FloatCard chip={c2} delay={1.5} />
              </motion.div>
            </motion.div>
          )}

          {/* Rotating badge */}
          <div aria-hidden className="absolute -bottom-8 left-6 hidden size-28 sm:block lg:-left-6">
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow text-ink">
              <defs><path id="hb" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <text fontSize="8.4" fontWeight="700" fill="currentColor"><textPath href="#hb" textLength={238} lengthAdjust="spacing">QUOTE IN 24 HOURS · MADE IN NAIROBI · </textPath></text>
            </svg>
            <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-lime text-forest"><LeafMark className="size-5" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ chip, delay = 0 }: { chip: Chip; delay?: number }) {
  return (
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}>
      <Link href={`/services/${chip.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/85 p-2 pr-4 shadow-[0_20px_40px_-20px_rgb(15_36_26/0.5)] backdrop-blur-md transition-transform hover:scale-105">
        <span className="relative size-12 overflow-hidden rounded-xl bg-sand sm:size-14"><SmartImage image={chip.image} fill sizes="56px" className="object-cover" /></span>
        <span className="leading-tight">
          <span className="block max-w-[9rem] truncate text-sm font-semibold">{chip.title.split(/ &|,/)[0]}</span>
          {chip.priceFrom && <span className="text-xs font-bold text-leaf">from {chip.priceFrom}</span>}
        </span>
      </Link>
    </motion.div>
  );
}
