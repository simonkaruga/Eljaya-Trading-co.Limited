'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import { WhatsAppIcon } from './icons';
import { track } from '@/lib/track';

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

const field = 'peer w-full rounded-xl border border-line bg-white/70 px-4 pb-2.5 pt-6 text-[0.95rem] outline-none transition-colors placeholder-transparent focus:border-leaf focus:bg-white';
const label = 'pointer-events-none absolute left-4 top-2 text-xs font-semibold text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.95rem] peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-leaf';

function Field({ name, text, type = 'text', required, autoComplete }: { name: string; text: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div className="relative">
      <input id={name} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={text} className={field} />
      <label htmlFor={name} className={label}>{text}{required && ' *'}</label>
    </div>
  );
}

export function ContactForm({ services, whatsapp }: { services: string[]; whatsapp: string }) {
  const params = useSearchParams();
  const preset = params.get('service') ?? '';
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      track('contact_submit', { item: String(new FormData(form).get('service') ?? '') });
      form.reset();
      setStatus({ state: 'sent' });
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status.state === 'sent' ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-5 rounded-[1.75rem] bg-forest p-8 text-paper sm:p-12" role="status">
          <CheckCircle2 className="size-12 text-lime" />
          <h3 className="text-3xl sm:text-4xl">Thank you, we’ve got it.</h3>
          <p className="max-w-md text-paper/70">Our team will reply within 2 hours during business hours (Mon–Fri, 8AM–6PM). Need it faster? Message us on WhatsApp.</p>
          <div className="flex flex-wrap gap-3">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white">
              <WhatsAppIcon className="size-5" /> Continue on WhatsApp
            </a>
            <button type="button" onClick={() => setStatus({ state: 'idle' })} className="rounded-full border border-white/20 px-6 py-3.5 font-semibold hover:bg-white/10">Send another</button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2">
          <Field name="name" text="Your name" required autoComplete="name" />
          <Field name="company" text="Company" autoComplete="organization" />
          <Field name="email" text="Email" type="email" required autoComplete="email" />
          <Field name="phone" text="Phone / WhatsApp" type="tel" required autoComplete="tel" />
          <div className="relative">
            <select id="service" name="service" defaultValue={preset} required className={`${field} appearance-none`}>
              <option value="" disabled>Choose…</option>
              {[...new Set([preset, ...services].filter(Boolean))].map((s) => <option key={s}>{s}</option>)}
              <option>Something else / not sure yet</option>
            </select>
            <label htmlFor="service" className="pointer-events-none absolute left-4 top-2 text-xs font-semibold text-muted">What do you need? *</label>
          </div>
          <Field name="quantity" text="Approx. quantity" />
          <div className="relative sm:col-span-2">
            <textarea id="message" name="message" required rows={5} placeholder="Tell us about your project" className={`${field} resize-y`} />
            <label htmlFor="message" className={label}>Tell us about your project: colours, deadline, delivery location *</label>
          </div>
          {/* Honeypot: hidden from people, bots fill it in */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">We’ll only use your details to reply to this enquiry.</p>
            <button
              type="submit"
              disabled={status.state === 'sending'}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition-colors hover:bg-leaf disabled:opacity-60"
            >
              {status.state === 'sending' ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Send enquiry <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" /></>}
            </button>
          </div>
          {status.state === 'error' && (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
              {status.message} You can also reach us on <a className="font-semibold underline" href={`https://wa.me/${whatsapp}`}>WhatsApp</a>.
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
