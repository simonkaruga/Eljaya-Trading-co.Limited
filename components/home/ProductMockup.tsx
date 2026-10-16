'use client';

import { useId } from 'react';

/**
 * Vector product mockups with an exact print area per product, so a logo
 * always lands where it would really be printed. Shading is drawn as
 * black/white overlays, so every product can be shown in any colour.
 */
export type MockupKind = 'tshirt' | 'polo' | 'tote' | 'mug' | 'cap' | 'bottle';

type Spec = {
  body: string;            // main silhouette (filled with the product colour, also clips the logo)
  print: { x: number; y: number; w: number; h: number };
  details: (dark: string, light: string) => React.ReactNode;
  cylinder?: boolean;      // horizontal wrap shading (mugs, bottles)
};

const SPECS: Record<MockupKind, Spec> = {
  tshirt: {
    body: 'M150 38 C170 58 230 58 250 38 L312 58 C332 66 352 86 372 112 L338 160 L304 138 L304 384 C236 396 164 396 96 384 L96 138 L62 160 L28 112 C48 86 68 66 88 58 Z',
    print: { x: 148, y: 104, w: 104, h: 116 },
    details: (dark) => (
      <>
        <path d="M150 38 C166 70 234 70 250 38 C232 58 168 58 150 38 Z" fill={dark} opacity={0.55} />
        <path d="M150 38 C168 64 232 64 250 38" fill="none" stroke={dark} strokeOpacity={0.35} strokeWidth={5} />
        <path d="M96 138 C100 110 104 84 114 60 M304 138 C300 110 296 84 286 60" fill="none" stroke={dark} strokeOpacity={0.18} strokeWidth={2} />
        <path d="M62 160 L28 112 M338 160 L372 112" stroke={dark} strokeOpacity={0.12} strokeWidth={6} />
        <path d="M98 372 C164 384 236 384 302 372" fill="none" stroke={dark} strokeOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" />
      </>
    ),
  },
  polo: {
    body: 'M150 40 L250 40 L314 60 C334 70 352 90 368 114 L336 154 L304 136 L304 384 C236 396 164 396 96 384 L96 136 L64 154 L32 114 C48 90 66 70 86 60 Z',
    print: { x: 226, y: 112, w: 56, h: 46 },
    details: (dark, light) => (
      <>
        <rect x={191} y={70} width={18} height={84} rx={3} fill={dark} opacity={0.12} />
        <circle cx={200} cy={96} r={3.5} fill={light} stroke={dark} strokeOpacity={0.4} />
        <circle cx={200} cy={126} r={3.5} fill={light} stroke={dark} strokeOpacity={0.4} />
        <path d="M150 40 L200 74 L176 96 L138 52 Z" fill={light} opacity={0.18} stroke={dark} strokeOpacity={0.35} strokeWidth={2} />
        <path d="M250 40 L200 74 L224 96 L262 52 Z" fill={light} opacity={0.18} stroke={dark} strokeOpacity={0.35} strokeWidth={2} />
        <path d="M64 154 L32 114 M336 154 L368 114" stroke={dark} strokeOpacity={0.22} strokeWidth={8} />
        <path d="M96 136 C100 110 104 86 112 62 M304 136 C300 110 296 86 288 62" fill="none" stroke={dark} strokeOpacity={0.18} strokeWidth={2} />
        <path d="M98 372 C164 384 236 384 302 372" fill="none" stroke={dark} strokeOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" />
      </>
    ),
  },
  tote: {
    body: 'M92 146 L308 146 L312 386 C240 394 160 394 88 386 Z',
    print: { x: 124, y: 186, w: 152, h: 150 },
    details: (dark, light) => (
      <>
        <path d="M150 150 C150 46 250 46 250 150" fill="none" stroke={dark} strokeOpacity={0.35} strokeWidth={18} />
        <path d="M150 150 C150 52 250 52 250 150" fill="none" stroke={light} strokeOpacity={0.12} strokeWidth={6} />
        <rect x={92} y={146} width={216} height={20} fill={dark} opacity={0.1} />
        <path d="M96 166 L304 166" stroke={dark} strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 4" />
      </>
    ),
  },
  mug: {
    body: 'M104 112 L104 326 C104 356 288 356 288 326 L288 112 Z',
    print: { x: 134, y: 162, w: 124, h: 118 },
    cylinder: true,
    details: (dark, light) => (
      <>
        <path d="M288 150 C356 150 362 280 288 292" fill="none" stroke={dark} strokeOpacity={0.25} strokeWidth={24} />
        <ellipse cx={196} cy={112} rx={92} ry={18} fill={light} opacity={0.35} />
        <ellipse cx={196} cy={114} rx={82} ry={13} fill={dark} opacity={0.35} />
      </>
    ),
  },
  cap: {
    body: 'M78 254 C78 122 140 70 200 70 C260 70 322 122 322 254 C330 292 282 326 200 326 C118 326 70 292 78 254 Z',
    print: { x: 148, y: 132, w: 104, h: 84 },
    details: (dark) => (
      <>
        <path d="M72 252 C112 238 288 238 328 252 C332 300 282 330 200 330 C118 330 68 300 72 252 Z" fill={dark} opacity={0.28} />
        <path d="M200 72 L200 246 M200 72 C160 118 142 178 140 248 M200 72 C240 118 258 178 260 248" fill="none" stroke={dark} strokeOpacity={0.16} strokeWidth={2} />
        <circle cx={200} cy={74} r={9} fill={dark} opacity={0.3} />
        <path d="M100 244 C150 232 250 232 300 244" fill="none" stroke={dark} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 4" />
      </>
    ),
  },
  bottle: {
    body: 'M168 92 L232 92 L242 124 C258 132 262 146 262 162 L262 362 C262 380 248 392 230 392 L170 392 C152 392 138 380 138 362 L138 162 C138 146 142 132 158 124 Z',
    print: { x: 156, y: 196, w: 88, h: 116 },
    cylinder: true,
    details: (dark) => (
      <>
        <rect x={164} y={38} width={72} height={58} rx={12} fill={dark} opacity={0.75} />
        <rect x={164} y={50} width={72} height={4} fill="#fff" opacity={0.15} />
      </>
    ),
  },
};

