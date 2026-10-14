import { Phone } from 'lucide-react';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { LeafMark } from './icons';

export function CtaBand({ heading, text, phone }: { heading: string; text: string; phone: string }) {
  return (
    <section className="container-x pb-20 lg:pb-28">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-leaf px-6 py-16 text-center text-white sm:px-12 lg:py-24">
        <LeafMark aria-hidden className="absolute -left-16 -top-10 -z-10 size-72 rotate-12 text-white/[0.07]" />
        <LeafMark aria-hidden className="absolute -bottom-20 -right-10 -z-10 size-96 -rotate-12 text-white/[0.07]" />
        <h2 className="mx-auto max-w-3xl text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{heading}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{text}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/contact">Request a free quote</Button>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold transition-colors hover:bg-white hover:text-leaf">
            <Phone className="size-4" /> {phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
