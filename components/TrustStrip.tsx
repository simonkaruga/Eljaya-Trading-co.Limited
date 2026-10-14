import { BadgeCheck, Clock3, Smartphone, Truck } from 'lucide-react';

const POINTS = [
  { icon: Clock3, title: 'Quote within 24 hours', text: 'Replies within 2 hours in business hours' },
  { icon: BadgeCheck, title: 'Sample before bulk', text: 'Approve colour & print before production' },
  { icon: Truck, title: 'Nairobi delivery included', text: 'Courier countrywide on request' },
  { icon: Smartphone, title: '50% deposit via M-Pesa', text: 'Balance on completion, bank or cash too' },
];

/** The reassurances that close B2B orders, shown near every buying decision. */
export function TrustStrip({ className = '' }: { className?: string }) {
  return (
    <section aria-label="Why order with us" className={`container-x ${className}`}>
      <ul className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-4 bg-paper p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime/40 text-leaf-dark"><Icon className="size-5" /></span>
            <span>
              <span className="block font-semibold leading-snug">{title}</span>
              <span className="mt-0.5 block text-sm text-ink-2">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
