'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

type Option = { value: string; label: string };

/**
 * Pill filter + animated grid. The active filter lives in the URL
 * (?category=…) so filtered views can be shared and linked to.
 */
export function FilterGrid<T extends { _id: string }>({
  items, options, param, getValue, render, className,
}: {
  items: T[];
  options: Option[];
  param: string;
  getValue: (item: T) => string | undefined;
  render: (item: T, index: number) => React.ReactNode;
  className: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get(param) ?? 'all';
  const shown = active === 'all' ? items : items.filter((i) => getValue(i) === active);

  const select = (v: string) => {
    const q = new URLSearchParams(params);
    if (v === 'all') q.delete(param); else q.set(param, v);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  return (
    <LayoutGroup>
      <div role="tablist" aria-label="Filter" className="mb-12 flex flex-wrap gap-2">
        {[{ value: 'all', label: 'All' }, ...options].map((o) => {
          const count = o.value === 'all' ? items.length : items.filter((i) => getValue(i) === o.value).length;
          if (!count) return null;
          const on = active === o.value;
          return (
            <button
              key={o.value}
              role="tab"
              aria-selected={on}
              onClick={() => select(o.value)}
              className={`relative rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${on ? 'border-ink text-paper' : 'border-line text-ink-2 hover:border-ink/40'}`}
            >
              {on && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              {o.label} <span className={on ? 'text-lime' : 'text-muted'}>{count}</span>
            </button>
          );
        })}
      </div>
      <motion.ul layout className={className}>
        <AnimatePresence mode="popLayout">
          {shown.map((item, i) => (
            <motion.li
              key={item._id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              {render(item, i)}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
