'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Star } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';
import { SmartImage } from '../SmartImage';
import { Button } from '../Button';
import { GoogleIcon, LeafMark } from '../icons';

const DURATION = 7000;
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({
  slides, rating, reviewCount, reviewUrl, tagline,
}: { slides: HeroSlide[]; rating?: number; reviewCount?: number; reviewUrl?: string; tagline: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], ['0%', reduce ? '0%' : '18%']);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reduce) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, count, go, reduce]);

  const slide = slides[index];
  const words = slide.heading.split(' ');

  return (
    <section className="px-2.5 sm:px-4" aria-roledescription="carousel" aria-label="Highlights">
      <div
        className="relative isolate flex min-h-[640px] overflow-hidden rounded-[1.75rem] bg-forest text-white sm:rounded-[2.5rem] lg:h-[calc(100svh-7.5rem)] lg:max-h-[920px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            >
              <SmartImage image={slide.image} fill priority={index === 0} sizes="100vw" className="animate-kenburns object-cover" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(15_36_26/0.92)_0%,rgb(15_36_26/0.62)_42%,rgb(15_36_26/0.12)_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest/70 to-transparent" />
        </motion.div>

        {/* Google rating */}
        {rating && (
          <motion.a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="absolute right-5 top-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md transition-colors hover:bg-white/20 sm:right-8 sm:top-8 sm:flex"
          >
            <span className="grid size-9 place-items-center rounded-full bg-white"><GoogleIcon className="size-5" /></span>
            <span className="leading-tight">
              <span className="flex items-center gap-1 text-sm font-bold">
                {rating.toFixed(1)}
                <span className="flex text-lime">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-3.5 fill-current" />)}</span>
              </span>
              <span className="text-xs text-white/70">{reviewCount ? `${reviewCount} Google reviews` : 'Google reviews'}</span>
            </span>
          </motion.a>
        )}

        {/* Copy */}
        <div className="container-x relative flex flex-col justify-end pb-28 pt-24 sm:pb-32 lg:justify-center lg:pb-24">
          <div className="max-w-3xl" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={index} exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}>
                {slide.eyebrow && (
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-lime backdrop-blur"
                  >
                    <LeafMark className="size-3.5" /> {slide.eyebrow}
                  </motion.p>
                )}
                <h1 className="text-balance text-[2.6rem] font-medium leading-[1.02] sm:text-6xl lg:text-[5.4rem]">
                  {words.map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 1, delay: 0.1 + i * 0.06, ease }}
                      >
                        {i === words.length - 1 ? <em className="font-light italic text-lime">{w}</em> : w}
                        {i < words.length - 1 && ' '}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                {slide.text && (
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.45, ease }}
                    className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
                  >
                    {slide.text}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button href="/contact">Get a free quote</Button>
              <Button href="/services" variant="ghost-light" icon={false}>Explore services</Button>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-x flex items-center gap-3 pb-7 sm:gap-5 sm:pb-9">
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${s.heading}`}
                  aria-current={i === index}
                  className="group flex-1 text-left sm:max-w-56"
                >
                  <span className="relative block h-[2px] overflow-hidden rounded bg-white/25">
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-lime"
                        style={{
                          width: paused || reduce ? '100%' : undefined,
                          animation: paused || reduce ? undefined : `hero-progress ${DURATION}ms linear forwards`,
                        }}
                      />
                    )}
                    {i < index && <span className="absolute inset-0 bg-white/60" />}
                  </span>
                  <span className={`mt-3 hidden text-xs font-medium transition-colors sm:block ${i === index ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                    0{i + 1} <span className="ml-1 line-clamp-1 inline">{s.eyebrow ?? s.heading}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rotating badge */}
        <div className="absolute bottom-24 right-6 hidden lg:block xl:right-12">
          <div className="relative grid size-36 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow text-white/80">
              <defs><path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <text fontSize="8.4" fontWeight="600" fill="currentColor">
                <textPath href="#circle" textLength={238} lengthAdjust="spacing">{`${tagline} · since 2015 · `.toUpperCase()}</textPath>
              </text>
            </svg>
            <span className="grid size-14 place-items-center rounded-full bg-lime text-forest"><LeafMark className="size-6" /></span>
          </div>
        </div>
      </div>
      <style>{`@keyframes hero-progress{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
