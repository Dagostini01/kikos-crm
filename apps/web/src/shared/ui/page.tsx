import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Page({
  title,
  description,
  actions,
  className,
  children,
}: PageProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
