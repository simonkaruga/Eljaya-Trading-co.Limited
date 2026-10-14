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

const MAX_FILE = 10 * 1024 * 1024;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined);

type Item = { product: string; option?: string; quantity: number; decoration?: string; unitPrice?: number };

function parseItems(raw: unknown): Item[] {
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, 30).map((i) => ({
      product: str(i?.product, 120),
      option: str(i?.option, 120) || undefined,
      quantity: Math.min(1_000_000, Math.max(1, Math.round(Number(i?.quantity) || 1))),
      decoration: str(i?.decoration, 60) || undefined,
      unitPrice: num(Number(i?.unitPrice)),
    })).filter((i) => i.product);
  } catch {
    return [];
  }
}

/** Accepts the contact form (JSON) and the quote basket (multipart, with optional logo upload). */
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });

  let body: Record<string, unknown> = {};
  let file: File | null = null;
  try {
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const fd = await req.formData();
      fd.forEach((v, k) => { if (typeof v === 'string') body[k] = v; });
      const f = fd.get('artwork');
      if (f instanceof File && f.size > 0) file = f;
    } else {
      body = await req.json();
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (str(body.website, 100)) return NextResponse.json({ success: true }); // honeypot tripped: pretend success
  if (file && file.size > MAX_FILE) return NextResponse.json({ error: 'Logo file is too large (max 10MB).' }, { status: 400 });

  const items = parseItems(body.items);
  const data = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    company: str(body.company, 120),
    service: str(body.service, 120),
    quantity: str(body.quantity, 60),
    location: str(body.location, 120),
    neededBy: /^\d{4}-\d{2}-\d{2}$/.test(str(body.neededBy, 10)) ? str(body.neededBy, 10) : '',
    message: str(body.message, 6000),
  };
  const estimate = items.reduce((s, i) => s + (i.unitPrice ?? 0) * i.quantity, 0);

  if (!data.name || !data.email || !data.phone || (!data.message && !items.length)) {
    return NextResponse.json({ error: 'Please fill in your name, email, phone and what you need.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const tasks: Promise<unknown>[] = [];
  const canStore = sanityEnabled && Boolean(process.env.SANITY_API_WRITE_TOKEN);

  // 1. File it in the admin panel's Enquiries inbox (with the logo attached)
  if (canStore) {
    tasks.push((async () => {
      const artwork = file
        ? await writeClient.assets.upload('file', Buffer.from(await file.arrayBuffer()), { filename: file.name, contentType: file.type })
        : null;
      await writeClient.create({
        _type: 'enquiry',
        status: 'new',
        submittedAt: new Date().toISOString(),
        ...Object.fromEntries(Object.entries(data).filter(([, v]) => v)),
        ...(items.length ? { items: items.map((i, k) => ({ _key: `i${k}`, _type: 'quoteItem', ...i })) } : {}),
        ...(estimate ? { estimate } : {}),
        ...(artwork ? { artwork: { _type: 'file', asset: { _type: 'reference', _ref: artwork._id } } } : {}),
      });
    })());
  }

  // 2. Email the team
  if (process.env.RESEND_API_KEY) {
    const rows = Object.entries(data)
      .filter(([k, v]) => v && k !== 'message')
      .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#6a786f;text-transform:capitalize">${k.replace('neededBy', 'needed by')}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`)
      .join('');
    const itemRows = items.map((i) =>
      `<tr><td style="padding:6px 12px 6px 0">${i.quantity}</td><td style="padding:6px 12px 6px 0;font-weight:600">${esc(i.option ?? i.product)}${i.option ? `<br><span style="color:#6a786f;font-weight:400">${esc(i.product)}</span>` : ''}</td><td style="padding:6px 12px 6px 0">${esc(i.decoration ?? '')}</td><td style="padding:6px 0;text-align:right">${i.unitPrice ? `KSh ${(i.unitPrice * i.quantity).toLocaleString('en-KE')}` : 'On request'}</td></tr>`,
    ).join('');
    const attachments = file && file.size <= MAX_FILE ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }] : undefined;
    tasks.push(
      new Resend(process.env.RESEND_API_KEY).emails
        .send({
          from: process.env.CONTACT_FROM_EMAIL || 'Eljaya Website <onboarding@resend.dev>',
          to: (process.env.CONTACT_TO_EMAIL || 'info@eljayatradingco.com').split(','),
          replyTo: data.email,
          subject: items.length
            ? `Quote request${estimate ? ` (≈ KSh ${estimate.toLocaleString('en-KE')})` : ''}: ${data.name}${data.company ? `, ${data.company}` : ''}`
            : `New enquiry: ${data.service || 'General'} from ${data.name}`,
          attachments,
          html: `<div style="font-family:system-ui,sans-serif;max-width:640px;margin:auto;padding:24px;color:#15241b">
            <h2 style="margin:0 0 4px">${items.length ? 'New quote request' : 'New website enquiry'}</h2>
            <p style="margin:0 0 20px;color:#6a786f">Reply to this email to respond to ${esc(data.name)} directly.</p>
            <table style="border-collapse:collapse;font-size:15px">${rows}</table>
            ${items.length ? `<h3 style="margin:24px 0 8px">Items</h3><table style="border-collapse:collapse;font-size:14px;width:100%"><tr style="color:#6a786f;text-align:left"><th>Qty</th><th>Product</th><th>Branding</th><th style="text-align:right">From</th></tr>${itemRows}</table>${estimate ? `<p style="margin:12px 0 0;text-align:right;font-weight:700">Estimated from KSh ${estimate.toLocaleString('en-KE')}</p>` : ''}` : ''}
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
    return NextResponse.json({ error: 'We couldn’t send your request right now.' }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
