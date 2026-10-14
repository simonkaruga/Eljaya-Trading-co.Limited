'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import type { Faq as FaqT } from '@/lib/types';

export function Faq({ items }: { items: FaqT[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?._id ?? null);
  return (
    <ul className="border-t border-line">
      {items.map((f) => {
        const isOpen = open === f._id;
        return (
          <li key={f._id} className="border-b border-line">
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : f._id)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold sm:text-xl"
              >
                {f.question}
                <span className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? 'rotate-45 border-leaf bg-leaf text-white' : 'border-line'}`}>
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 pr-12 leading-relaxed text-ink-2">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
