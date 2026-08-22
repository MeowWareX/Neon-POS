"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer focus-visible:ring-ring/70 inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-white/15 bg-white/10 transition-all duration-200 focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-pink-500/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-600 data-[state=checked]:shadow-[0_0_16px_rgba(255,62,171,0.35)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-6 translate-x-1 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 data-[state=checked]:translate-x-7" />
    </SwitchPrimitive.Root>
  );
}
