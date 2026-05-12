import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-ring/70",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,79,216,0.28)] hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(55,214,255,0.22)] hover:brightness-110",
        ghost:
          "border border-white/10 bg-white/5 text-foreground hover:bg-white/10",
        outline:
          "border border-white/12 bg-transparent text-foreground hover:bg-white/6",
        destructive: "bg-destructive text-white hover:brightness-110",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-16 rounded-[1.4rem] px-6 text-base",
        icon: "size-12",
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
