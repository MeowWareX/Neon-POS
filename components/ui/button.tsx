import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-ring/70 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_24px_-2px_rgba(255,62,171,0.35)] hover:shadow-[0_0_28px_rgba(255,62,171,0.55)] hover:brightness-110 border border-pink-400/30",
        secondary:
          "bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_20px_-2px_rgba(0,240,255,0.3)] hover:shadow-[0_0_26px_rgba(0,240,255,0.5)] hover:brightness-105 border border-cyan-300/40",
        emerald:
          "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:shadow-[0_0_26px_rgba(16,185,129,0.5)] hover:brightness-105 border border-emerald-300/40",
        success:
          "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_-2px_rgba(16,185,129,0.3)] hover:shadow-[0_0_26px_rgba(16,185,129,0.5)] hover:brightness-105 border border-emerald-300/40",
        glass:
          "glass-panel text-foreground border border-white/15 hover:border-pink-500/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,62,171,0.2)]",
        ghost:
          "border border-white/10 bg-white/5 text-foreground hover:bg-white/10 hover:border-white/20",
        outline:
          "border border-white/15 bg-transparent text-foreground hover:bg-white/8 hover:border-white/30",
        destructive:
          "bg-destructive text-white shadow-[0_0_20px_rgba(255,71,102,0.35)] hover:brightness-110 border border-destructive/40",
      },
      size: {
        xs: "h-8 rounded-lg px-3 text-xs",
        sm: "h-10 rounded-xl px-4 text-xs font-medium",
        default: "h-12 px-5 text-sm",
        lg: "h-14 rounded-[1.25rem] px-6 text-base font-bold",
        xl: "h-16 rounded-[1.4rem] px-8 text-lg font-extrabold",
        icon: "size-12 rounded-2xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

