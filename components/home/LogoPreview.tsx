'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, ImageUp, Maximize2, Plus, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { track } from '@/lib/track';
import { quote, useQuote } from '@/lib/quote';
import { setPreviewLogo, usePreviewLogo } from '@/lib/previewLogo';
import { WhatsAppIcon } from '../icons';
import { ProductMockup, type MockupKind } from './ProductMockup';

/**
 * "See your logo on it": the visitor drops in their logo and sees it printed
 * in the right place on each product, in any colour. Nothing is uploaded; the
 * image stays in the browser until they send it with a quote request.
 */
type Colour = { name: string; hex: string };

const APPAREL: Colour[] = [
  { name: 'White', hex: '#f3f2ee' }, { name: 'Black', hex: '#1d1f21' }, { name: 'Navy', hex: '#1f2b4a' },
  { name: 'Forest green', hex: '#1f5f2e' }, { name: 'Red', hex: '#b3262e' }, { name: 'Grey', hex: '#9aa0a6' },
  { name: 'Sky blue', hex: '#3b82c4' }, { name: 'Yellow', hex: '#e8b923' },
];

const PRODUCTS: { kind: MockupKind; name: string; slug: string; print: string; colours: Colour[] }[] = [
  { kind: 'tshirt', name: 'T-shirt', slug: 'corporate-apparel', print: 'Front, centre chest', colours: APPAREL },
  { kind: 'polo', name: 'Polo shirt', slug: 'corporate-apparel', print: 'Left chest', colours: [APPAREL[2], ...APPAREL.filter((_, i) => i !== 2)] },
  { kind: 'tote', name: 'Tote bag', slug: 'jute-eco-bags', print: 'Front panel', colours: [{ name: 'Natural canvas', hex: '#e9dcc3' }, { name: 'Jute', hex: '#c9a66b' }, APPAREL[1], APPAREL[2], APPAREL[3]] },
  { kind: 'mug', name: 'Mug', slug: 'branded-bottles', print: 'Wrap, front', colours: [APPAREL[0], APPAREL[1], APPAREL[3], APPAREL[4], APPAREL[2]] },
  { kind: 'cap', name: 'Cap', slug: 'branded-caps', print: 'Front panel', colours: [APPAREL[1], APPAREL[0], APPAREL[2], APPAREL[3], APPAREL[4], APPAREL[7]] },
  { kind: 'bottle', name: 'Water bottle', slug: 'branded-bottles', print: 'Front, engraved or printed', colours: [{ name: 'Steel', hex: '#c9ced3' }, APPAREL[0], APPAREL[1], APPAREL[3], APPAREL[2], APPAREL[4]] },
];

const SAMPLE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120"><rect x="6" y="6" width="228" height="108" rx="18" fill="none" stroke="#1f5f2e" stroke-width="8" stroke-dasharray="14 10"/><text x="120" y="76" text-anchor="middle" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#1f5f2e">YOUR LOGO</text></svg>`,
  );

const isDark = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 < 0.45;
};

