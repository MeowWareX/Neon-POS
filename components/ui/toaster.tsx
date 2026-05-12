"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      position="top-center"
      toastOptions={{
        className: "!border-white/10 !bg-[#120325] !text-white",
      }}
    />
  );
}
