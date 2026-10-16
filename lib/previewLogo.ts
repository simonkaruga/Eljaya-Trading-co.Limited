'use client';

import { useSyncExternalStore } from 'react';

/** The logo a visitor tried in the homepage preview (kept for this browser tab only). */
export type PreviewLogo = { name: string; dataUrl: string };

const KEY = 'eljaya-preview-logo';
const listeners = new Set<() => void>();
let cache: PreviewLogo | null | undefined;

function read(): PreviewLogo | null {
  if (cache !== undefined) return cache;
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    cache = v?.dataUrl ? v : null;
  } catch {
    cache = null;
  }
  return cache ?? null;
}

export function setPreviewLogo(logo: PreviewLogo | null) {
  cache = logo;
  try {
    if (logo) sessionStorage.setItem(KEY, JSON.stringify(logo));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* too large or storage blocked: the preview still works for this page */
  }
  listeners.forEach((l) => l());
}

export function usePreviewLogo() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    read,
    () => null,
  );
}
