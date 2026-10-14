import Link from 'next/link';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import { Lightbulb } from 'lucide-react';
import type { Img, RichText } from '@/lib/types';
import { SmartImage } from './SmartImage';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mb-5 mt-14 text-3xl leading-tight sm:text-4xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-4 mt-10 text-2xl">{children}</h3>,
    normal: ({ children }) => <p className="my-5 text-[1.08rem] leading-[1.8] text-ink-2">{children}</p>,
    blockquote: ({ children }) => <blockquote className="my-10 border-l-2 border-leaf pl-6 font-display text-2xl leading-snug">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 space-y-3 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="my-6 list-decimal space-y-3 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-[1.05rem] leading-relaxed text-ink-2"><span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-leaf" /><span>{children}</span></li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const cls = 'font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 hover:decoration-leaf';
      return href.startsWith('/') ? <Link href={href} className={cls}>{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
    },
  },
  types: {
    image: ({ value }: { value: { img?: Img; caption?: string } }) =>
      value.img ? (
        <figure className="my-10">
          <SmartImage image={value.img} sizes="(max-width:768px) 100vw, 768px" className="w-full rounded-2xl" />
          {value.caption && <figcaption className="mt-3 text-center text-sm text-muted">{value.caption}</figcaption>}
        </figure>
      ) : null,
    callout: ({ value }: { value: { text?: string } }) => (
      <aside className="my-8 flex gap-4 rounded-2xl bg-lime/25 p-6">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-leaf" />
        <p className="leading-relaxed text-ink">{value.text}</p>
      </aside>
    ),
    table: ({ value }: { value: { rows?: { cells?: string[] }[] } }) => {
      const [head, ...rows] = value.rows ?? [];
      if (!head) return null;
      return (
        <div className="my-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[480px] text-left text-[0.95rem]">
            <thead className="bg-sand">
              <tr>{head.cells?.map((c, i) => <th key={i} className="px-5 py-3.5 font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  {r.cells?.map((c, j) => <td key={j} className={`px-5 py-3.5 ${j === r.cells!.length - 1 ? 'font-semibold text-leaf' : 'text-ink-2'}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export function PortableBody({ value }: { value?: RichText }) {
  if (!value?.length) return null;
  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
