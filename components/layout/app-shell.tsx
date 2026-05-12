"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  CupSoda,
  LogOut,
  Package,
  ReceiptText,
  Settings2,
  Wallet,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useAuthStore } from "@/stores/auth-store";

const navItems: Array<{
  href: Route;
  label: string;
  icon: typeof CupSoda;
  adminOnly?: boolean;
}> = [
  { href: "/pos", label: "POS", icon: CupSoda },
  { href: "/orders", label: "Pedidos", icon: ReceiptText },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, adminOnly: true },
  { href: "/inventory", label: "Inventario", icon: Package, adminOnly: true },
  { href: "/flavors", label: "Sabores", icon: Settings2, adminOnly: true },
  {
    href: "/configuration",
    label: "Configuración",
    icon: Settings2,
    adminOnly: true,
  },
  { href: "/cash", label: "Caja", icon: Wallet },
  { href: "/accounting", label: "Finanzas", icon: CreditCard, adminOnly: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isOnline = useNetworkStatus();

  const visibleItems = navItems.filter((item) =>
    item.adminOnly ? user?.role === "admin" : true,
  );

  return (
    <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-black/18 p-5 md:flex md:flex-col">
        <div className="glass-panel rounded-4xl border border-white/10 p-5">
          <p className="font-display text-primary text-2xl tracking-[0.3em]">
            NEON
          </p>
          <p className="text-muted mt-2 text-sm">
            Fast POS para operación de fin de semana.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={isOnline ? "success" : "warning"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant="muted">
              {user?.role === "admin" ? "Admin" : "Operador"}
            </Badge>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "border-primary/40 bg-primary/12 text-white shadow-[0_0_22px_rgba(255,79,216,0.18)]"
                    : "text-muted border-white/8 bg-white/4 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="glass-panel mt-auto rounded-[1.75rem] border border-white/10 p-4">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-muted mt-1 text-sm">{user?.email}</p>
          <Button
            className="mt-4 w-full"
            size="sm"
            variant="ghost"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#090014]/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-primary text-lg tracking-[0.24em] uppercase md:hidden">
                NEON OS
              </p>
              <p className="text-muted text-sm">
                {isOnline ? "Sincronización activa" : "Modo offline activo"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? "success" : "warning"}>
                {isOnline ? (
                  <>
                    <Wifi className="mr-1 size-3" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="mr-1 size-3" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 pb-24 md:px-8 md:pb-8">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[#090014]/92 p-3 backdrop-blur-xl md:hidden">
          <div className="grid grid-cols-4 gap-2">
            {visibleItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center rounded-[1.3rem] border text-xs font-semibold transition-all",
                    active
                      ? "border-primary/30 bg-primary/12 text-white"
                      : "text-muted border-white/8 bg-white/4",
                  )}
                >
                  <Icon className="mb-1 size-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
