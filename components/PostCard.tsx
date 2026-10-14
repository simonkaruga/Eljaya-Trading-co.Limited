import Link from 'next/link';
import type { Post } from '@/lib/types';
import { SmartImage } from './SmartImage';

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function PostCard({ post: p, large }: { post: Post; large?: boolean }) {
  return (
    <Link href={`/news/${p.slug}`} className="group flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[1.5rem] bg-sand ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {p.cover && <SmartImage image={p.cover} fill sizes={large ? '(max-width:1024px) 100vw, 60vw' : '(max-width:768px) 100vw, 33vw'} className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />}
        {p.category && <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold backdrop-blur">{p.category}</span>}
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted">
        <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
        {p.readTime && <><span className="size-1 rounded-full bg-muted" />{p.readTime} min read</>}
      </div>
      <h3 className={`mt-3 text-balance leading-tight transition-colors group-hover:text-leaf ${large ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
      <p className="mt-3 line-clamp-2 text-ink-2">{p.excerpt}</p>
    </Link>
  );
}
