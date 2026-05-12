"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      router.replace("/login");
    }
  }, [hydrated, router, user]);

  if (!hydrated || (!user && pathname !== "/login")) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="glass-panel w-full max-w-sm rounded-[2rem] border border-white/10 p-8 text-center">
          <div className="mx-auto h-3 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto mt-4 h-8 w-48 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto mt-6 h-14 w-full animate-pulse rounded-[1.5rem] bg-white/8" />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
