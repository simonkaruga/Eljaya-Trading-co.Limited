import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { writeClient } from '@/lib/sanity/client';
import { sanityEnabled } from '@/lib/sanity/env';

// Best-effort in-memory limiter: max 3 reviews per IP per hour (per server instance)
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { n: 1, reset: now + 60 * 60_000 });
    return false;
  }
  return ++h.n > 3;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Website review form. Reviews are saved as "pending" and never shown until
 * the owner approves them in the studio (Reviews → Waiting for approval).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  if (str(body.website, 100)) return NextResponse.json({ success: true }); // honeypot: pretend success

  const name = str(body.name, 80);
  const role = str(body.role, 120);
  const email = str(body.email, 200);
  const quote = str(body.quote, 1200);
  const rating = Math.round(Number(body.rating));

  if (!name || !quote || !email) return NextResponse.json({ error: 'Please add your name, email and review.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Please choose a star rating.' }, { status: 400 });
  if (quote.length < 15) return NextResponse.json({ error: 'Please write a little more about your experience.' }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: 'Please agree to us publishing your review.' }, { status: 400 });

  // Count only valid submissions, so someone fixing typos isn't locked out
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many reviews from this connection. Please try again later.' }, { status: 429 });

  if (!sanityEnabled || !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('[reviews] SANITY_API_WRITE_TOKEN / project not configured');
    return NextResponse.json({ error: 'Reviews are temporarily unavailable.' }, { status: 503 });
  }

  try {
    await writeClient.create({
      _type: 'testimonial',
      status: 'pending',
      source: 'website',
      submittedAt: new Date().toISOString(),
      name,
      ...(role ? { role } : {}),
      email,
      quote,
      rating,
      order: 100,
    });
  } catch (err) {
    console.error('[reviews] save failed', err);
    return NextResponse.json({ error: 'We couldn’t save your review right now.' }, { status: 502 });
  }

  // Let the owner know there's a review to moderate (optional)
  if (process.env.RESEND_API_KEY) {
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://eljayatradingco.com';
    await new Resend(process.env.RESEND_API_KEY).emails
      .send({
        from: process.env.CONTACT_FROM_EMAIL || 'Eljaya Website <onboarding@resend.dev>',
        to: (process.env.CONTACT_TO_EMAIL || 'info@eljayatradingco.com').split(','),
        subject: `New ${rating}★ review waiting for approval: ${name}`,
        html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;padding:24px;color:#15241b">
          <h2 style="margin:0 0 8px">New review waiting for approval</h2>
          <p style="margin:0 0 16px;color:#6a786f">It is hidden until you approve it.</p>
          <p style="font-size:20px;color:#2e8540;margin:0">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
          <p style="line-height:1.6;white-space:pre-wrap">“${esc(quote)}”</p>
          <p style="margin:0"><strong>${esc(name)}</strong>${role ? `, ${esc(role)}` : ''}<br><span style="color:#6a786f">${esc(email)}</span></p>
          <p style="margin:24px 0 0"><a href="${site}/studio" style="background:#15241b;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Approve or reject in the studio</a></p>
        </div>`,
      })
      .catch((err) => console.error('[reviews] notify failed', err));
  }

  return NextResponse.json({ success: true });
}
