import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// Old static-site URLs → new routes (keeps Google rankings and shared links working)
const legacy: [string, string][] = [
  ['/index.html', '/'],
  ['/about.html', '/about'],
  ['/services.html', '/services'],
  ['/portfolio.html', '/portfolio'],
  ['/process.html', '/about#process'],
  ['/testimonials.html', '/news'],
  ['/contact.html', '/contact'],
  ['/privacy.html', '/privacy'],
  ['/terms.html', '/terms'],
  ['/blog-branded-merchandise-cost-kenya.html', '/news/branded-merchandise-cost-kenya'],
  ['/blog-corporate-gift-ideas-nairobi.html', '/news/corporate-gift-ideas-nairobi'],
  ['/blog-eco-friendly-packaging-kenya.html', '/news/eco-friendly-packaging-kenya'],
  ['/blog', '/news'],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.eljayatradingco.com' }], destination: 'https://eljayatradingco.com/:path*', permanent: true },
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: '/admin', destination: '/studio', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Always re-check the retiring service worker so old cached copies of the site get cleared
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }, { key: 'Service-Worker-Allowed', value: '/' }] },
      { source: '/((?!studio).*)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
    ];
  },
};

export default nextConfig;
