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
        "text-foreground placeholder:text-muted-foreground/70 flex min-h-28 w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm transition-all duration-200 outline-none hover:border-white/25 hover:bg-white/8 focus-visible:border-cyan-400/70 focus-visible:bg-white/10 focus-visible:ring-4 focus-visible:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
