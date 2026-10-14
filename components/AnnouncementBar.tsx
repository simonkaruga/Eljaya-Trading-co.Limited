import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Settings } from '@/lib/types';

export function AnnouncementBar({ announcement }: { announcement: Settings['announcement'] }) {
  if (!announcement?.enabled || !announcement.text) return null;
  const content = (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block size-1.5 animate-pulse rounded-full bg-lime" />
      {announcement.text}
      {announcement.link && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />}
    </span>
  );
  return (
    <div className="bg-forest text-[0.8rem] font-medium text-paper/90">
      <div className="container-x py-2.5 text-center">
        {announcement.link ? (
          <Link href={announcement.link} className="group hover:text-lime">{content}</Link>
        ) : content}
      </div>
    </div>
  );
}
