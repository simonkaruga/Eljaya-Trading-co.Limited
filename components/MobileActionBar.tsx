'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ShoppingBag } from 'lucide-react';
import { useQuote } from '@/lib/quote';
import { WhatsAppIcon } from './icons';

/** Always-visible Call / WhatsApp / Quote bar on phones and tablets. */
export function MobileActionBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const items = useQuote();
  const pathname = usePathname();
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-3">
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-ink-2">
          <Phone className="size-5" /> Call
        </a>
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-[#128C7E]">
          <WhatsAppIcon className="size-5" /> WhatsApp
        </a>
        <Link href="/quote" className={`relative flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold ${pathname === '/quote' ? 'text-leaf' : 'text-ink'}`}>
          <span className="relative">
            <ShoppingBag className="size-5" />
            {items.length > 0 && <span className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-lime px-1 text-[0.6rem] font-bold leading-4 text-forest">{items.length}</span>}
          </span>
          {items.length ? 'My quote' : 'Get a quote'}
        </Link>
      </div>
    </nav>
  );
}
