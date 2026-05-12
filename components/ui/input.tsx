import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "text-foreground placeholder:text-muted focus-visible:ring-ring/70 flex h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-sm outline-none focus-visible:ring-4",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
