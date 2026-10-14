import { Button } from '@/components/Button';
import { LeafMark } from '@/components/icons';

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70svh] place-items-center py-24 text-center">
      <div>
        <LeafMark className="mx-auto size-14 text-leaf" />
        <p className="mt-8 font-display text-8xl">404</p>
        <h1 className="mt-4 text-3xl">This page has wandered off.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">The link may be old or mistyped. Let’s get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/services" variant="outline" icon={false}>Browse services</Button>
        </div>
      </div>
    </section>
  );
}
