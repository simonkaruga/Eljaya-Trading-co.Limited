import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';
import { SmartImage } from './SmartImage';

export function ProjectCard({ project: p, className = '', aspect = 'aspect-[4/5]', sizes = '(max-width:768px) 100vw, 50vw' }: { project: Project; className?: string; aspect?: string; sizes?: string }) {
  return (
    <Link href={`/portfolio/${p.slug}`} className={`group block ${className}`}>
      <div className={`relative overflow-hidden rounded-[1.5rem] bg-sand ${aspect}`}>
        <SmartImage image={p.cover} fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-forest/0 transition-colors duration-500 group-hover:bg-forest/20" />
        <span className="absolute right-5 top-5 grid size-12 scale-75 place-items-center rounded-full bg-lime text-forest opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
        {!!p.tags?.length && (
          <ul className="absolute bottom-5 left-5 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">{t}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl leading-tight transition-colors group-hover:text-leaf sm:text-[1.7rem]">{p.title}</h3>
          <p className="mt-1.5 text-sm text-muted">{[p.client, p.industry].filter(Boolean).join(' · ')}</p>
        </div>
        {p.year && <span className="mt-1 text-sm text-muted">{p.year}</span>}
      </div>
    </Link>
  );
}
