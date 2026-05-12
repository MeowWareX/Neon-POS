import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "text-foreground placeholder:text-muted focus-visible:ring-ring/70 flex min-h-28 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm outline-none focus-visible:ring-4",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
