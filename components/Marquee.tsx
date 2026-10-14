import { LeafMark } from './icons';

/** Infinite horizontal ticker. Content is duplicated once so the loop is seamless. */
export function Marquee({ items, className = '', duration = 40 }: { items: string[]; className?: string; duration?: number }) {
  if (!items.length) return null;
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
          <span className="whitespace-nowrap">{t}</span>
          <LeafMark className="size-5 shrink-0 text-leaf" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`group flex overflow-hidden ${className}`} style={{ ['--marquee-duration' as string]: `${duration}s` }}>
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
