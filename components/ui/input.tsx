import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-white/12 bg-white/6 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 outline-none hover:border-white/25 hover:bg-white/8 focus-visible:border-cyan-400/70 focus-visible:bg-white/10 focus-visible:ring-4 focus-visible:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

