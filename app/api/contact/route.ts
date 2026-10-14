import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { writeClient } from '@/lib/sanity/client';
import { sanityEnabled } from '@/lib/sanity/env';

// Best-effort in-memory limiter: max 5 submissions per IP per 10 minutes (per server instance)
const hits = new Map<string, { n: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { n: 1, reset: now + 10 * 60_000 });
    return false;
  }
  return ++h.n > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  if (str(body.website, 100)) return NextResponse.json({ success: true }); // honeypot tripped: pretend success

  const data = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    company: str(body.company, 120),
    service: str(body.service, 120),
    quantity: str(body.quantity, 60),
    message: str(body.message, 4000),
  };
  if (!data.name || !data.email || !data.phone || !data.message) {
    return NextResponse.json({ error: 'Please fill in your name, email, phone and message.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const tasks: Promise<unknown>[] = [];

  // 1. File it in the admin panel's Enquiries inbox
  if (sanityEnabled && process.env.SANITY_API_WRITE_TOKEN) {
    tasks.push(writeClient.create({ _type: 'enquiry', status: 'new', submittedAt: new Date().toISOString(), ...data }));
  }

  // 2. Email the team
  if (process.env.RESEND_API_KEY) {
    const rows = Object.entries(data)
      .filter(([k, v]) => v && k !== 'message')
      .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#6a786f;text-transform:capitalize">${k}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`)
      .join('');
    tasks.push(
      new Resend(process.env.RESEND_API_KEY).emails
        .send({
          from: process.env.CONTACT_FROM_EMAIL || 'Eljaya Website <onboarding@resend.dev>',
          to: (process.env.CONTACT_TO_EMAIL || 'eljayasupplies@gmail.com').split(','),
          replyTo: data.email,
          subject: `New enquiry: ${data.service || 'General'} from ${data.name}`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;padding:24px;color:#15241b">
            <h2 style="margin:0 0 4px">New website enquiry</h2>
            <p style="margin:0 0 20px;color:#6a786f">Reply to this email to respond to ${esc(data.name)} directly.</p>
            <table style="border-collapse:collapse;font-size:15px">${rows}</table>
            <p style="margin:20px 0 6px;color:#6a786f">Message</p>
            <p style="margin:0;line-height:1.6;white-space:pre-wrap">${esc(data.message)}</p>
          </div>`,
        })
        .then((r) => { if (r.error) throw new Error(r.error.message); }),
    );
  }

  if (!tasks.length) {
    console.error('[contact] No delivery configured: set RESEND_API_KEY and/or SANITY_API_WRITE_TOKEN');
    return NextResponse.json({ error: 'Our form is temporarily unavailable.' }, { status: 503 });
  }

  const results = await Promise.allSettled(tasks);
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error('[contact] delivery failed', (r as PromiseRejectedResult).reason));
  if (results.every((r) => r.status === 'rejected')) {
    return NextResponse.json({ error: 'We couldn’t send your message right now.' }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
