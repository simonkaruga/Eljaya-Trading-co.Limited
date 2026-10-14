import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { getSettings } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const fraunces = localFont({
  src: [
    { path: './fonts/fraunces.woff2', style: 'normal', weight: '100 900' },
    { path: './fonts/fraunces-italic.woff2', style: 'italic', weight: '100 900' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
});
const manrope = localFont({ src: './fonts/manrope.woff2', weight: '200 800', variable: '--font-manrope', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seoTitle, template: `%s | ${s.name}` },
    description: s.seoDescription,
    openGraph: {
      type: 'website',
      locale: 'en_KE',
      siteName: s.name,
      images: s.ogImage ? [{ url: s.ogImage.src, width: s.ogImage.w, height: s.ogImage.h, alt: s.ogImage.alt }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
  };
}

export const viewport: Viewport = { themeColor: '#f7f5ef' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
