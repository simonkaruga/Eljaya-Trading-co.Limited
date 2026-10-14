import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow, title, text, align = 'left', className = '', children,
}: { eyebrow?: string; title: React.ReactNode; text?: string; align?: 'left' | 'center'; className?: string; children?: React.ReactNode }) {
  const center = align === 'center';
  return (
    <div className={`flex flex-col gap-6 ${center ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'} ${className}`}>
      <Reveal className={center ? 'max-w-3xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-4 text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{title}</h2>
        {text && <p className={`mt-5 text-lg leading-relaxed text-ink-2 ${center ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>{text}</p>}
      </Reveal>
      {children && <Reveal delay={0.1} className="shrink-0">{children}</Reveal>}
    </div>
  );
}
