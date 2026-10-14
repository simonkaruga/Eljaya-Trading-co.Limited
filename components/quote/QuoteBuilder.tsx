'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Img, ServiceOption } from '@/lib/types';
import { DECORATIONS, ksh, quote, useQuote } from '@/lib/quote';
import { WhatsAppIcon } from '../icons';

/**
 * Instant estimate + "add to quote" for a product page. Prices come from the
 * owner's price list in the admin; options without a price show "on request".
 */
export function QuoteBuilder({
  product, slug, options, image, whatsapp, fallbackMin,
}: { product: string; slug: string; options: ServiceOption[]; image?: Img; whatsapp: string; fallbackMin?: number }) {
  const list = options.length ? options : [{ name: product, minQty: fallbackMin }];
  const [idx, setIdx] = useState(0);
  const opt = list[idx];
  const min = opt.minQty ?? 1;
  const [qty, setQty] = useState(Math.max(min, opt.minQty ? opt.minQty * 2 : 50));
  const [decoration, setDecoration] = useState(DECORATIONS[0]);
  const [added, setAdded] = useState(false);
  const basket = useQuote();

  const pick = (i: number) => {
    setIdx(i);
    const m = list[i].minQty ?? 1;
    if (qty < m) setQty(m);
  };
  const total = opt.unitPrice ? opt.unitPrice * qty : 0;
  const belowMin = qty < min;

  const add = () => {
    quote.add({ kind: 'service', slug, product, option: options.length ? opt.name : undefined, unitPrice: opt.unitPrice, minQty: opt.minQty, qty, decoration, image: image?.src });
    setAdded(true);
    setTimeout(() => setAdded(false), 4000);
  };

  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hi Eljaya, I'd like a quote for:\n• ${qty} × ${opt.name}${options.length ? ` (${product})` : ''}\n• Branding: ${decoration}\n\nPlease advise on price and delivery.`,
  )}`;

  return (
    <div className="rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgb(15_36_26/0.35)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl">Instant estimate</h2>
        <span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-bold text-forest">No obligation</span>
      </div>

      {options.length > 1 && (
        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-muted">1. Choose an option</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {list.map((o, i) => (
              <label key={o.name} className={`flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 transition-colors ${i === idx ? 'border-leaf bg-leaf/5 ring-1 ring-leaf' : 'border-line hover:border-ink/30'}`}>
                <input type="radio" name="opt" className="sr-only" checked={i === idx} onChange={() => pick(i)} />
                <span>
                  <span className="block text-[0.92rem] font-semibold leading-snug">{o.name}</span>
                  {o.minQty && <span className="mt-0.5 block text-xs text-muted">Min. {o.minQty} pcs</span>}
                </span>
                <span className="shrink-0 text-right text-sm font-bold text-leaf">{o.unitPrice ? ksh(o.unitPrice) : <span className="font-medium text-muted">On request</span>}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{options.length > 1 ? '2.' : '1.'} Quantity</p>
          <div className="mt-3 flex items-center rounded-xl border border-line bg-white">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - (q > 100 ? 25 : 5)))} className="grid size-12 place-items-center text-ink-2 hover:text-ink"><Minus className="size-4" /></button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              aria-label="Quantity"
              className="w-full bg-transparent text-center text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + (q >= 100 ? 25 : 5))} className="grid size-12 place-items-center text-ink-2 hover:text-ink"><Plus className="size-4" /></button>
          </div>
          {belowMin && <p className="mt-2 text-xs font-semibold text-amber-700">Minimum order is {min} pieces for this option.</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{options.length > 1 ? '3.' : '2.'} Branding method</p>
          <select value={decoration} onChange={(e) => setDecoration(e.target.value)} className="mt-3 h-[50px] w-full rounded-xl border border-line bg-white px-3 text-[0.95rem] outline-none focus:border-leaf">
            {DECORATIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-forest p-5 text-paper">
        {opt.unitPrice ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/60">Estimated from</p>
            <p className="mt-1 font-display text-4xl">{ksh(total)}</p>
            <p className="mt-1 text-sm text-paper/70">{qty} pcs × {ksh(opt.unitPrice)} starting price per piece</p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-paper/60">Price</p>
            <p className="mt-1 font-display text-3xl">Tailored quote</p>
            <p className="mt-1 text-sm text-paper/70">Depends on size, material and print. We reply within 24 hours.</p>
          </>
        )}
        <p className="mt-3 border-t border-white/10 pt-3 text-xs text-paper/60">Bulk discounts apply on larger runs. Extra colours, positions or embroidery are confirmed in your final quote.</p>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <button type="button" onClick={add} disabled={belowMin} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-forest transition-colors hover:bg-ink hover:text-paper disabled:opacity-50">
          <ShoppingBag className="size-4" /> Add to quote
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white">
          <WhatsAppIcon className="size-5" /> Quote on WhatsApp
        </a>
      </div>

      <AnimatePresence>
        {added && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-leaf/10 p-3.5 text-sm">
            <span className="flex items-center gap-2 font-semibold text-leaf-dark"><Check className="size-4" /> Added. Add more products or send your request.</span>
            <Link href="/quote" className="shrink-0 font-bold underline underline-offset-4">View quote ({basket.length})</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
