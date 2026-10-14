'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { quote } from '@/lib/quote';

export function AddPack({ title, minQty, image }: { title: string; minQty?: number; image?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        quote.add({ kind: 'pack', product: title, qty: minQty ?? 20, minQty, image });
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      }}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${done ? 'bg-leaf text-white' : 'bg-ink text-paper hover:bg-leaf'}`}
    >
      {done ? <><Check className="size-4" /> Added to quote</> : <><Plus className="size-4" /> Add to quote</>}
    </button>
  );
}
