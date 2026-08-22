import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[1.75rem] border border-dashed border-white/15 p-8 text-center",
        className,
      )}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display mt-4 text-base font-bold tracking-wide text-white uppercase sm:text-lg">
        {title}
      </h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-xs leading-relaxed sm:text-sm">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
