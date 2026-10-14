import type { ClientLogo } from '@/lib/types';
import { SmartImage } from './SmartImage';

export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  if (!logos.length) return null;
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden}>
      {logos.map((l) => (
        <li key={l._id} className="relative h-12 w-32 shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
          <SmartImage image={l.logo} alt={l.name} fill sizes="128px" className="object-contain" />
        </li>
      ))}
    </ul>
  );
  return (
    <section className="border-y border-line py-12" aria-label="Clients">
      <p className="container-x mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted">Trusted by businesses across Kenya</p>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">{row()}{row(true)}</div>
      </div>
    </section>
  );
}
