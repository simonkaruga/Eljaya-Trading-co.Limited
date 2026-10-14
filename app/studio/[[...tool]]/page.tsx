import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';
import { sanityEnabled } from '@/lib/sanity/env';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  if (!sanityEnabled) {
    return (
      <div className="grid min-h-svh place-items-center bg-forest p-6 text-paper">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl">Admin panel not connected yet</h1>
          <p className="mt-4 text-paper/70">
            Set <code className="text-lime">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your environment variables (see the README), then redeploy.
          </p>
        </div>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
