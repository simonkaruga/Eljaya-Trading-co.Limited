'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Loader2, Star } from 'lucide-react';
import { track } from '@/lib/track';
import { GoogleIcon } from './icons';

const input = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-leaf';
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export function ReviewForm({ googleReviewUrl }: { googleReviewUrl?: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating) { setError('Please choose a star rating.'); setStatus('error'); return; }
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fd), rating, consent: fd.get('consent') === 'on' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      track('review_submit', { value: rating });
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} role="status" className="rounded-[2rem] bg-forest p-8 text-paper sm:p-10">
        <CheckCircle2 className="size-12 text-lime" />
        <h3 className="mt-5 text-3xl">Asante! Thank you for your review.</h3>
        <p className="mt-3 text-paper/70">Our team reads every review before it appears on the website.</p>
        {googleReviewUrl && rating >= 4 && (
          <div className="mt-7 rounded-2xl bg-white/10 p-5">
            <p className="font-semibold">Would you also share it on Google?</p>
            <p className="mt-1 text-sm text-paper/70">It takes a minute and helps other Kenyan businesses find us.</p>
            <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink hover:bg-lime">
              <GoogleIcon className="size-4" /> Review us on Google
            </a>
          </div>
        )}
      </motion.div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-line bg-sand/60 p-5 sm:p-8">
      <h3 className="text-3xl">Write a review</h3>
      <p className="mt-2 text-sm text-ink-2">Worked with us? Tell other businesses how it went. Reviews appear once our team has checked them.</p>

      <fieldset className="mt-6">
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted">Your rating *</legend>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-pressed={rating === n}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={`size-8 ${n <= shown ? 'fill-lime text-leaf' : 'text-ink/25'}`} />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-ink-2">{LABELS[shown]}</span>
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="name" required maxLength={80} placeholder="Your name *" autoComplete="name" className={input} />
        <input name="role" maxLength={120} placeholder="Role & company (optional)" autoComplete="organization-title" className={input} />
        <input name="email" type="email" required placeholder="Email * (never shown)" autoComplete="email" className={`${input} sm:col-span-2`} />
        <textarea name="quote" required minLength={15} maxLength={1200} rows={5} placeholder="What did we make for you, and how was the experience? *" className={`${input} resize-y sm:col-span-2`} />
        <label className="flex items-start gap-3 text-sm text-ink-2 sm:col-span-2">
          <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--color-leaf)]" />
          I agree that Eljaya may publish my review, name and role on this website.
        </label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      <button type="submit" disabled={status === 'sending'} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-semibold text-paper transition-colors hover:bg-leaf disabled:opacity-60 sm:w-auto">
        {status === 'sending' ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Submit review <ArrowUpRight className="size-4" /></>}
      </button>
      {status === 'error' && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    </form>
  );
}