export function LogoPreview({ whatsapp }: { whatsapp: string }) {
  const saved = usePreviewLogo();
  const logo = saved?.dataUrl ?? null;
  const fileName = saved?.name ?? '';
  const [scale, setScale] = useState(1);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [colours, setColours] = useState<Record<string, number>>({});
  const [whiteInk, setWhiteInk] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const basket = useQuote();

  function load(file?: File) {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image (PNG, JPG, SVG or WebP).');
    if (file.size > 4 * 1024 * 1024) return setError('That file is over 4MB. Please use a smaller version of your logo.');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewLogo({ name: file.name, dataUrl: String(reader.result) });
      track('logo_preview', { item: file.type });
    };
    reader.readAsDataURL(file);
  }

  const shown = logo ?? SAMPLE;
  const colourOf = (i: number) => PRODUCTS[i].colours[colours[PRODUCTS[i].kind] ?? 0];
  const pick = (i: number, c: number) => setColours((s) => ({ ...s, [PRODUCTS[i].kind]: c }));

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Controls */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files?.[0]); }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed p-8 text-center transition-colors ${drag ? 'border-leaf bg-leaf/10' : 'border-ink/20 bg-white/60 hover:border-leaf hover:bg-white'}`}
          >
            {logo ? (
              <span className="relative grid h-20 w-40 place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="Your logo" className="max-h-20 max-w-40 object-contain" />
              </span>
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-lime text-forest"><ImageUp className="size-7" /></span>
            )}
            <span className="font-semibold">{logo ? fileName || 'Your logo' : 'Drop your logo here'}</span>
            <span className="text-sm text-muted">{logo ? 'Click to choose another file' : 'or click to choose · PNG with transparent background works best'}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => load(e.target.files?.[0])} />
          </label>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}

          <div className="mt-6">
            <label htmlFor="logo-size" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
              Logo size <span>{Math.round(scale * 100)}%</span>
            </label>
            <input id="logo-size" type="range" min={0.5} max={1.2} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-leaf)]" />
          </div>
          <label className="mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-white/60 px-4 py-3 text-sm font-medium">
            <span>White print on dark colours <span className="block text-xs font-normal text-muted">Light products keep your logo’s colours</span></span>
            <input type="checkbox" checked={whiteInk} onChange={(e) => setWhiteInk(e.target.checked)} className="size-5 accent-[var(--color-leaf)]" />
          </label>

          <div className="mt-7 grid gap-2.5">
            <Link
              href={basket.length ? '/quote' : '#products'}
              onClick={() => track('logo_preview_quote')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-semibold text-paper transition-colors hover:bg-leaf"
            >
              {basket.length ? `Send my quote (${basket.length}) with this logo` : 'Pick products for a quote'} <ArrowUpRight className="size-4" />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi Eljaya, I previewed my logo on your website and would like a quote. I’ll send the logo here.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition-colors hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
            >
              <WhatsAppIcon className="size-5" /> Send it on WhatsApp
            </a>
            {logo && (
              <button type="button" onClick={() => { setPreviewLogo(null); setScale(1); }} className="mt-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-ink">
                <RotateCcw className="size-3.5" /> Start over
              </button>
            )}
          </div>
          <p className="mt-6 flex gap-2 text-xs leading-relaxed text-muted">
            <ShieldCheck className="size-4 shrink-0 text-leaf" />
            Your logo stays on your device. It’s only sent to us if you request a quote. Final positions and colours are confirmed on your proof.
          </p>
        </div>
      </div>

      {/* Products */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-8 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => {
          const c = colourOf(i);
          return (
            <motion.li
              key={p.kind}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-[1.25rem] border border-line bg-white/70 p-2"
            >
              <button
                type="button"
                onClick={() => { setOpen(i); track('logo_preview_zoom', { item: p.name }); }}
                className="group relative block aspect-square overflow-hidden rounded-[1rem] bg-gradient-to-b from-paper to-sand"
                aria-label={`View ${p.name} with your logo up close`}
              >
                <ProductMockup kind={p.kind} color={c.hex} logo={shown} scale={scale} whiteInk={isDark(c.hex) && (whiteInk || !logo)} className="size-full p-3 transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity group-hover:opacity-100"><Maximize2 className="size-3.5" /></span>
              </button>
              {logo && !whiteInk && isDark(c.hex) && (
                <button type="button" onClick={() => setWhiteInk(true)} className="mx-1.5 mt-2 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-lime hover:bg-ink">
                  Dark product? Try white print
                </button>
              )}
              <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-2.5">
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="flex -space-x-1">
                  {p.colours.slice(0, 4).map((col, k) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => pick(i, k)}
                      aria-label={`${p.name} in ${col.name}`}
                      className={`size-5 rounded-full border-2 transition-transform hover:scale-125 ${k === (colours[p.kind] ?? 0) ? 'z-10 border-leaf' : 'border-white'}`}
                      style={{ background: col.hex }}
                    />
                  ))}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>

      {/* Close-up view */}
      <AnimatePresence>
        {open !== null && (
          <CloseUp
            product={PRODUCTS[open]}
            colourIndex={colours[PRODUCTS[open].kind] ?? 0}
            onColour={(k) => pick(open, k)}
            logo={shown}
            hasLogo={Boolean(logo)}
            scale={scale}
            onScale={setScale}
            whiteInk={whiteInk}
            onWhiteInk={setWhiteInk}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CloseUp({
  product: p, colourIndex, onColour, logo, hasLogo, scale, onScale, whiteInk, onWhiteInk, onClose,
}: {
  product: (typeof PRODUCTS)[number];
  colourIndex: number;
  onColour: (k: number) => void;
  logo: string;
  hasLogo: boolean;
  scale: number;
  onScale: (n: number) => void;
  whiteInk: boolean;
  onWhiteInk: (b: boolean) => void;
  onClose: () => void;
}) {
  const [added, setAdded] = useState(false);
  const c = p.colours[colourIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [onClose]);

  const add = () => {
    quote.add({ kind: 'service', slug: p.slug, product: p.name, option: `${p.name}, ${c.name}`, qty: 50, decoration: 'Not sure, advise me' });
    setAdded(true);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} with your logo`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[94svh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-paper sm:rounded-[2rem] md:grid-cols-2"
      >
        <div className="relative bg-gradient-to-b from-paper to-sand p-6 sm:p-10">
          <ProductMockup kind={p.kind} color={c.hex} logo={logo} scale={scale} whiteInk={isDark(c.hex) && (whiteInk || !hasLogo)} className="mx-auto w-full max-w-sm" />
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-paper shadow md:hidden"><X className="size-5" /></button>
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Your logo on</p>
              <h3 className="mt-2 text-4xl">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">Print position: {p.print}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="hidden size-10 shrink-0 place-items-center rounded-full border border-line hover:bg-sand md:grid"><X className="size-5" /></button>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Colour: <span className="text-ink">{c.name}</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.colours.map((col, k) => (
              <button
                key={col.name}
                type="button"
                onClick={() => onColour(k)}
                aria-label={col.name}
                aria-pressed={k === colourIndex}
                className={`grid size-9 place-items-center rounded-full border-2 transition-transform hover:scale-110 ${k === colourIndex ? 'border-leaf' : 'border-line'}`}
                style={{ background: col.hex }}
              >
                {k === colourIndex && <Check className={`size-4 ${isDark(col.hex) ? 'text-white' : 'text-ink'}`} />}
              </button>
            ))}
          </div>

          <label htmlFor="closeup-size" className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
            Logo size <span>{Math.round(scale * 100)}%</span>
          </label>
          <input id="closeup-size" type="range" min={0.5} max={1.2} step={0.05} value={scale} onChange={(e) => onScale(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-leaf)]" />
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={whiteInk} onChange={(e) => onWhiteInk(e.target.checked)} className="size-5 accent-[var(--color-leaf)]" />
            White print on dark colours
          </label>

          <div className="mt-auto grid gap-2.5 pt-8">
            <button type="button" onClick={add} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold transition-colors ${added ? 'bg-leaf text-white' : 'bg-lime text-forest hover:bg-ink hover:text-paper'}`}>
              {added ? <><Check className="size-4" /> Added to your quote</> : <><Plus className="size-4" /> Add {c.name.toLowerCase()} {p.name.toLowerCase()} to quote</>}
            </button>
            {added ? (
              <Link href="/quote" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-paper hover:bg-leaf">View my quote <ArrowUpRight className="size-4" /></Link>
            ) : (
              <Link href={`/services/${p.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold hover:border-ink">See prices & options <ArrowUpRight className="size-4" /></Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
