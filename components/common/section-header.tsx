import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  badge,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="font-display text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        {action}
      </div>
    </div>
  );
}

