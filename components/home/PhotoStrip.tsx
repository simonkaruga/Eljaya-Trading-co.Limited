import type { Img } from '@/lib/types';
import { SmartImage } from '../SmartImage';

/** Two rows of photos gliding in opposite directions. Pauses on hover. */
export function PhotoStrip({ images }: { images: Img[] }) {
  if (images.length < 4) return null;
  const half = Math.ceil(images.length / 2);
  const rows = [images.slice(0, half), images.slice(half)];

  const tile = (img: Img, i: number, hidden: boolean) => {
    const ratio = img.w && img.h ? img.w / img.h : 1.3;
    // Portrait shots get a narrower tile, landscape a wider one
    const width = ratio < 0.9 ? 'w-[11rem] sm:w-[15rem]' : ratio > 1.4 ? 'w-[20rem] sm:w-[27rem]' : 'w-[15rem] sm:w-[20rem]';
    return (
      <li key={`${img.src}-${i}`} aria-hidden={hidden} className={`group relative h-44 shrink-0 overflow-hidden rounded-[1.25rem] bg-sand sm:h-64 ${width}`}>
        <SmartImage image={img} alt={hidden ? '' : undefined} fill sizes="(max-width:640px) 320px, 432px" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110" />
      </li>
    );
  };

  return (
    <div className="group/strip space-y-3 overflow-hidden py-2 sm:space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      {rows.map((row, r) => (
        <div key={r} className="flex" style={{ ['--marquee-duration' as string]: `${row.length * 7}s` }}>
          <ul className={`flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 group-hover/strip:[animation-play-state:paused] ${r ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
            {row.map((img, i) => tile(img, i, false))}
            {row.map((img, i) => tile(img, i + row.length, true))}
          </ul>
        </div>
      ))}
    </div>
  );
}
