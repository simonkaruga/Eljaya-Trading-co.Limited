'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CalendarClock, CheckCircle2, Loader2, Minus, Paperclip, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { DECORATIONS, ksh, lineEstimate, quote, useQuote, type QuoteItem } from '@/lib/quote';
import { track } from '@/lib/track';
import { WhatsAppIcon } from '../icons';

const input = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-leaf';

/** Business days between today and a date (Mon–Fri). */
function businessDaysUntil(date: string) {
  const end = new Date(date);
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  let n = 0;
  while (d < end) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() % 6 !== 0) n++;
  }
  return n;
}

function summary(items: QuoteItem[]) {
  return items.map((i) => `• ${i.qty} × ${i.option ?? i.product}${i.option ? ` (${i.product})` : ''}${i.decoration ? `, ${i.decoration}` : ''}`).join('\n');
}

export function QuoteRequest({ whatsapp, packsHref = '/services#packs' }: { whatsapp: string; packsHref?: string }) {
  const items = useQuote();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [neededBy, setNeededBy] = useState('');
  const [fileName, setFileName] = useState('');

  const estimate = useMemo(() => items.reduce((s, i) => s + lineEstimate(i), 0), [items]);
  const unpriced = items.some((i) => !i.unitPrice);
  const days = neededBy ? businessDaysUntil(neededBy) : null;
  const today = new Date().toISOString().slice(0, 10);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    fd.set('items', JSON.stringify(items.map(({ product, option, qty, decoration, unitPrice }) => ({ product, option, quantity: qty, decoration, unitPrice }))));
    fd.set('estimate', String(estimate));
    fd.set('service', items.length === 1 ? items[0].product : `${items.length} products`);
    fd.set('message', `${summary(items)}\n\n${fd.get('notes') ?? ''}`.trim());
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      track('quote_submit', { value: estimate, items: items.length });
      quote.clear();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-[2rem] bg-forest p-8 text-center text-paper sm:p-14" role="status">
        <CheckCircle2 className="mx-auto size-14 text-lime" />
        <h2 className="mt-6 text-4xl">Quote request received.</h2>
        <p className="mx-auto mt-4 max-w-md text-paper/70">We’ll send your detailed, itemised quote within 24 hours, often much sooner. Need it urgently? Message us on WhatsApp.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white"><WhatsAppIcon className="size-5" /> WhatsApp us</a>
          <Link href="/services" className="rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/10">Keep browsing</Link>
        </div>
      </motion.div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-line p-10 text-center">
        <ShoppingBag className="mx-auto size-12 text-leaf" />
        <h2 className="mt-5 text-3xl">Your quote is empty</h2>
        <p className="mt-3 text-ink-2">Pick products, set quantities and we’ll price everything in one go, with no obligation.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-paper hover:bg-leaf">Browse products <ArrowUpRight className="size-4" /></Link>
          <Link href={packsHref} className="rounded-full border border-line px-6 py-3.5 font-semibold hover:border-ink">See gift packs</Link>
        </div>
      </div>
    );
  }

  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi Eljaya, I'd like a quote for:\n${summary(items)}${neededBy ? `\nNeeded by: ${neededBy}` : ''}`)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Items */}
      <div className="lg:col-span-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl">Your items <span className="text-muted">({items.length})</span></h2>
          <button type="button" onClick={() => quote.clear()} className="text-sm font-semibold text-muted hover:text-red-700">Clear all</button>
        </div>
        <ul className="mt-6 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((i) => (
              <motion.li key={i.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className="flex gap-4 rounded-2xl border border-line bg-white/60 p-3 sm:p-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand sm:size-24">
                  {i.image && <Image src={i.image} alt="" fill sizes="96px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold leading-snug">{i.option ?? i.product}</p>
                      {i.option && <p className="text-xs text-muted">{i.product}</p>}
                      {i.kind === 'pack' && <p className="text-xs font-semibold text-leaf">Gift pack</p>}
                    </div>
                    <button type="button" onClick={() => quote.remove(i.id)} aria-label={`Remove ${i.option ?? i.product}`} className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"><Trash2 className="size-4" /></button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-full border border-line bg-white">
                      <button type="button" aria-label="Decrease" onClick={() => quote.update(i.id, { qty: Math.max(1, i.qty - (i.qty > 100 ? 25 : 5)) })} className="grid size-8 place-items-center"><Minus className="size-3.5" /></button>
                      <input aria-label="Quantity" type="number" min={1} value={i.qty} onChange={(e) => quote.update(i.id, { qty: Math.max(1, Number(e.target.value) || 1) })} className="w-14 bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                      <button type="button" aria-label="Increase" onClick={() => quote.update(i.id, { qty: i.qty + (i.qty >= 100 ? 25 : 5) })} className="grid size-8 place-items-center"><Plus className="size-3.5" /></button>
                    </div>
                    {i.kind === 'service' && (
                      <select aria-label="Branding method" value={i.decoration} onChange={(e) => quote.update(i.id, { decoration: e.target.value })} className="h-8 rounded-full border border-line bg-white px-3 text-xs font-medium outline-none">
                        {DECORATIONS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    )}
                    <span className="ml-auto text-sm font-bold text-leaf">{i.unitPrice ? `from ${ksh(lineEstimate(i))}` : <span className="font-medium text-muted">On request</span>}</span>
                  </div>
                  {i.minQty && i.qty < i.minQty && <p className="mt-2 text-xs font-semibold text-amber-700">Minimum for this item is {i.minQty}.</p>}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:underline"><Plus className="size-4" /> Add another product</Link>

        <div className="mt-8 rounded-2xl bg-forest p-6 text-paper">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-paper/60">Estimated from</p>
              <p className="mt-1 font-display text-4xl">{estimate ? ksh(estimate) : 'On request'}</p>
            </div>
            {unpriced && estimate > 0 && <p className="max-w-[12rem] text-right text-xs text-paper/60">+ items priced on request</p>}
          </div>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs text-paper/60">Starting prices from our published price list. Your final quote confirms print colours, positions, bulk discounts and delivery. A 50% deposit (M-Pesa or bank) starts production.</p>
        </div>
      </div>

      {/* Details */}
      <form onSubmit={submit} className="lg:col-span-5">
        <div className="rounded-[2rem] border border-line bg-sand/60 p-5 sm:p-7 lg:sticky lg:top-28">
          <h2 className="text-3xl">Your details</h2>
          <p className="mt-2 text-sm text-ink-2">We reply within 2 hours during business hours, with a detailed quote within 24 hours.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input name="name" required placeholder="Your name *" autoComplete="name" className={input} />
            <input name="company" placeholder="Company" autoComplete="organization" className={input} />
            <input name="email" type="email" required placeholder="Email *" autoComplete="email" className={input} />
            <input name="phone" type="tel" required placeholder="Phone / WhatsApp *" autoComplete="tel" className={input} />
            <input name="location" placeholder="Delivery town / area" className={`${input} sm:col-span-2`} />
            <label className="sm:col-span-2">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><CalendarClock className="size-3.5" /> Needed by</span>
              <input name="neededBy" type="date" min={today} value={neededBy} onChange={(e) => setNeededBy(e.target.value)} className={input} />
              {days !== null && (
                <span className={`mt-2 block rounded-lg px-3 py-2 text-xs font-semibold ${days >= 15 ? 'bg-leaf/10 text-leaf-dark' : days >= 7 ? 'bg-lime/30 text-forest' : 'bg-amber-100 text-amber-800'}`}>
                  {days >= 15 ? `${days} business days: comfortably within standard production.` : days >= 7 ? `${days} business days: tight but usually possible. We’ll confirm.` : `${days} business days: rush order. We’ll confirm what’s achievable.`}
                </span>
              )}
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/25 bg-white/60 px-4 py-3 text-sm hover:border-leaf sm:col-span-2">
              <Paperclip className="size-4 shrink-0 text-leaf" />
              <span className="min-w-0 flex-1 truncate">{fileName || 'Attach your logo (optional, max 10MB)'}</span>
              <input name="artwork" type="file" accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps,.webp" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
            </label>
            <textarea name="notes" rows={3} placeholder="Anything else? Colours, print positions, sizes…" className={`${input} resize-y sm:col-span-2`} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          </div>
          <button type="submit" disabled={status === 'sending'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-semibold text-paper transition-colors hover:bg-leaf disabled:opacity-60">
            {status === 'sending' ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Request my quote <ArrowUpRight className="size-4" /></>}
          </button>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold hover:border-[#25D366] hover:bg-[#25D366] hover:text-white">
            <WhatsAppIcon className="size-4" /> Or send this list on WhatsApp
          </a>
          {status === 'error' && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error} Please try WhatsApp instead.</p>}
        </div>
      </form>
    </div>
  );
}
