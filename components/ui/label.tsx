import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-muted mb-2 block text-xs font-semibold tracking-[0.18em] uppercase",
        className,
      )}
      {...props}
    />
  );
}
