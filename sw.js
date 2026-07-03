// Service Worker — Eljaya Trading Co.
const CACHE = 'eljaya-v1';
const PRECACHE = [
  '/',
  '/style.min.css',
  '/fa.min.css',
  '/script.min.js',
  '/images/eljaya-hero.webp',
  '/images/elijaya-logo.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
