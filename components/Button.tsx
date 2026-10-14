import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Variant = 'primary' | 'dark' | 'outline' | 'light' | 'ghost-light';

const styles: Record<Variant, string> = {
  primary: 'bg-lime text-forest hover:bg-ink hover:text-paper',
  dark: 'bg-ink text-paper hover:bg-leaf',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  light: 'bg-paper text-ink hover:bg-lime',
  'ghost-light': 'border border-white/30 text-white hover:bg-white hover:text-ink backdrop-blur-sm',
};

export function Button({
  href, children, variant = 'primary', icon = true, className = '', external,
}: { href: string; children: React.ReactNode; variant?: Variant; icon?: boolean; className?: string; external?: boolean }) {
  const cls = `group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold transition-colors duration-300 ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="relative grid size-5 place-items-center overflow-hidden">
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
