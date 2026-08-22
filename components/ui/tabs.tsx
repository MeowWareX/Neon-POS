"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "glass-panel inline-flex h-auto w-full items-center gap-1 rounded-[1.25rem] border border-white/10 p-1.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "text-muted-foreground focus-visible:ring-ring/70 inline-flex flex-1 items-center justify-center rounded-[0.9rem] border border-transparent px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:text-white focus-visible:ring-4 focus-visible:outline-none data-[state=active]:border-pink-500/40 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/25 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_16px_rgba(255,62,171,0.25)] sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
