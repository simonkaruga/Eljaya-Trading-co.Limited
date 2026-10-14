'use client';

import type { Project, Service } from '@/lib/types';
import { FilterGrid } from './FilterGrid';
import { CATEGORY_LABELS, ServiceCard } from './ServiceCard';
import { ProjectCard } from './ProjectCard';

export function ServicesBrowser({ services, className }: { services: Service[]; className: string }) {
  return (
    <FilterGrid
      items={services}
      param="category"
      options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
      getValue={(s) => s.category}
      className={className}
      render={(s) => <ServiceCard service={s} />}
    />
  );
}

export function PortfolioBrowser({ projects, className }: { projects: Project[]; className: string }) {
  const industries = [...new Set(projects.map((p) => p.industry).filter(Boolean))] as string[];
  return (
    <FilterGrid
      items={projects}
      param="industry"
      options={industries.map((i) => ({ value: i, label: i }))}
      getValue={(p) => p.industry}
      className={className}
      render={(p, i) => <ProjectCard project={p} aspect={i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} />}
    />
  );
}
