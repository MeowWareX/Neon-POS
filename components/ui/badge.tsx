import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-[0.15em] transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-pink-500/40 bg-pink-500/15 text-pink-300 shadow-[0_0_12px_rgba(255,62,171,0.2)]",
        secondary:
          "border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]",
        success:
          "border-emerald-400/40 bg-emerald-400/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        warning:
          "border-amber-400/40 bg-amber-400/15 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.2)]",
        purple:
          "border-purple-400/40 bg-purple-400/15 text-purple-300 shadow-[0_0_12px_rgba(147,51,234,0.2)]",
        destructive:
          "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_12px_rgba(255,71,102,0.2)]",
        glass: "glass-panel border-white/20 text-slate-200",
        outline: "border-white/15 bg-transparent text-slate-300",
        muted: "border-white/10 bg-white/5 text-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-xs font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
