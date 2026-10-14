'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Phone } from 'lucide-react';
import { NAV } from './nav';
import { Button } from './Button';

export function Header({ name, tagline, phone }: { name: string; tagline: string; phone: string }) {
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so navigating closes it automatically
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > prev && !open);
  });

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || open ? 'bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'bg-paper'
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="relative z-10 flex items-center gap-3" aria-label={`${name} home`}>
            <Image src="/logo-mark.png" alt="" width={30} height={39} priority className="h-9 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.15rem] font-semibold tracking-tight">{name}</span>
              <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-leaf">{tagline}</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-line bg-paper/60 p-1.5">
              {NAV.filter((n) => n.href !== '/contact').map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={`relative block rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                      isActive(n.href) ? 'text-paper' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {isActive(n.href) && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                    )}
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm font-semibold text-ink-2 hover:text-leaf">
              <Phone className="size-4" /> {phone}
            </a>
            <Button href="/contact" className="!py-3">Get a quote</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpenedOn(open ? null : pathname)}
            className="relative z-10 grid size-11 place-items-center rounded-full bg-ink text-paper lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper pt-36 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex-1">
              <ul className="space-y-1">
                {[{ href: '/', label: 'Home' }, ...NAV].map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    <Link href={n.href} className="flex items-baseline justify-between py-4 font-display text-4xl">
                      {n.label}
                      <span className="font-sans text-xs text-muted">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="container-x grid gap-3 pb-8">
              <Button href="/contact" className="w-full">Get a free quote</Button>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-center text-sm font-semibold text-ink-2">Call {phone}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
