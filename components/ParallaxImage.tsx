'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { Img } from '@/lib/types';
import { SmartImage } from './SmartImage';

/** Image that drifts slower than the page as you scroll past it. */
export function ParallaxImage({ image, className = '', sizes, strength = 12, priority }: { image: Img; className?: string; sizes?: string; strength?: number; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
        <SmartImage image={image} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
