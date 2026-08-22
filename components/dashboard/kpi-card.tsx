import * as React from "react";
import { TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon = TrendingUp,
  variant = "default",
}: {
  label: string;
  value: string;
  hint: string;
  icon?: LucideIcon;
  variant?: "default" | "pink" | "cyan" | "emerald";
}) {
  const iconVariants = {
    default: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    pink: "border-pink-500/30 bg-pink-500/10 text-pink-300",
    cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <Card className="glass-interactive overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {label}
          </p>
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-xl border",
              iconVariants[variant],
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <p className="font-display mt-4 text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
          {value}
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {hint}
        </p>
      </CardContent>
    </Card>
  );
}
