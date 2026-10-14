'use client';

import { useSyncExternalStore } from 'react';
import { track } from './track';

/** One line in the visitor's quote basket (kept in localStorage until they submit). */
export type QuoteItem = {
  id: string;
  kind: 'service' | 'pack';
  slug?: string;
  product: string;
  option?: string;
  unitPrice?: number;
  minQty?: number;
  qty: number;
  decoration?: string;
  image?: string;
};

export const DECORATIONS = ['Screen print', 'Embroidery', 'Full-colour print (DTF)', 'Laser engraving', 'Not sure, advise me'];

const KEY = 'eljaya-quote-v1';
const EMPTY: QuoteItem[] = [];
let items: QuoteItem[] | null = null;
const listeners = new Set<() => void>();

function read(): QuoteItem[] {
  if (items) return items;
  try {
    items = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    items = [];
  }
  return items!;
}

function write(next: QuoteItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: basket still works for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { items = null; l(); }
  };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
}

export function useQuote() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const quote = {
  add(item: Omit<QuoteItem, 'id'>) {
    const list = read();
    const same = list.find((i) => i.product === item.product && i.option === item.option && i.decoration === item.decoration);
    if (same) write(list.map((i) => (i === same ? { ...i, qty: i.qty + item.qty } : i)));
    else write([...list, { ...item, id: Math.random().toString(36).slice(2, 10) }]);
    track('add_to_quote', { item: item.option ?? item.product, quantity: item.qty, value: (item.unitPrice ?? 0) * item.qty });
  },
  update(id: string, patch: Partial<QuoteItem>) {
    write(read().map((i) => (i.id === id ? { ...i, ...patch } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export const lineEstimate = (i: Pick<QuoteItem, 'unitPrice' | 'qty'>) => (i.unitPrice ? i.unitPrice * i.qty : 0);
export const ksh = (n: number) => `KSh ${Math.round(n).toLocaleString('en-KE')}`;
