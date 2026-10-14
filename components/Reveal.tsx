'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number; as?: 'div' | 'li' | 'section' | 'article' };

/** Fades + lifts its children into view once, as they scroll onscreen. */
export function Reveal({ delay = 0, y = 28, as = 'div', children, ...rest }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Image wrapper that unveils with a clip-path wipe. */
export function ImageReveal({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