export const MOCKUP_RATIO = '400 / 420';

export function ProductMockup({
  kind, color, logo, scale = 1, whiteInk = false, className,
}: { kind: MockupKind; color: string; logo?: string | null; scale?: number; whiteInk?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  const spec = SPECS[kind];
  const p = spec.print;
  const w = p.w * scale;
  const h = p.h * scale;
  const light = isLight(color);
  const dark = '#000';

  return (
    <svg viewBox="0 0 400 420" className={className} role="img" aria-label={`${kind} mockup`}>
      <defs>
        <clipPath id={`clip-${id}`}><path d={spec.body} /></clipPath>
        <linearGradient id={`side-${id}`} x1="0" x2="1">
          {spec.cylinder ? (
            <>
              <stop offset="0" stopColor="#000" stopOpacity="0.28" />
              <stop offset="0.22" stopColor="#fff" stopOpacity="0.28" />
              <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.8" stopColor="#000" stopOpacity="0.05" />
              <stop offset="1" stopColor="#000" stopOpacity="0.32" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#000" stopOpacity="0.16" />
              <stop offset="0.2" stopColor="#000" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="0.8" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.18" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`top-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.5 0" />
        </filter>
        <filter id={`white-${id}`}>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0f241a" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Product */}
      <g filter={`url(#shadow-${id})`}>
        <path d={spec.body} fill={color} />
      </g>
      {spec.details(dark, '#fff')}

      {/* Logo, clipped to the product so it can never spill off the edge */}
      {logo && (
        <g clipPath={`url(#clip-${id})`}>
          <image
            href={logo}
            x={p.x + (p.w - w) / 2}
            y={p.y + (p.h - h) / 2}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid meet"
            filter={whiteInk ? `url(#white-${id})` : undefined}
            style={{ mixBlendMode: light && !whiteInk ? 'multiply' : 'normal' }}
            opacity={0.95}
          />
        </g>
      )}

      {/* Light, fold shading and fabric grain on top of everything */}
      <g clipPath={`url(#clip-${id})`} pointerEvents="none">
        <rect width="400" height="420" fill={`url(#side-${id})`} />
        <rect width="400" height="420" fill={`url(#top-${id})`} />
        {!spec.cylinder && (
          <>
            <path d="M140 170 C150 240 140 310 150 380" stroke="#000" strokeOpacity="0.05" strokeWidth="14" fill="none" />
            <path d="M262 180 C254 250 266 320 256 380" stroke="#fff" strokeOpacity="0.06" strokeWidth="18" fill="none" />
          </>
        )}
        <rect width="400" height="420" filter={`url(#grain-${id})`} opacity={kind === 'bottle' || kind === 'mug' ? 0.04 : 0.1} style={{ mixBlendMode: 'multiply' }} />
      </g>
    </svg>
  );
}

function isLight(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}
