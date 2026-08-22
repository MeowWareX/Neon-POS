import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "glass-card rounded-[1.5rem] border border-white/10 text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card/85 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]",
        elevated:
          "glass-panel-elevated shadow-[0_16px_48px_-6px_rgba(0,0,0,0.7)] border-white/15",
        interactive:
          "glass-interactive cursor-pointer hover:border-pink-500/40 hover:shadow-[0_0_24px_rgba(255,62,171,0.25)]",
        "glow-pink":
          "border-pink-500/40 shadow-[0_0_28px_-4px_rgba(255,62,171,0.3)] bg-gradient-to-b from-pink-950/20 via-card to-black/80",
        "glow-cyan":
          "border-cyan-400/40 shadow-[0_0_28px_-4px_rgba(0,240,255,0.25)] bg-gradient-to-b from-cyan-950/20 via-card to-black/80",
        "glow-emerald":
          "border-emerald-400/40 shadow-[0_0_28px_-4px_rgba(16,185,129,0.25)] bg-gradient-to-b from-emerald-950/20 via-card to-black/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-bold tracking-[0.12em] text-white uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-xs leading-relaxed sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-white/5 px-6 pt-0 pt-4 pb-6",
        className,
      )}
      {...props}
    />
  );
}
