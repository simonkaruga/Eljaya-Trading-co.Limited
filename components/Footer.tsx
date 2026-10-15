import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import type { Service, Settings } from '@/lib/types';
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon } from './icons';
import { NAV } from './nav';

export function Footer({ settings: s, services }: { settings: Settings; services: Service[] }) {
  const socials = [
    { href: `https://wa.me/${s.whatsapp}`, label: 'WhatsApp', Icon: WhatsAppIcon },
    { href: s.socials.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: s.socials.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: s.socials.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: s.socials.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((x) => x.href);

  return (
    <footer className="relative overflow-hidden bg-forest text-paper">
      <div className="container-x pt-20 lg:pt-28">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow !text-lime">Start a project</p>
            <h2 className="mt-5 max-w-2xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Have something in mind? <em className="font-light text-lime">Let’s brand it.</em>
            </h2>
          </div>
          <Link
            href="/contact"
            className="group flex size-36 shrink-0 items-center justify-center rounded-full bg-lime text-center font-semibold text-forest transition-transform duration-500 ease-out-expo hover:scale-105 sm:size-44"
          >
            <span className="flex flex-col items-center gap-1">
              Get a quote
              <ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </Link>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image src="/logo-mark.png" alt="" width={34} height={44} className="h-11 w-auto" />
              <span className="font-display text-xl">{s.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/60">
              Custom branded merchandise, corporate apparel and eco-friendly packaging, made in Nairobi for businesses across Kenya.
            </p>
            <ul className="mt-7 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-paper/80 transition-colors hover:border-lime hover:bg-lime hover:text-forest">
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterCol title="Services" className="lg:col-span-3">
            {services.slice(0, 6).map((sv) => (
              <li key={sv._id}><Link href={`/services/${sv.slug}`} className="hover:text-lime">{sv.title}</Link></li>
            ))}
          </FooterCol>

          <FooterCol title="Company" className="lg:col-span-2">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-lime">{n.label}</Link></li>)}
          </FooterCol>

          <FooterCol title="Visit & contact" className="lg:col-span-3">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-lime" />{s.address}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-lime" /><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="hover:text-lime">{s.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-lime" /><a href={`mailto:${s.email}`} className="break-all hover:text-lime">{s.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-lime" />{s.hours}</li>
          </FooterCol>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mt-10 translate-y-[18%] whitespace-nowrap text-center font-display text-[24vw] font-semibold leading-none tracking-tighter text-white/[0.04]">
          Eljaya
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Eljaya Trading Co. Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-paper">Privacy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
            <Link href="/credits" className="hover:text-paper">Photo credits</Link>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span>
              Website by{' '}
              <a
                href={`https://wa.me/254797033513?text=${encodeURIComponent('Hi Avinaya Solutions, I saw the Eljaya website and I’d like a website too.')}`}
                target="_blank"
                rel="noopener noreferrer"
                data-no-track
                className="font-semibold text-paper/70 hover:text-lime"
              >
                Avinaya Solutions Ltd
              </a>
              {' · '}
              <a href="tel:+254797033513" data-no-track className="hover:text-paper">+254 797 033 513</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-paper/40">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-paper/80">{children}</ul>
    </div>
  );
}
