import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { SANITY_TAG } from '@/lib/content';

/**
 * Sanity webhook target: when the owner publishes anything in the studio,
 * Sanity calls this URL and the site refreshes immediately.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: 'SANITY_REVALIDATE_SECRET not set' }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  revalidateTag(SANITY_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
}
