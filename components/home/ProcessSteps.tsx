'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Check } from 'lucide-react';
import type { ProcessStep } from '@/lib/types';
import { Reveal } from '../Reveal';

/** Vertical timeline whose line fills as you scroll through the steps. */
export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative space-y-6">
      <span aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-line" />
      <motion.span aria-hidden style={{ scaleY }} className="absolute bottom-6 left-[1.6rem] top-6 w-px origin-top bg-leaf" />
      {steps.map((s, i) => (
        <Reveal as="li" key={i} delay={i * 0.05} className="relative grid grid-cols-[3.2rem_1fr] gap-5 sm:gap-8">
          <span className="relative z-10 grid size-[3.2rem] place-items-center rounded-full border border-line bg-paper font-display text-lg text-leaf">
            {i + 1}
          </span>
          <div className="rounded-3xl border border-line bg-white/50 p-6 transition-colors duration-500 hover:bg-white sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl sm:text-3xl">{s.title}</h3>
              {s.duration && <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-2">{s.duration}</span>}
            </div>
            <p className="mt-3 leading-relaxed text-ink-2">{s.text}</p>
            {!!s.points?.length && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-leaf" />{p}</li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
